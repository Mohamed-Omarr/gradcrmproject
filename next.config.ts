import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // causing unnecessary error of hydration
  // devIndicators: {
  //   buildActivity: false, // ✅ Hides build activity indicator
  // },
   typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: false
};

export default nextConfig;
