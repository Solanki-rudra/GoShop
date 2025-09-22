import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // temporarily ignore lint during build. Remove this after you fix issues.
    ignoreDuringBuilds: true,
  },

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
