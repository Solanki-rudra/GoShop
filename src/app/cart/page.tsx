"use client";
import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeFromCart,
} from "@/lib/api";
import { useCustNotification } from "@/context/NotificationProvider";
import { DeleteOutlined } from "@ant-design/icons";
import { InputNumber, Button } from "antd";

export default function CartPage() {
  const custNotification = useCustNotification();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // Fetch Cart
  // ======================
  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data.cart || []);
    } catch (err: any) {
      custNotification.error(err.message || "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ======================
  // Update Quantity
  // ======================
  const handleQuantityChange = async (productId: string, value: number | null) => {
    if (!value || value < 1) return; // prevent NaN / invalid
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
      const data = await removeFromCart(productId); // make sure removeFromCart sends { productId } if API expects it
      setCart(data.cart || []);
      custNotification.success("Item removed");
    } catch (err: any) {
      custNotification.error(err.message || "Failed to remove item");
    }
  };

  // ======================
  // Calculate Total
  // ======================
  const totalPrice = cart.reduce((acc, item: any) => {
    const price = item.productId?.price || 0;
    return acc + price * (item.quantity || 0);
  }, 0);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-500">
        Loading your cart...
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-gray-600">
        Your cart is empty 🛒
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>

      <div className="space-y-6">
        {cart.map((item: any) => (
          <div
            key={item.productId._id}
            className="flex items-center justify-between border rounded-2xl p-4 shadow-sm"
          >
            {/* Product Info */}
            <div className="flex items-center gap-4">
              <img
                src={item.productId.images?.[0] || "/placeholder.png"}
                alt={item.productId.name}
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <div>
                <h2 className="text-lg font-medium text-gray-800">
                  {item.productId.name}
                </h2>
                <p className="text-sm text-gray-500">
                  ₹{item.productId.price} × {item.quantity} ={" "}
                  <span className="font-medium text-gray-800">
                    ₹{item.productId.price * item.quantity}
                  </span>
                </p>
              </div>
            </div>

            {/* Actions */}
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
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-8 flex justify-between items-center border-t pt-4">
        <span className="text-xl font-bold text-gray-800">Total:</span>
        <span className="text-2xl font-bold text-blue-600">₹{totalPrice}</span>
      </div>

      <Button
        type="primary"
        block
        className="mt-6 !py-3 !rounded-xl !text-lg"
      >
        Checkout
      </Button>
    </div>
  );
}
