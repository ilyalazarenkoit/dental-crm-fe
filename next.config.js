/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Automatically inline images under this size as base64 URLs
  images: {
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable server components by default
  experimental: {
    serverActions: true,
  },

  // Configure environment variables prefix
  env: {
    // Add your environment variables here
  },

  // Configure redirects if needed
  async redirects() {
    return [];
  },

  // Configure headers if needed
  async headers() {
    return [];
  },
};

module.exports = nextConfig;
