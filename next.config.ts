import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  
  // Performance optimizations
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['gsap'],
  },
  
  // Server external packages
  serverExternalPackages: ['@prisma/client'],
  
  // Allow cross-origin requests in development
  allowedDevOrigins: ['0.0.0.0'],
  
  // Compression
  compress: true,
  
  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects for pretty URLs and subdomains
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // Subdomain redirects for development
      {
        source: '/photography',
        has: [
          {
            type: 'host',
            value: 'photo.localhost:3000',
          },
        ],
        destination: '/photography',
        permanent: false,
      },
      {
        source: '/video',
        has: [
          {
            type: 'host',
            value: 'video.localhost:3000',
          },
        ],
        destination: '/video',
        permanent: false,
      },
      {
        source: '/tech',
        has: [
          {
            type: 'host',
            value: 'tech.localhost:3000',
          },
        ],
        destination: '/tech',
        permanent: false,
      },
      {
        source: '/furry',
        has: [
          {
            type: 'host',
            value: 'furry.localhost:3000',
          },
        ],
        destination: '/furry',
        permanent: false,
      },
    ];
  },
};

export default withAnalyzer(nextConfig);
