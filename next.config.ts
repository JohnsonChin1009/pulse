import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.githubassets.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    config.cache = false; // disable file-system caching in Docker
    return config;
  },
};

export default nextConfig;
