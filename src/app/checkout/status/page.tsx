"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { checkPaymentStatus } from "@/lib/api";

export default function PaymentSuccess() {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const [paymentDetails, setPaymentDetails] = useState<string | null>(null);

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  useEffect(() => {
    if (orderId) {
      (async () => {
        const data = await checkPaymentStatus(orderId);
console.log('III',data)
        setPaymentDetails(data[0]);
      })();
    }
  }, [orderId]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
      <p>
        Order ID: <strong>{orderId}</strong>
      </p>
      <p>
        Status: <strong>{paymentDetails?.payment_status === "SUCCESS" ? "Success" : "Failed"}</strong>
      </p>
      <p>
Order Amount: <strong>{paymentDetails?.order_amount || 'N/A'} {paymentDetails?.payment_currency || ''}</strong>
</p>
<p>
Payment Time: <strong>{formatDate(paymentDetails?.payment_time) || 'N/A'}</strong>
</p>
    </div>
  );
}
