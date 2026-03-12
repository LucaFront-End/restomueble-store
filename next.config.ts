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
        // Proxy Wix internal routes to the actual Wix backend.
        // josepja.com DNS points to Vercel, so /_api and /__ecom paths
        // need to be forwarded to Wix's servers for checkout to work.
        {
          source: "/_api/:path*",
          destination:
            "https://lobomercadologomx.wixsite.com/josepja/_api/:path*",
        },
        {
          source: "/__ecom/:path*",
          destination:
            "https://lobomercadologomx.wixsite.com/josepja/__ecom/:path*",
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
