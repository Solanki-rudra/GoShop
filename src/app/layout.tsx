import "antd/dist/reset.css";
import "./globals.css";
import type { Metadata } from "next";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/constants/constant";
import AntdRegistry from "@/lib/AntdRegistery";
import { NotificationProvider } from "@/context/NotificationProvider";
import Footer from "@/components/Footer";
import ClientLayout from "@/components/ClientLayout"; // 👈 new wrapper

export const metadata: Metadata = {
  title: BRAND_NAME,
  description: BRAND_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <NotificationProvider>
            <ClientLayout>{children}</ClientLayout>
          </NotificationProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
