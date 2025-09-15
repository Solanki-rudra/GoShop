// src/app/api/products/[id]/route.ts

import { ROLES } from "@/constants/constant";
import { connectToDatabase } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/helper";
import Product from "@/models/Product";
import User from "@/models/User";
import { NextResponse } from "next/server";

interface Params {
    params: {
        id: string;
    };
}

export const GET = async (request: Request, { params }: Params) => {
    try {
        await connectToDatabase();

        const product = await Product.findById(params.id);
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

        // ✅ Embed isFavorite into the product object
        productObj.isFavorite = isFavorite;

        return NextResponse.json(
            { message: "Product fetched successfully", product: productObj },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.log("Getting product error: ", error);

        const message =
            error instanceof Error ? error.message : "Internal server error";

        return NextResponse.json(
            { message: "Server error", error: message },
            { status: 500 }
        );
    }
};

export const PUT = async (request: Request, { params }: Params) => {
    try {
        await connectToDatabase();

        const userPayload = await getAuthenticatedUser([ROLES.ADMIN, ROLES.SELLER]);
        if (!userPayload) {
            return NextResponse.json(
                { message: "Not authorized" },
                { status: 403 }
            );
        }

        const {
            name,
            description,
            price,
            discount,
            stock,
            category,
            images,
            video,
        } = await request.json();

        if (!name || !description || !price || !stock || !category || images.length === 0) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            params.id,
            { name, description, price, discount, stock, category, images, video },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Product updated successfully", updatedProduct },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.log("Updating product error: ", error);

        const message =
            error instanceof Error ? error.message : "Internal server error";

        return NextResponse.json(
            { message: "Server error", error: message },
            { status: 500 }
        );
    }
};

export const DELETE = async (request: Request, { params }: Params) => {
    try {
        await connectToDatabase();

        const userPayload = await getAuthenticatedUser([ROLES.ADMIN, ROLES.SELLER]);
        if (!userPayload) {
            return NextResponse.json(
                { message: "Not authorized" },
                { status: 403 }
            );
        }

        const deletedProduct = await Product.findByIdAndDelete(params.id);

        if (!deletedProduct) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Product deleted successfully", deletedProduct },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.log("Deleting product error: ", error);

        const message =
            error instanceof Error ? error.message : "Internal server error";

        return NextResponse.json(
            { message: "Server error", error: message },
            { status: 500 }
        );
    }
};
