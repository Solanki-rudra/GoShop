import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "antd/dist/reset.css";
import "./globals.css";
import { NotificationProvider } from "@/context/NotificationProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AntdRegistry from "@/lib/AntdRegistery";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/constants/constant";

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
              <Header />
              <main>{children}</main>
              <Footer />
            </NotificationProvider>
          </AntdRegistry>
      </body>
    </html>
  );
}
