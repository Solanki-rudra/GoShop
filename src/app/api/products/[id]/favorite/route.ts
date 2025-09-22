// src/app/api/products/[id]/favorite/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/helper";
import User from "@/models/User";
import mongoose from "mongoose";

export const POST = async (req: NextRequest, context: { params: { id: string } }) => {
  try {
    await connectToDatabase();

    const userPayload = await getAuthenticatedUser();
    if (!userPayload) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const user = await User.findById(userPayload.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const productId = new mongoose.Types.ObjectId(context.params.id);
    const index = user.favorites.findIndex(
      (favId: mongoose.Types.ObjectId) => favId.toString() === productId.toString()
    );

    let isFavorite = false; // ✅ Track the new state

    if (index > -1) {
      // Remove favorite
      user.favorites.splice(index, 1);
      isFavorite = false;
    } else {
      // Add favorite
      user.favorites.push(productId);
      isFavorite = true;
    }

    await user.save();

    return NextResponse.json(
      {
        message: "Favorites updated",
        isFavorite,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log("Favorite toggle error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { message: "Server error", error: message },
      { status: 500 }
    );
  }
};
