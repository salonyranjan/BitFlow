import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        pathname: "/**", // Allows all paths from this host
      },
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
        pathname: "/**", // Allows all paths from this host
      },
    ],
  },
};

export default nextConfig;