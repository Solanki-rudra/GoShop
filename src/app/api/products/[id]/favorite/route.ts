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

    const user = await User.findById(userPayload._id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const productId = new mongoose.Types.ObjectId(params.id); // ✅ convert string → ObjectId

    const index = user.favorites.findIndex(
      (favId: any) => favId.toString() === productId.toString()
    );

    if (index > -1) {
      // Remove favorite
      user.favorites.splice(index, 1);
    } else {
      // Add favorite
      user.favorites.push(productId);
    }

    await user.save();

    return NextResponse.json(
      {
        message: "Favorites updated",
        favorites: user.favorites,
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
