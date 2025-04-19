import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // causing unnecessary error of hydration
  // devIndicators: {
  //   buildActivity: false, // ✅ Hides build activity indicator
  // },
  devIndicators: false
};

export default nextConfig;
