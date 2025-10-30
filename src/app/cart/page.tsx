"use client";
import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  getUserInfo,
} from "@/lib/api";
import { useCustNotification } from "@/context/NotificationProvider";
import { DeleteOutlined } from "@ant-design/icons";
import { InputNumber, Button, Input, Card, Typography } from "antd";
import Spinner from "@/components/Spinner";
import TextArea from "antd/es/input/TextArea";
import StripeCheckout from "@/components/stripeCheckout";
import CheckoutPage from "../checkout/page";
// import PaypalCheckout from "@/components/paypalCheckout";

const { Title } = Typography;

export default function CartPage() {
  const custNotification = useCustNotification();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // User info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // ======================
  // Fetch Cart & User Info
  // ======================
  const fetchCartAndUser = async () => {
    try {
      setLoading(true);
      const [cartData, userData] = await Promise.all([getCart(), getUserInfo()]);
      setCart(cartData.cart || []);
      setName(userData?.user?.name || "");
      setPhone(userData?.user?.phone || "");
      setAddress(userData?.user?.addresses?.[0] || "");
    } catch (err: any) {
      custNotification.error(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartAndUser();
  }, []);

  // ======================
  // Update Quantity
  // ======================
  const handleQuantityChange = async (productId: string, value: number) => {
    if (!value || value < 1 || value > 5) {
      custNotification.error("Quantity should be 1 to 5");
      return;
    }
    try {
      const data = await updateCartItem(productId, value);
      setCart(data.cart || []);
      custNotification.success("Quantity updated");
    } catch (err: any) {
      custNotification.error(err.message || "Failed to update quantity");
    }
  };

  // ======================
  // Remove Item
  // ======================
  const handleRemove = async (productId: string) => {
    try {
      const data = await removeFromCart(productId);
      setCart(data.cart || []);
      custNotification.success("Item removed");
    } catch (err: any) {
      custNotification.error(err.message || "Failed to remove item");
    }
  };

  // ======================
  // Calculate Total
  // ======================
  const totalPrice = cart?.reduce((acc, item: any) => {
    const price = item?.finalPrice || 0;
    return acc + price * (item?.quantity || 0);
  }, 0);

  // ======================
  // Checkout Handler
  // ======================
  const handleCheckout = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      custNotification.error("Please fill in all shipping details before checkout");
      return;
    }

    // Proceed with checkout logic
    custNotification.success("Checkout successful!");
    console.log({ name, phone, address, cart, totalPrice });
  };

  const handlePaymentSuccess = (details: any) => {
    console.log("Payment successful:", details);
    // Call your backend to save order info if needed
  };


  if (loading) return <Spinner />;

  if (cart.length === 0)
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-600">
        Your cart is empty 🛒
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* ================== Shipping Info ================== */}
      {/* <Card className="shadow-lg rounded-2xl p-6">
        <Title level={3}>Shipping Details</Title>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="large"
            required
          />
          <Input
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            size="large"
            required
          />
        </div>
        <TextArea
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          size="large"
          className="mt-4"
          required
        />
      </Card> */}

      {/* ================== Cart Items ================== */}
      <div className="space-y-6 mt-4">
        {cart.map((item: any) => (
          <Card
            key={item.productId._id}
            className="flex items-center justify-between shadow-sm rounded-2xl p-4 m-2"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.productId.images?.[0] || "/placeholder.png"}
                alt={item.productId.name}
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <div>
                <Title level={5}>{item.productId.name}</Title>
                <p>
                  ₹{item?.finalPrice} × {item.quantity} ={" "}
                  <strong>₹{item?.finalPrice * item?.quantity}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <InputNumber
                min={1}
                max={5}
                value={item.quantity}
                onChange={(val) => handleQuantityChange(item.productId._id, val)}
              />
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemove(item.productId._id)}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* ================== Total ================== */}
      <div className="mt-8 flex justify-between items-center border-t pt-4">
        <Title level={4}>Total:</Title>
        <Title level={3} className="text-blue-600">
          ₹{totalPrice}
        </Title>
      </div>

      {/* <Button
        type="primary"
        block
        size="large"
        className="!rounded-xl !text-lg"
        onClick={handleCheckout}
      >
        Checkout
      </Button> */}
       <CheckoutPage cart={cart} />
    </div>
  );
}
