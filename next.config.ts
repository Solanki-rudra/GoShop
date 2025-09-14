import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ✅ allow all https domains
      },
      {
        protocol: "http",
        hostname: "**", // ✅ (optional) allow http too
      },
    ],
  },
};

export default nextConfig;
