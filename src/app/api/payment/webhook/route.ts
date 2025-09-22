import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const payload = await req.json();
    console.log("Cashfree webhook payload:", payload);

    // ✅ TODO: Verify signature here using Cashfree docs
    // ✅ TODO: Update order status in your database

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
};
