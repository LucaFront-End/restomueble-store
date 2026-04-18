import { getWixServerClient } from "@/lib/wixClientServer";
import { getAllLandings } from "@/lib/wixCmsLandings";
import { getAllStoreLandings } from "@/lib/wixCmsStoreLandings";
import { COLLECTIONS } from "@/lib/wixCollections";
import { normalizeSlug } from "@/lib/wixCollections";
import landingsDataFallback from "@/data/landings.json";
import { MetadataRoute } from "next";

/**
 * Revalidate the sitemap every 60 seconds so new CMS content
 * (products, landings, store pages) is picked up automatically.
 */
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://josepja.com";
    const now = new Date();

    // ─── STATIC PAGES ───────────────────────────────────────────────
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
        { url: `${baseUrl}/productos`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
        { url: `${baseUrl}/nosotros`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: `${baseUrl}/proyectos`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
        { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ];

    // ─── CATEGORY PAGES (/tienda/sillas, /tienda/mesas, etc.) ────
    const categoryPages: MetadataRoute.Sitemap = COLLECTIONS.map((cat) => ({
        url: `${baseUrl}/tienda/${cat.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    // ─── ALL PRODUCTS (paginated) ────────────────────────────────
    let productPages: MetadataRoute.Sitemap = [];
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

        productPages = allProducts
            .filter((p) => p.slug)
            .map((product) => ({
                url: `${baseUrl}/producto/${normalizeSlug(product.slug!)}`,
                lastModified: product._updatedDate ? new Date(product._updatedDate) : now,
                changeFrequency: "weekly" as const,
                priority: 0.8,
            }));
    } catch (error) {
        console.error("[Sitemap] Error fetching products:", error);
    }

    // ─── MARKETING LANDINGS (from CMS + fallback JSON) ───────────
    let landingPages: MetadataRoute.Sitemap = [];
    try {
        const cmsLandings = await getAllLandings();

        // Use CMS landings if available, otherwise JSON fallback
        const landings = cmsLandings.length > 0
            ? cmsLandings
            : landingsDataFallback;

        landingPages = landings.map((l) => ({
            url: `${baseUrl}/${l.slug}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error("[Sitemap] Error fetching landings:", error);
    }

    // ─── STORE/TIENDA LANDINGS (TiendasSEO CMS) ─────────────────
    let storeLandingPages: MetadataRoute.Sitemap = [];
    try {
        const storeLandings = await getAllStoreLandings();

        storeLandingPages = storeLandings.map((s) => ({
            url: `${baseUrl}/${s.slug}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error("[Sitemap] Error fetching store landings:", error);
    }

    // Deduplicate URLs (a landing slug might overlap with a store slug)
    const allEntries = [
        ...staticPages,
        ...categoryPages,
        ...productPages,
        ...landingPages,
        ...storeLandingPages,
    ];

    const seen = new Set<string>();
    const deduped = allEntries.filter((entry) => {
        if (seen.has(entry.url)) return false;
        seen.add(entry.url);
        return true;
    });

    console.log(`[Sitemap] Generated ${deduped.length} URLs (${productPages.length} products, ${landingPages.length} landings, ${storeLandingPages.length} store landings, ${categoryPages.length} categories)`);

    return deduped;
}
