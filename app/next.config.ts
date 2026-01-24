import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============================
  // Packages à transpiler
  // ============================
  transpilePackages: ["@heroicons/react"],

  // ============================
  // Images (Next 16+)
  // ============================
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "/**",
      },
      { protocol: "http", hostname: "0.0.0.0", port: "3000", pathname: "/**" },
    ],
    unoptimized: true,
  },

  // ============================
  // Dev indicators
  // ============================
  devIndicators: {
    position: "bottom-right",
  },

  // ============================
  // Headers globaux pour dev + CORS
  // ============================
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
          { key: "X-Content-Type-Options", value: "nosniff" }, // force MIME correct
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" }, // force refresh en dev
        ],
      },
    ];
  },

  // ============================
  // Redirects / Rewrites pour statics si besoin
  // ============================
  async rewrites() {
    return [
      {
        source: "/_next/static/:path*",
        destination: "/_next/static/:path*",
      },
    ];
  },

  // ============================
  // Turbopack configuration
  // ============================
  turbopack: {},

  // ============================
  // Webpack placeholder (si nécessaire)
  // ============================
  webpack: (config, { isServer }) => {
    // On ne touche pas aux CSS/JS, Turbopack gère tout
    return config;
  },

  // ============================
  // HTTP Headers forcés côté Next pour statics
  // ============================
  experimental: {
    forceSwcTransforms: true, // assure transformations modernes
    typedRoutes: true,
  },
};

export default nextConfig;
