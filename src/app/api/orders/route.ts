import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import { getAuthenticatedUser } from "@/lib/helper";
import { connectToDatabase } from "@/lib/db";

export const POST = async (req: NextRequest) => {
  await connectToDatabase();
  const user = await getAuthenticatedUser();

  const { cart, shippingAddress } = await req.json();

  if (!cart || cart.length === 0) {
    return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
  }

  // Calculate total amount
  const totalAmount = cart?.reduce(
    (sum: number, item: any) => sum + item?.finalPrice * item?.quantity,
    0
  );

  // Format items for DB
  const items = cart.map((item: any) => ({
    productId: item.productId._id,
    quantity: item.quantity,
    purchasePrice: item.finalPrice,
  }));

  // Create a mock paymentId for sandbox
  const paymentId = `PAY_${Date.now()}`;

  // Create order
  const newOrder = await Order.create({
    userId: user.id,
    items,
    shippingAddress,
    totalAmount,
    paymentId,
    status: "pending",
  });

  return NextResponse.json({
    message: "Order created",
    orderId: newOrder._id.toString(),
    totalAmount,
    paymentId,
  });
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();

    // Authenticate the user
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    // const isAdmin = user.role === "admin";

    const orders = await Order.find({ userId: user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      message: "Orders fetched successfully",
      orders: orders || [],
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};