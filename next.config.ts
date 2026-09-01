import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,

  // Generate static files for InfinityFree
  output: "export",

  // Recommended for static hosting
  trailingSlash: true,

  // Disable Next.js server-side image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;