"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromLocalStorage } from "@/lib/clientAuth";
import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";
import { Content, Header } from "antd/es/layout/layout";
import { BRAND_NAME } from "@/constants/constant";
import Logout from "@/components/Logout";
import Footer from "@/components/Footer";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (!user || user.role !== "seller") {
      router.replace("/unauthorized"); // or redirect to "/"
    }
  }, [router]);

  return (
 <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div className="text-2xl font-bold text-white p-4">{BRAND_NAME}</div>
        <Menu
          theme="dark"
          mode="inline"
          items={[
            { key: "products", label: <Link href="/seller/products">Products</Link> },
            { key: "orders", label: <Link href="/seller/orders">Orders</Link> },
            { key: "payments", label: <Link href="/seller/payments">Payments</Link> },
                        { key: "logout", label: <Logout /> },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 16px" }}>
          <h2>Seller Dashboard</h2>
        </Header>
        <Content style={{ margin: "16px" }}>{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
