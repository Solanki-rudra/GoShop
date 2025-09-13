"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromLocalStorage } from "@/lib/clientAuth";
import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { BRAND_NAME } from "@/constants/constant";
import Link from "next/link";
import { Content, Header } from "antd/es/layout/layout";
import Footer from "@/components/Footer";
import Logout from "@/components/Logout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromLocalStorage();
    if (!user || user.role !== "admin") {
      router.replace("/unauthorized");
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
            { key: "customers", label: <Link href="/admin/customers">Manage Customers</Link> },
            { key: "sellers", label: <Link href="/admin/sellers">Manage Sellers</Link> },
              { key: "logout", label: <Logout /> },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 16px" }}>
          <h2>Admin Dashboard</h2>
        </Header>
        <Content style={{ margin: "16px" }}>{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
