import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lojagheller.bwimg.com.br",
        pathname: "/lojagheller/produtos/**",
      },
    ],
  },
};

export default nextConfig;
