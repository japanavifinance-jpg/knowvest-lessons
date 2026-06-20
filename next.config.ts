import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Forces Next.js to build pure, standalone HTML/JS files
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;