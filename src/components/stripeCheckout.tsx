"use client";

import { FC, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface StripeCheckoutProps {
  amount: number;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm: FC<{ clientSecret: string }> = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // can be replaced with a thank-you page
      },
    });

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
    } else {
      alert("Payment Successful!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Complete Payment</h2>
      <div className="space-y-2">
        <label className="block text-gray-600">Card Details</label>
        <div className="p-3 border rounded-md bg-gray-50">
          <PaymentElement />
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const StripeCheckout: FC<StripeCheckoutProps> = ({ amount }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Call backend to create payment intent
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  if (!clientSecret) return <p className="text-center mt-10">Loading payment...</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
};

export default StripeCheckout;
