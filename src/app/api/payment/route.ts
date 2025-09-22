import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { orderAmount, customerEmail, customerPhone } = await req.json();

    // ✅ Create order using Cashfree API
    const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID!,       // from dashboard
        "x-client-secret": process.env.CASHFREE_SECRET_KEY!, // from dashboard
        "x-api-version": "2022-09-01",
      },
      body: JSON.stringify({
        order_amount: orderAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: `CUST_${Date.now()}`,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_note: "Test order", // optional
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: 400 });
    }

    // Send back order details including `payment_session_id`
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Cashfree order error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
};
