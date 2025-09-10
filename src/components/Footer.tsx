"use client";

import { BRAND_NAME } from "@/constants/constant";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" border-t border-gray-200 mt-12 py-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <p className="text-gray-600">&copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <Link href="/about" className="text-gray-600 hover:text-brand">About Us</Link>
          <Link href="/contact" className="text-gray-600 hover:text-brand">Contact</Link>
          <Link href="/terms" className="text-gray-600 hover:text-brand">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
