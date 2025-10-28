import { NextRequest, NextResponse } from "next/server";

const CASHFREE_SANDBOX_API = "https://sandbox.cashfree.com/pg/orders";

export const POST = async (req: NextRequest) => {
  try {
    const { orderId, amount, currency, customerId, customerEmail, customerPhone, customerName } =
      await req.json();

    const res = await fetch(CASHFREE_SANDBOX_API, {
      method: "POST",
      headers: {
        "x-client-id": process.env.CASHFREE_CLIENT_ID!,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
        "x-api-version": "2022-09-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: amount,
        order_currency: currency,
        customer_details: {
          customer_id: customerId,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_name: customerName
        },
        // Redirect after payment
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/status?order_id={order_id}`,
// notify_url: 
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ message: data.message || "Payment init failed" }, { status: 400 });
    }

    // Return the session to the frontend
    return NextResponse.json({ payment_session_id: data.payment_session_id });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {

    const url = new URL(req.url);
    const order_id = url.searchParams.get("order_id"); // Extract orderId from query params

    if (!order_id) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
    }

    const res = await fetch(`${CASHFREE_SANDBOX_API}/${order_id}/payments`, {
      method: "GET",
      headers: {
        "x-client-id": process.env.CASHFREE_CLIENT_ID!,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
        "x-api-version": "2022-09-01",
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ message: data.message || "Failed to retrieve order status" }, { status: 400 });
    }

    // Return order status to the frontend
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};