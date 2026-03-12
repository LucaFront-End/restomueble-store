import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/productos",
        destination: "/tienda",
        permanent: true,
      },
      {
        source: "/productos/:slug*",
        destination: "/tienda/:slug*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Proxy Wix's internal API routes (checkout cookies, auth, etc.)
        // This is required for Wix Headless checkout on custom domains
        {
          source: "/_api/:path*",
          destination: "https://www.josepja.com/_api/:path*",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
      {
        protocol: "https",
        hostname: "images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
      },
    ],
  },
};


export default nextConfig;
