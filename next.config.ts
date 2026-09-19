import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/rum",
  assetPrefix: "/rum/",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
