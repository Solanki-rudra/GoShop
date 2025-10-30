"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
import { useCustNotification } from "@/context/NotificationProvider";

import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Space,
  Radio,
} from "antd";
import { getUserFromLocalStorage, setUserToLocalStorage } from "@/lib/clientAuth";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const router = useRouter();
  const custNotification = useCustNotification();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (storedUser?.token) {
      router.replace("/"); // avoid going back to login
    }
  }, [router]);

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
  }) => {
    setLoading(true);
    try {
      const res = await registerUser(values);
      custNotification.success(res?.message || "Registered successfully");
      setUserToLocalStorage(res.user, res.user.token);
      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        custNotification.error(err.message);
      } else {
        custNotification.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <Card
        className="w-full max-w-md shadow-lg rounded-2xl border border-gray-100"
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {/* Header */}
          <div className="text-center">
            <Title level={2} style={{ marginBottom: 0 }}>
              Create Account
            </Title>
            <Text type="secondary">Join us today! 🚀</Text>
          </div>

          {/* Form */}
          <Form
            name="register"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            initialValues={{ role: "buyer" }} // default role
          >
            {/* Name */}
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Please enter your full name" }]}
            >
              <Input placeholder="John Doe" size="large" />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="you@example.com" size="large" />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password placeholder="••••••••" size="large" />
            </Form.Item>

            {/* Phone */}
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { pattern: /^\+?\d{7,15}$/, message: "Enter a valid phone number" },
              ]}
            >
              <Input placeholder="+1234567890" size="large" />
            </Form.Item>

            {/* Role as Radio cards */}
            <Form.Item name="role" className="mb-4 flex justify-center">
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                className="w-full flex justify-between"
              >
                <Radio.Button
                  value="buyer"
                  className="flex-1 text-center py-4 px-2"
                >
                  <div className="font-semibold mb-2">Shopping</div>
                  <div className="text-xs text-gray-500">
                    Buy your dream products
                  </div>
                </Radio.Button>
                <Radio.Button
                  value="seller"
                  className="flex-1 text-center py-4 px-2"
                >
                  <div className="font-semibold mb-2">Selling</div>
                  <div className="text-xs text-gray-500">
                    Sell your products easily
                  </div>
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <div className="text-center">
            <Text type="secondary">Already have an account? </Text>
            <a href="/login">Login</a>
          </div>
        </Space>
      </Card>
    </div>
  );
}
