import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

  reactStrictMode: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },

  compress: true,

  poweredByHeader: false,
};

export default nextConfig;
