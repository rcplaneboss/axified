import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'covers.openlibrary.org' },
      { protocol: 'https', hostname: 'xmffyxslwcrv5egs.public.blob.vercel-storage.com' },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
