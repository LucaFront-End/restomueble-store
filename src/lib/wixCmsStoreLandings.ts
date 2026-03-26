import { getWixServerClient } from "@/lib/wixClientServer";

export interface StoreLandingData {
    _id: string;
    slug: string;
    titulo: string;
    descripcion: string;
    tituloSeo: string;
    metadescripcion: string;
    urlDeWhatsapp: string;
}

/**
 * Fetch all tienda-landing pages from Wix CMS.
 * Collection: "TiendasSEO"
 * Fields: slug, titulo, descripcion, Titulo de SEO, MEtadescripción, URL de whatsapp
 *
 * Each row creates a dynamic page at /<slug> that shows
 * the full product catalog with a custom title/description.
 * Example: slug "tienda-cdmx" → josepja.com/tienda-cdmx
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
            tituloSeo: item.tituloDeSeo || item.data?.tituloDeSeo || "",
            metadescripcion: item.metadescripcion || item.data?.metadescripcion || "",
            urlDeWhatsapp: item.urlDeWhatsapp || item.data?.urlDeWhatsapp || "",
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
            tituloSeo: item.tituloDeSeo || item.data?.tituloDeSeo || "",
            metadescripcion: item.metadescripcion || item.data?.metadescripcion || "",
            urlDeWhatsapp: item.urlDeWhatsapp || item.data?.urlDeWhatsapp || "",
        };
    } catch {
        return null;
    }
}
