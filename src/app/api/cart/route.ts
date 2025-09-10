import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/helper";
import User from "@/models/User";

// =====================
// GET: Fetch Cart
// =====================
export const GET = async () => {
  try {
    await connectToDatabase();

    const userPayload: any = await getAuthenticatedUser();
    if (!userPayload) {
      return NextResponse.json(
        { message: "Not authorized" },
        { status: 403 }
      );
    }

    const user = await User.findById(userPayload.id).populate(
      "cart.productId",
      "name price image" // only these fields
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Cart fetched successfully", cart: user.cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Getting cart error : ", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};

// =====================
// POST: Add item to Cart
// =====================
export const POST = async (request: Request) => {
  try {
    await connectToDatabase();

    const userPayload = await getAuthenticatedUser();
    if (!userPayload) {
      return NextResponse.json(
        { message: "Not authorized" },
        { status: 403 }
      );
    }

    const { productId, quantity } = await request.json();

    if (!productId || !quantity || quantity > 5) {
      return NextResponse.json(
        { message: "Invalid values" },
        { status: 403 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const user = await User.findById(userPayload.id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const availableItem = user.cart.find(
      (item: any) => item.productId.toString() === productId
    );

    if (availableItem && availableItem.quantity + quantity > 5) {
      return NextResponse.json(
        { message: "Maximum quantity exceeded" },
        { status: 403 }
      );
    }

    if (availableItem) {
      user.cart = user.cart.map((item: any) =>
        item.productId.toString() === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    return NextResponse.json(
      { message: "Item added successfully", cart: user.cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Adding item error : ", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};

// =====================
// PATCH: Update Quantity
// =====================
export const PATCH = async (request: Request) => {
  try {
    await connectToDatabase();

    const userPayload = await getAuthenticatedUser();
    if (!userPayload) {
      return NextResponse.json(
        { message: "Not authorized" },
        { status: 403 }
      );
    }

    const { productId, quantity } = await request.json();

    if (!productId || quantity < 1 || quantity > 5) {
      return NextResponse.json(
        { message: "Invalid values" },
        { status: 403 }
      );
    }

    const user = await User.findById(userPayload.id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const itemIndex = user.cart.findIndex(
      (item: any) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 }
      );
    }

    user.cart[itemIndex].quantity = quantity;
    await user.save();

    return NextResponse.json(
      { message: "Quantity updated successfully", cart: user.cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Updating item error : ", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};

// =====================
// DELETE: Remove Item
// =====================
export const DELETE = async (request: Request) => {
  try {
    await connectToDatabase();

    const userPayload = await getAuthenticatedUser();
    if (!userPayload) {
      return NextResponse.json(
        { message: "Not authorized" },
        { status: 403 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID required" },
        { status: 403 }
      );
    }

    const user = await User.findById(userPayload.id);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    user.cart = user.cart.filter(
      (item: any) => item.productId.toString() !== productId
    );

    await user.save();

    return NextResponse.json(
      { message: "Item removed successfully", cart: user.cart },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Removing item error : ", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
