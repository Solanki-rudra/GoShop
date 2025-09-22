// src/app/api/products/[id]/route.ts

import { ROLES } from "@/constants/constant";
import { connectToDatabase } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/helper";
import Product from "@/models/Product";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, context: { params: { id: string } }) => {
  try {
    await connectToDatabase();

    const product = await Product.findById(context.params.id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Convert to a plain object to modify it
    const productObj = product.toObject();

    const userPayload = await getAuthenticatedUser();
    let isFavorite = false;

    if (userPayload) {
      const user = await User.findById(userPayload.id).select("favorites").lean();
      if (user?.favorites.some((favId) => favId.toString() === product._id.toString())) {
        isFavorite = true;
      }
    }
    
    // ✅ Key Change: Embed isFavorite directly into the product object.
    // This makes the data structure consistent with the GET /api/products route.
    productObj.isFavorite = isFavorite;

    return NextResponse.json(
      { message: "Product fetched successfully", product: productObj },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Getting product error: ", error);
    return NextResponse.json(
      { message: "Server error", error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
};

// ... (PUT and DELETE methods remain unchanged)

export const PUT = async (request: NextRequest, context: { params: { id: string } }) => {
    try {
        await connectToDatabase()

        const userPayload = await getAuthenticatedUser([ROLES.ADMIN, ROLES.SELLER])
        if (!userPayload) {
            return NextResponse.json(
                { message: "Not authorized" },
                { status: 403 }
            )
        }

        const { name, description, price, discount, stock, category, images, video } = await request.json();

        if (!name || !description || !price || !stock || !category || images.length === 0) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            context.params.id,
            { name, description, price, discount, stock, category, images, video },
            { new: true, runValidators: true }
        )

        if (!updatedProduct) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { message: "Product updated successfully", updatedProduct },
            { status: 200 }
        )

    } catch (error: any) {
        console.log('Getting product error: ', error)
        return NextResponse.json(
            { message: "Server error", error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export const DELETE = async (request: NextRequest, context: { params: { id: string } }) => {
    try {
        await connectToDatabase()

        const userPayload = await getAuthenticatedUser([ROLES.ADMIN, ROLES.SELLER])
        if (!userPayload) {
            return NextResponse.json(
                { message: "Not authorized" },
                { status: 403 }
            )
        }

        const deletedProduct = await Product.findByIdAndDelete(context.params.id)

        if (!deletedProduct) {
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(
            { message: "Product deleted successfully", deletedProduct },
            { status: 200 }
        )
    } catch (error: any) {
        console.log('Getting product error: ', error)
        return NextResponse.json(
            { message: "Server error", error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}