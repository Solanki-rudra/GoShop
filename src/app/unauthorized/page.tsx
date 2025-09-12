"use client";

import { Result, Button } from "antd";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Result
        status="403"
        title="Unauthorized"
        subTitle="Sorry, you don’t have permission to access this page."
        extra={
          <Button type="primary" onClick={() => router.push("/")}>
            Go Home
          </Button>
        }
        className="shadow-lg rounded-2xl bg-white p-8"
      />
    </div>
  );
}
