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
      {
        protocol: "https",
        hostname: "pulse-app-files.s3.us-east-1.amazonaws.com",
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
