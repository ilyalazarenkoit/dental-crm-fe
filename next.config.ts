import type { NextConfig } from "next";

/**
 * Comprehensive Security Configuration
 * Based on OWASP Top 10, NIST Cybersecurity Framework
 * Author: Senior Cybersecurity Engineer
 */

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Security Configuration
  poweredByHeader: false, // Remove X-Powered-By header

  // Compiler Configuration for security
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Webpack Configuration for security
  webpack: (config, { dev, isServer }) => {
    // Security plugins for production
    if (!dev && !isServer) {
      // Remove source maps in production for security
      config.devtool = false;

      // Code minimization
      config.optimization.minimize = true;
    }

    // Security headers for all builds
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },

  // Environment Configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Trailing Slash Configuration
  trailingSlash: false,

  // Image Optimization with security
  images: {
    domains: ["api.dicebear.com"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false, // Security for SVG
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; style-src 'none'; sandbox;",
  },

  // Experimental Features with security
  experimental: {
    serverComponentsExternalPackages: [],
    optimizePackageImports: ["@radix-ui/react-icons"],
  },

  // Output Configuration
  output: "standalone",

  // Dist Directory
  distDir: ".next",

  // Generate Etag
  generateEtags: false, // Disable for security

  // On Demand Entries
  onDemandEntries: {
    // Period (in ms) during which the page will be buffered
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be buffered simultaneously
    pagesBufferLength: 2,
  },

  // Compress Configuration
  compress: true,

  // Dev Indication
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: "bottom-right",
  },

  // Logging Configuration
  logging: {
    fetches: {
      fullUrl: false, // Don't log full URLs for security
    },
  },

  // Configure redirects if needed
  async redirects() {
    return [];
  },

  // Comprehensive Security Headers Configuration
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Content Security Policy (CSP) - main XSS protection
          {
            key: "Content-Security-Policy",
            value: [
              // Basic directives
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob: https://api.dicebear.com",
              "connect-src 'self' https://api.dentalcrm.com https://maps.googleapis.com https://www.google-analytics.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
              // Additional security directives
              "worker-src 'self' blob:",
              "media-src 'self'",
              "manifest-src 'self'",
              "prefetch-src 'self'",
              "navigate-to 'self'",
            ].join("; "),
          },

          // X-Frame-Options - clickjacking protection
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          // X-Content-Type-Options - MIME sniffing protection
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // X-XSS-Protection - additional XSS protection
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },

          // Referrer-Policy - referrer information control
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // Permissions-Policy - browser API control
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=()",
              "geolocation=()",
              "payment=()",
              "usb=()",
              "magnetometer=()",
              "gyroscope=()",
              "accelerometer=()",
              "ambient-light-sensor=()",
              "autoplay=()",
              "encrypted-media=()",
              "fullscreen=()",
              "picture-in-picture=()",
              "sync-xhr=()",
              "midi=()",
            ].join(", "),
          },

          // Strict-Transport-Security (HSTS) - forced HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },

          // Cross-Origin-Embedder-Policy - resource isolation
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },

          // Cross-Origin-Opener-Policy - window isolation
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },

          // Cross-Origin-Resource-Policy - resource access control
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },

          // Origin-Agent-Cluster - agent isolation
          {
            key: "Origin-Agent-Cluster",
            value: "?1",
          },

          // X-DNS-Prefetch-Control - DNS prefetch control
          {
            key: "X-DNS-Prefetch-Control",
            value: "off",
          },

          // X-Download-Options - file download protection
          {
            key: "X-Download-Options",
            value: "noopen",
          },

          // X-Permitted-Cross-Domain-Policies - cross-domain policy control
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
        ],
      },

      // Special settings for API routes
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },

      // Special settings for static files
      {
        source: "/_next/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
