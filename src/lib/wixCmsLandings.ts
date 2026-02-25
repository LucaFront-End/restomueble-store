import { getWixServerClient } from "@/lib/wixClientServer";

export interface LandingData {
    _id: string;
    slug: string;
    titulo: string;
    subtitulo: string;
    descripcion: string;
    ciudad: string;
    estado: string;
    keywords: string;
}

// Los items de Wix pueden tener los datos directamente o en .data
interface WixDataItem {
    _id?: string;
    // Campos directos (usados por la nueva API)
    slug?: string;
    titulo?: string;
    subtitulo?: string;
    descripcion?: string;
    ciudad?: string;
    estado?: string;
    keywords?: string;
    // O anidados en data (vieja API)
    data?: {
        slug?: string;
        titulo?: string;
        subtitulo?: string;
        descripcion?: string;
        ciudad?: string;
        estado?: string;
        keywords?: string;
    };
}

/**
 * Obtiene todas las landings SEO del CMS de Wix
 */
export async function getAllLandings(): Promise<LandingData[]> {
    const wixClient = getWixServerClient();

    try {
        const result = await wixClient.items.query("LandingsSEO").find();

        console.log(`[CMS] Cargadas ${result.items.length} landings SEO`);

        return result.items.map((item: WixDataItem) => ({
            _id: item._id || "",
            slug: item.slug || item.data?.slug || "",
            titulo: item.titulo || item.data?.titulo || "",
            subtitulo: item.subtitulo || item.data?.subtitulo || "",
            descripcion: item.descripcion || item.data?.descripcion || "",
            ciudad: item.ciudad || item.data?.ciudad || "",
            estado: item.estado || item.data?.estado || "",
            keywords: item.keywords || item.data?.keywords || "",
        }));
    } catch (error) {
        console.error("Error fetching landings from Wix CMS:", error);
        return [];
    }
}

/**
 * Obtiene una landing específica por slug
 */
export async function getLandingBySlug(slug: string): Promise<LandingData | null> {
    const wixClient = getWixServerClient();

    try {
        const result = await wixClient.items
            .query("LandingsSEO")
            .eq("slug", slug)
            .find();

        if (result.items.length === 0) {
            return null;
        }

        const item: WixDataItem = result.items[0];
        return {
            _id: item._id || "",
            slug: item.slug || item.data?.slug || "",
            titulo: item.titulo || item.data?.titulo || "",
            subtitulo: item.subtitulo || item.data?.subtitulo || "",
            descripcion: item.descripcion || item.data?.descripcion || "",
            ciudad: item.ciudad || item.data?.ciudad || "",
            estado: item.estado || item.data?.estado || "",
            keywords: item.keywords || item.data?.keywords || "",
        };
    } catch (error) {
        console.error("Error fetching landing by slug:", error);
        return null;
    }
}
