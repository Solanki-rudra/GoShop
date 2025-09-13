// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Menu } from "antd";
import { routeConfig } from "@/lib/routeConfig";
import { getUserFromLocalStorage } from "@/lib/clientAuth";
import { BRAND_NAME } from "@/constants/constant";
import Link from "next/link";
import ProductsPage from "./products/page";

const { Header, Sider, Content } = Layout;

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const storedUser = getUserFromLocalStorage();
    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const savedRole = storedUser.role;

      if (!savedRole) {
        router.push("/login");
        return;
      }

      setRole(savedRole);
      const firstTab = routeConfig[savedRole]?.tabs[0]?.key || "";
      setActiveTab(firstTab);
    } catch (err) {
      console.error("Invalid user in localStorage", err);
      router.push("/login");
    }
  }, [router]);


  if (!role) return <p>Loading...</p>;

  const tabs = routeConfig[role].tabs;
  const ActiveComponent =
    tabs.find((tab: any) => tab.key === activeTab)?.component || null;

  return (
    <ProductsPage />
  );
}
