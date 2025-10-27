import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/helper";
import User from "@/models/User";

// =====================
// GET: Fetch Cart
// =====================

const formatCartWithFinalPrice = (cart: any[]) =>
  cart?.map((item: any) => {
    const price = item?.productId?.price || 0;
    const discount = item?.productId?.discount || 0;

    // ✅ Correct percentage discount
    const finalPrice = price - discount;

    return {
      ...item._doc,
      finalPrice,
    };
  });


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
      "name price discount images" // only these fields
    );
console.log(user);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const cartWithFinalPrice = formatCartWithFinalPrice(user.cart);

    return NextResponse.json(
      {
        message: "Cart fetched successfully",
        cart: cartWithFinalPrice,
      },
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
export const POST = async (request: NextRequest) => {
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

    const user = await User.findById(userPayload.id).populate(
      "cart.productId",
      "name price discount images" // only these fields
    );
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    const availableItem = user.cart.find(
      (item: any) => item.productId?._id?.toString() === productId
    );

    if (availableItem && availableItem.quantity + quantity > 5) {
      return NextResponse.json(
        { message: "Maximum quantity exceeded" },
        { status: 403 }
      );
    }

    if (availableItem) {
      user.cart.forEach((item: any) => {
        if (item.productId?._id.toString() === productId) {
          item.quantity += quantity;
        }
      });
    } else {
      user.cart.push({ productId, quantity });
    }


    await user.save();

    const cartWithFinalPrice = formatCartWithFinalPrice(user.cart);

    return NextResponse.json(
      { message: "Item added successfully", cart: cartWithFinalPrice },
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
export const PATCH = async (request: NextRequest) => {
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

    const user = await User.findById(userPayload.id).populate(
      "cart.productId",
      "name price discount images" // only these fields
    );
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const itemIndex = user.cart.findIndex(
      (item: any) => item.productId._id.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { message: "Item not found in cart" },
        { status: 404 }
      );
    }

    user.cart[itemIndex].quantity = quantity;
    await user.save();

    const cartWithFinalPrice = formatCartWithFinalPrice(user.cart);

    return NextResponse.json(
      { message: "Quantity updated successfully", cart: cartWithFinalPrice },
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
export const DELETE = async (request: NextRequest) => {
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

    const user = await User.findById(userPayload.id).populate(
      "cart.productId",
      "name price discount images" // only these fields
    );
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const updatedCart = user.cart.filter(
      (item: any) => item.productId._id.toString() !== productId
    );

    // ✅ Assign correctly without breaking `DocumentArray` type
    user.cart.splice(0, user.cart.length, ...updatedCart);

    user.markModified("cart");
    await user.save();

    const cartWithFinalPrice = formatCartWithFinalPrice(user.cart);

    return NextResponse.json(
      { message: "Item removed successfully", cart: cartWithFinalPrice },
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
