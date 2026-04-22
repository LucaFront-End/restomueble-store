import { NextResponse } from "next/server";

export const revalidate = 60;

/**
 * Sitemap Index — returns <sitemapindex> pointing to all sub-sitemaps.
 * Served at /sitemap.xml via rewrite in next.config.ts
 */
export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://josepja.com";
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/pages-sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/products-sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/landings-sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/tiendas-sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

    return new NextResponse(xml, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=60, s-maxage=60",
        },
    });
}
