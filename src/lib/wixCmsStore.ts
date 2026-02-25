import { getWixServerClient } from "@/lib/wixClientServer";

export interface StorePageContent {
    titulo: string;
    descripcion: string;
}

const DEFAULTS: StorePageContent = {
    titulo: "Tienda",
    descripcion: "Descubre nuestra colección completa de mobiliario para hospitalidad.",
};

/**
 * Fetches the title and description for the /tienda page from Wix CMS.
 * Collection name: "ConfigTienda" — single item with fields: titulo, descripcion.
 * Falls back to defaults if the CMS collection doesn't exist or is empty.
 */
export async function getStorePageContent(): Promise<StorePageContent> {
    try {
        const wixClient = getWixServerClient();
        const result = await wixClient.items.query("ConfigTienda").limit(1).find();

        if (result.items.length === 0) return DEFAULTS;

        const item = result.items[0] as any;
        return {
            titulo: item.titulo || item.data?.titulo || DEFAULTS.titulo,
            descripcion: item.descripcion || item.data?.descripcion || DEFAULTS.descripcion,
        };
    } catch {
        // CMS collection not created yet — use defaults silently
        return DEFAULTS;
    }
}
