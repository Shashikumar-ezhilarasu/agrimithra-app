/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // This helps with some CSS variable loading issues in newer Next.js versions
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
