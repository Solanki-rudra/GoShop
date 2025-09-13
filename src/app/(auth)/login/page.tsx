"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { useCustNotification } from "@/context/NotificationProvider";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Space,
} from "antd";
import { getUserFromLocalStorage, setUserToLocalStorage } from "@/lib/clientAuth";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const custNotification = useCustNotification();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (storedUser?.token) {
      router.replace("/"); // avoid going back to login
    }
  }, [router]);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await loginUser(values);
      custNotification.success(res?.message || "Logged in successfully");
      setUserToLocalStorage(res.user, res.user.token);
      if (res.user?.role === "customer") router.push("/");
      if (res.user?.role === "seller") router.push("/seller/products");
      if (res.user?.role === "admin") router.push("/admin/customers");

console.log(res)
    } catch (err: any) {
      custNotification.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <Card
        className="w-full max-w-md shadow-lg rounded-2xl border border-gray-100"
        bodyStyle={{ padding: "2rem" }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {/* Header */}
          <div className="text-center">
            <Title level={2} style={{ marginBottom: 0 }}>
              Welcome Back
            </Title>
            <Text type="secondary">Login to continue your journey 🚀</Text>
          </div>

          {/* Form */}
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
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

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password placeholder="••••••••" size="large" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <div className="text-center">
            <Text type="secondary">Don&apos;t have an account? </Text>
            <a href="/register">Register</a>
          </div>
        </Space>
      </Card>
    </div>
  );
}
