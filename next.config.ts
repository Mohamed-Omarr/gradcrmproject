import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // causing unnecessary error of hydration
  // devIndicators: {
  //   buildActivity: false, // ✅ Hides build activity indicator
  // },
  images: {
    domains: ["rbinxrirpivsnlnsvvno.supabase.co"],},
  typescript: {
    ignoreBuildErrors: true,
  },
    eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false
};

export default nextConfig;
