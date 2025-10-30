"use client";

import { BRAND_NAME } from "@/constants/constant";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" py-6 bg-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <p className="text-white">&copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
