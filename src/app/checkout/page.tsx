"use client";
import { useState } from "react";

declare global {
  interface Window {
    Cashfree?: any;
  }
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    // 1. Ask backend to create Cashfree order
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderAmount: 500, // ₹500 for example
        customerEmail: "test@example.com",
        customerPhone: "9999999999",
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert("Payment init failed: " + data.error?.message || "Unknown error");
      setLoading(false);
      return;
    }

    // 2. Start Cashfree checkout
    const cashfree = new window.Cashfree({ mode: "sandbox" }); // change to "production" later
    cashfree.checkout({
      paymentSessionId: data.payment_session_id,
      redirectTarget: "_self", // or "_blank"
    });

    setLoading(false);
  };

  return (
    <div>
      <h1>Pay with Cashfree</h1>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {/* Load Cashfree Checkout SDK */}
      <script src="https://sdk.cashfree.com/js/ui/2.0.0/cashfree.js"></script>
    </div>
  );
}
