import { COLLECTIONS } from "@/lib/wixCollections";
import { NextResponse } from "next/server";

export const revalidate = 60;

/**
 * Pages sub-sitemap — static pages + category pages.
 * Served at /pages-sitemap.xml via rewrite.
 */
export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://josepja.com";
    const now = new Date().toISOString();

    const staticPages = [
        { loc: baseUrl, changefreq: "daily", priority: "1.0" },
        { loc: `${baseUrl}/tienda`, changefreq: "daily", priority: "0.9" },
        { loc: `${baseUrl}/nosotros`, changefreq: "monthly", priority: "0.5" },
        { loc: `${baseUrl}/contacto`, changefreq: "monthly", priority: "0.5" },
        { loc: `${baseUrl}/proyectos`, changefreq: "weekly", priority: "0.6" },
        { loc: `${baseUrl}/blog`, changefreq: "weekly", priority: "0.7" },
    ];

    const categoryPages = COLLECTIONS.map((cat) => ({
        loc: `${baseUrl}/tienda/${cat.slug}`,
        changefreq: "weekly",
        priority: "0.8",
    }));

    const allPages = [...staticPages, ...categoryPages];

    const urls = allPages
        .map(
            (p) => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
        )
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new NextResponse(xml, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=60, s-maxage=60",
        },
    });
}
