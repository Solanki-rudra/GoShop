"use client";

import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "@/components/Logout";
import { BRAND_NAME } from "@/constants/constant";
import Footer from "./Footer";
import { getUserFromLocalStorage } from "@/lib/clientAuth";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname:any = usePathname();
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
const user = getUserFromLocalStorage();
  if (isAuthPage || !user || user.role !== "customer") {
    return <main>{children}</main>;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div className="text-2xl font-bold text-white p-4">{BRAND_NAME}</div>
        <Menu
          theme="dark"
          mode="inline"
          items={[
            { key: "products", label: <Link href="/products">Products</Link> },
            { key: "cart", label: <Link href="/cart">Cart</Link> },
            { key: "orders", label: <Link href="/orders">Orders</Link> },
            { key: "logout", label: <Logout /> },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 16px" }}>
          <h2>Dashboard</h2>
        </Header>
        <Content style={{ margin: "16px" }}>{children}</Content>
              <Footer />
      </Layout>
    </Layout>
  );
}
