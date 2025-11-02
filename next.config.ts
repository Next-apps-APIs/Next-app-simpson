import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.glitch.me',
      },
      {
        protocol: 'https',
        hostname: 'thesimpsonsquoteapi.glitch.me',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: '**.nocookie.net', // For any subdomain of nocookie.net
      },
    ],
  },
};

export default nextConfig;
