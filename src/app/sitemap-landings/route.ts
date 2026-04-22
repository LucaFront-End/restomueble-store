import { getAllLandings } from "@/lib/wixCmsLandings";
import landingsDataFallback from "@/data/landings.json";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://josepja.com";
    const now = new Date().toISOString();

    try {
        const cmsLandings = await getAllLandings();
        const landings = cmsLandings.length > 0 ? cmsLandings : landingsDataFallback;

        const urls = landings
            .map(
                (l) => `  <url>
    <loc>${baseUrl}/${l.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
            )
            .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        return new NextResponse(xml, {
            headers: { "Content-Type": "application/xml" },
        });
    } catch (error) {
        console.error("[Sitemap:landings] Error:", error);
        return new NextResponse(
            `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
            { headers: { "Content-Type": "application/xml" } }
        );
    }
}
