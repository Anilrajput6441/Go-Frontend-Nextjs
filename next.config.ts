import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Optimize for faster development builds
  experimental: {
    // Enable faster refresh and compilation
    optimizePackageImports: ['@google/generative-ai'],
  },
  
  // Reduce compilation overhead
  typescript: {
    // Skip type checking during build for faster dev server
    ignoreBuildErrors: false,
  },
  
  // Improve dev server performance
  onDemandEntries: {
    // Keep pages in memory for longer
    maxInactiveAge: 60 * 1000, // 60 seconds
    pagesBufferLength: 5,
  },
};

export default nextConfig;
