import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15" as Stripe.LatestApiVersion,
});

export async function POST(req: Request) {
  const { amount }: { amount: number } = await req.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "INR",
      payment_method_types: ["card"],
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Payment processing error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
