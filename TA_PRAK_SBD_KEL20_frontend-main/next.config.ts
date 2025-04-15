import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["github.com"], // Tambahkan domain github.com
  },
};

export default nextConfig;
