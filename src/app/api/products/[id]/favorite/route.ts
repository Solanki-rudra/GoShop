// product/[id]/favorite/route.js

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/helper";
import User from "@/models/User";
import mongoose from "mongoose";

interface Params {
  params: { id: string };
}

export const POST = async (req: Request, { params }: Params) => {
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

    const productId = new mongoose.Types.ObjectId(params.id);
    const index = user.favorites.findIndex(
      (favId: any) => favId.toString() === productId.toString()
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

    // ✅ Key Change: Return the new favorite status directly.
    // This is much more efficient than sending the entire favorites array.
    return NextResponse.json(
      {
        message: "Favorites updated",
        isFavorite, // Send back the new boolean status
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Favorite toggle error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  console.log("GET method not allowed on this route");
  return NextResponse.json(
    { message: "GET method not allowed" },
    { status: 405 }
  );
}