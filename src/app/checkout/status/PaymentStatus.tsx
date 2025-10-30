"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { checkPaymentStatus } from "@/lib/api";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Spinner from "@/components/Spinner";

export default function PaymentStatus() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("order_id");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  function formatDate(dateStr: string) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  useEffect(() => {
    if (orderId) {
      (async () => {
        try {
          const data = await checkPaymentStatus(orderId);
          console.log("Payment status data:", data);
          setPaymentDetails(data[0]);
        } catch (err) {
          console.error("Error fetching payment status:", err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [orderId]);

  if (loading) return <Spinner />;

  const isSuccess = paymentDetails?.payment_status === "SUCCESS";

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <CheckCircleOutlined className="text-green-500 text-6xl" />
          ) : (
            <CloseCircleOutlined className="text-red-500 text-6xl" />
          )}
        </div>

        <h1 className="text-3xl font-bold mb-2">
          {isSuccess ? "Payment Successful 🎉" : "Payment Failed ❌"}
        </h1>
        <p className="text-gray-500 mb-6">
          {isSuccess
            ? "Your payment was completed successfully. Here are your payment details:"
            : paymentDetails?.error_details?.error_description ??
              "Something went wrong while processing your payment."}
        </p>

        <div className="bg-gray-100 rounded-xl p-5 text-left space-y-3">
          <p>
            <span className="font-semibold">Order ID:</span> {orderId}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`${
                isSuccess ? "text-green-600" : "text-red-600"
              } font-medium`}
            >
              {isSuccess ? "SUCCESS" : "FAILED"}
            </span>
          </p>
          <p>
            <span className="font-semibold">Amount:</span>{" "}
            {paymentDetails?.order_amount || "N/A"}{" "}
            {paymentDetails?.payment_currency || ""}
          </p>
          <p>
            <span className="font-semibold">Payment Time:</span>{" "}
            {formatDate(paymentDetails?.payment_time)}
          </p>
        </div>

        <div className="mt-8">
          {isSuccess ? (
            <Button onClick={() => router.push("/orders")} type="primary">
              Go to My Orders
            </Button>
          ) : (
            <Button onClick={() => router.push("/cart")} type="primary" danger>
              Back to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
