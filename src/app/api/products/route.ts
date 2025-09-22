// src/app/api/products/route.ts

import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { ROLES } from "@/constants/constant";
import { getAuthenticatedUser } from "@/lib/helper";
import User from "@/models/User";
import mongoose from "mongoose";

export const GET = async (request: NextRequest) => {
  try {
    await connectToDatabase();

    // Get the search parameters from the request URL
    const searchParams = request.nextUrl.searchParams;
    const sellerId = searchParams.get("sellerId");

    // Create a filter object. Empty by default
    const filter: Record<string, unknown> = {};

    // If a sellerId is provided, add it to the filter
    if (sellerId) {
      filter.sellerId = sellerId;
    }

    // Find products with filter
    const products = await Product.find(filter);
    console.log("Products fetched from DB:", products);

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 }
      );
    }

    // 🔹 Get logged-in user to check favorites
    const userPayload = await getAuthenticatedUser();
    let favorites: string[] = [];

    if (userPayload) {
      const user = await User.findById(userPayload.id);
      if (user) {
        favorites = user.favorites.map((fav: mongoose.Types.ObjectId) =>
          fav.toString()
        );
      }
    }

    // 🔹 Add isFavorite flag to each product
    const productsWithFavorite = products.map((product: InstanceType<typeof Product>) => ({
      ...product.toObject(),
      isFavorite: favorites.includes(product._id.toString()),
    }));

    return NextResponse.json(
      {
        message: "Products fetched successfully",
        products: productsWithFavorite,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log("Getting products error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ message }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
    try {
        await connectToDatabase();

    const userPayload = await getAuthenticatedUser([ROLES.ADMIN, ROLES.SELLER]);
    if (!userPayload) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
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

    if (!name || !description || !price || !stock || !category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      discount,
      stock,
      category,
      images,
      video,
      sellerId: userPayload.id,
    });

    return NextResponse.json(
      { message: "Product created successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.log("Creating product error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ message }, { status: 500 });
  }
};
