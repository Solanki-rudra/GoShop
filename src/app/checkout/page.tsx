"use client";

import { useState } from "react";
import { Button, Input, Form } from "antd";
import { createOrder, payment } from "@/lib/api";
import { useCustNotification } from "@/context/NotificationProvider";
import { getUserFromLocalStorage } from "@/lib/clientAuth";

export default function CheckoutPage({ cart }: any) {
  const notify = useCustNotification();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const user = getUserFromLocalStorage();

  const totalAmount = cart.reduce(
    (sum: number, item: any) => sum + item.finalPrice * item.quantity,
    0
  );

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const { shippingAddress, phone } = values;

      const { orderId } = await createOrder(cart, shippingAddress);

      const paymentData = await payment(
        totalAmount,
        orderId,
        "CASHFREE",
        "INR",
        user?._id,
        user?.email,
        phone,
        user?.name
      );

      const cashfree = await import("@cashfreepayments/cashfree-js");
      const cashfreeSDK = await cashfree.load({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV as "sandbox",
      });

      await cashfreeSDK.checkout({
        paymentSessionId: paymentData.payment_session_id,
        redirectTarget: "_self"
      });
    } catch (err: any) {
      notify.error(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Checkout</h1>
        <h2 className="text-lg font-bold mb-4 text-gray-600">{`Hey! 👋 ${user?.name || 'user'}, fill out details to proceed`}</h2>
        {/* Shipping Address */}
        <Form.Item
          label={<span className="font-semibold">Shipping Address</span>}
          name="shippingAddress"
          rules={[
            { required: true, message: "Shipping address is required" },
            { min: 10, message: "Address must be at least 10 characters" },
          ]}
        >
          <Input.TextArea rows={3} placeholder="Enter Full Address" />
        </Form.Item>

        {/* Phone Number */}
        <Form.Item
          label={<span className="font-semibold">Mobile Number</span>}
          name="phone"
          rules={[
            { required: true, message: "Mobile number is required" },
            {
              pattern: /^\d{10}$/,
              message: "Mobile number must be exactly 10 digits",
            },
          ]}
        >
          <Input
            maxLength={10}
            type="tel"
            inputMode="numeric"
            placeholder="Enter Mobile Number"
          />
        </Form.Item>

        {/* Amount Display */}
        <div className="text-xl font-bold mb-6 text-green-700">
          Total Payable: ₹{totalAmount}
        </div>

        <Button
          type="primary"
          htmlType="submit"
          className="w-full py-2 text-lg"
          loading={loading}
        >
          Pay Now
        </Button>
      </Form>
    </div>
  );
}
