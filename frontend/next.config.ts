import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployments
  output: "standalone",

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Enable experimental features
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },

  // Ignore ESLint errors during build (we lint separately in CI)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Ignore TypeScript errors during build (we check separately in CI)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

