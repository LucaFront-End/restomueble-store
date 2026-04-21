import { getWixServerClient } from "@/lib/wixClientServer";
import { getAllLandings } from "@/lib/wixCmsLandings";
import { getAllStoreLandings } from "@/lib/wixCmsStoreLandings";
import { COLLECTIONS, normalizeSlug } from "@/lib/wixCollections";
import landingsDataFallback from "@/data/landings.json";
import { MetadataRoute } from "next";

/**
 * Revalidate all sitemaps every 60 seconds so new CMS content
 * (products, landings, store pages) is picked up automatically.
 */
export const revalidate = 60;

/**
 * Sitemap IDs:
 *   0 = pages        → static pages + category pages
 *   1 = products     → all Wix products (paginated)
 *   2 = landings-seo → marketing landings from LandingsSEO CMS
 *   3 = tiendas-seo  → store landings from TiendasSEO CMS
 *
 * Next.js generates:
 *   /sitemap.xml          → <sitemapindex> linking to all sub-sitemaps
 *   /sitemap/0.xml        → pages
 *   /sitemap/1.xml        → products
 *   /sitemap/2.xml        → landings SEO
 *   /sitemap/3.xml        → tiendas SEO
 */
export async function generateSitemaps() {
    return [
        { id: 0 }, // pages
        { id: 1 }, // products
        { id: 2 }, // landings-seo
        { id: 3 }, // tiendas-seo
    ];
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://josepja.com";
    const now = new Date();

    // ─── 0: STATIC PAGES + CATEGORIES ───────────────────────────────
    if (id === 0) {
        const staticPages: MetadataRoute.Sitemap = [
            { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
            { url: `${baseUrl}/productos`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
            { url: `${baseUrl}/nosotros`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
            { url: `${baseUrl}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
            { url: `${baseUrl}/proyectos`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
            { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
        ];

        const categoryPages: MetadataRoute.Sitemap = COLLECTIONS.map((cat) => ({
            url: `${baseUrl}/tienda/${cat.slug}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

        return [...staticPages, ...categoryPages];
    }

    // ─── 1: ALL PRODUCTS (paginated from Wix) ───────────────────────
    if (id === 1) {
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

            return allProducts
                .filter((p) => p.slug)
                .map((product) => ({
                    url: `${baseUrl}/producto/${normalizeSlug(product.slug!)}`,
                    lastModified: product._updatedDate ? new Date(product._updatedDate) : now,
                    changeFrequency: "weekly" as const,
                    priority: 0.8,
                }));
        } catch (error) {
            console.error("[Sitemap:products] Error fetching products:", error);
            return [];
        }
    }

    // ─── 2: MARKETING LANDINGS (LandingsSEO CMS + fallback) ─────────
    if (id === 2) {
        try {
            const cmsLandings = await getAllLandings();
            const landings = cmsLandings.length > 0 ? cmsLandings : landingsDataFallback;

            return landings.map((l) => ({
                url: `${baseUrl}/${l.slug}`,
                lastModified: now,
                changeFrequency: "weekly" as const,
                priority: 0.7,
            }));
        } catch (error) {
            console.error("[Sitemap:landings] Error fetching landings:", error);
            return [];
        }
    }

    // ─── 3: STORE/TIENDA LANDINGS (TiendasSEO CMS) ─────────────────
    if (id === 3) {
        try {
            const storeLandings = await getAllStoreLandings();

            return storeLandings.map((s) => ({
                url: `${baseUrl}/${s.slug}`,
                lastModified: now,
                changeFrequency: "weekly" as const,
                priority: 0.7,
            }));
        } catch (error) {
            console.error("[Sitemap:tiendas] Error fetching store landings:", error);
            return [];
        }
    }

    return [];
}
