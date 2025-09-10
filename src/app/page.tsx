// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import ProductsPage from "./products/page";
import { SellerPage } from "@/pages/SellerPage";
import { AdminPage } from "@/pages/AdminPage";
import { UnknownPage } from "@/pages/UnknownPage";
import Spinner from "@/components/Spinner";

export default function HomePage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Grab role from response headers injected by middleware
    fetch("/", { method: "HEAD" })
      .then((res) => {
        const userRole = res.headers.get("x-user-role");
        setRole('customer');
      })
      .catch(() => setRole(null));
  }, []);

  if (!role) return <Spinner />;

  if (role === "customer") {
    return <ProductsPage />;
  }

  if (role === "seller") {
    return <SellerPage />;
  }

  if (role === "admin") {
    return <AdminPage />;
  }

  return <UnknownPage />;
}
