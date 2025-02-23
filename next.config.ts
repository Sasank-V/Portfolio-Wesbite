import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["pdf-parse", "ollama", "@google/generative-ai"],
};

export default nextConfig;
