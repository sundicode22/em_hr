import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["elysia", "@sinclair/typebox"],
};

export default nextConfig;
