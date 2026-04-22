import { getWixServerClient } from "@/lib/wixClientServer";
import { normalizeSlug } from "@/lib/wixCollections";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://josepja.com";

    try {
        const wixClient = getWixServerClient();
        const allProducts: { slug?: string | null; _updatedDate?: Date | null }[] = [];
        let skip = 0;
        const pageSize = 100;

        while (true) {
            const page = await wixClient.products
                .queryProducts()
                .limit(pageSize)
                .skip(skip)
                .find();

            allProducts.push(...page.items);
            if (page.items.length < pageSize) break;
            skip += pageSize;
        }

        const urls = allProducts
            .filter((p) => p.slug)
            .map((product) => {
                const lastmod = product._updatedDate
                    ? new Date(product._updatedDate).toISOString()
                    : new Date().toISOString();
                return `  <url>
    <loc>${baseUrl}/producto/${normalizeSlug(product.slug!)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
            })
            .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        return new NextResponse(xml, {
            headers: { "Content-Type": "application/xml" },
        });
    } catch (error) {
        console.error("[Sitemap:products] Error:", error);
        return new NextResponse(
            `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
            { headers: { "Content-Type": "application/xml" } }
        );
    }
}
