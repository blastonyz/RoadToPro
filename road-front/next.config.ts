import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'arkacdn.cloudycoding.com',
      },
    ],
  },
};

export default nextConfig;
