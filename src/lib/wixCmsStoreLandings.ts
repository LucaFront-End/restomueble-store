import { getWixServerClient } from "@/lib/wixClientServer";

export interface StoreLandingData {
    _id: string;
    slug: string;
    titulo: string;
    descripcion: string;
}

/**
 * Fetch all tienda-landing pages from Wix CMS.
 * Collection: "TiendasSEO"
 * Fields: slug, titulo, descripcion
 *
 * Each row creates a dynamic page at /<slug> that shows
 * the full product catalog with a custom title/description.
 * Example: slug "tienda-cdmx" → localhost:3000/tienda-cdmx
 */
export async function getAllStoreLandings(): Promise<StoreLandingData[]> {
    try {
        const wixClient = getWixServerClient();
        const result = await wixClient.items.query("TiendasSEO").find();
        return result.items.map((item: any) => ({
            _id: item._id || "",
            slug: item.slug || item.data?.slug || "",
            titulo: item.titulo || item.data?.titulo || "",
            descripcion: item.descripcion || item.data?.descripcion || "",
        }));
    } catch {
        return [];
    }
}

/**
 * Fetch a single tienda landing by slug.
 */
export async function getStoreLandingBySlug(slug: string): Promise<StoreLandingData | null> {
    try {
        const wixClient = getWixServerClient();
        const result = await wixClient.items
            .query("TiendasSEO")
            .eq("slug", slug)
            .find();
        if (result.items.length === 0) return null;
        const item: any = result.items[0];
        return {
            _id: item._id || "",
            slug: item.slug || item.data?.slug || "",
            titulo: item.titulo || item.data?.titulo || "",
            descripcion: item.descripcion || item.data?.descripcion || "",
        };
    } catch {
        return null;
    }
}
