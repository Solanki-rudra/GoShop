// components/ProtectedRoute.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromLocalStorage } from "@/lib/clientAuth";

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const savedRole = getUserFromLocalStorage()?.role;

    if (!savedRole) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(savedRole)) {
      router.replace("/unauthorized"); // make a simple Unauthorized page
      return;
    }

    setIsAllowed(true);
    setLoading(false);
  }, [allowedRoles, router]);

  if (loading) return <p>Loading...</p>;

  return isAllowed ? <>{children}</> : null;
}
