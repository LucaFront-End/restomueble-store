import { getWixServerClient } from "@/lib/wixClientServer";
import { getWixImageUrl } from "@/lib/wixImageUrl";

/**
 * Represents a single color/material combination for a product,
 * fetched from the "CMS Colores" Wix CMS collection.
 *
 * Each row maps a specific terminado + estilo + vinil combination to a product photo.
 * These selectors only change the displayed image (NOT the price).
 *
 * CMS Field IDs:
 *   title_fld       → title (product model name)
 *   fotoDeProducto  → image
 *   terminado       → medidas/terminado (cascading filter level 1)
 *   estilo          → estilo (cascading filter level 2)
 *   colorDelVinil   → color del vinil (cascading filter level 3)
 *   reference       → product slug for matching
 *   tipoDeMesa      → table type (only for mesa products)
 */
export interface ColorCombination {
    /** Product model name (e.g. "CHABELLI") — from `title_fld` */
    title: string;
    /** Product slug used for matching — from `reference` field */
    slug: string;
    /** HTTP URL to the product image for this combination — from `fotoDeProducto` */
    imageUrl: string | null;
    /** Terminado / Medidas (e.g. "Mesa de 60x60cm") — from `terminado` field */
    medidas: string;
    /** Estilo (e.g. "Negro", "Cromo", "Chocolate") — from `estilo` field */
    estilo: string;
    /** Vinil color (e.g. "Naranja", "Azul Marino") — from `colorDelVinil` field */
    colorVinil: string;
    /** Table type (e.g. "Cuadrada", "Redonda") — from `tipoDeMesa` field, only for mesas */
    tipoDeMesa: string;
}

/**
 * Fetch all color combinations for a given product from Wix CMS.
 *
 * Collection: "CMSColores"
 * Matches by the "reference" field which must contain the product slug.
 *
 * Returns an empty array if the collection doesn't exist or has no data
 * for this product — the product page simply won't show color selectors.
 */
export async function getColorsByProduct(productSlug: string): Promise<ColorCombination[]> {
    if (!productSlug) return [];

    // Strip accents for comparison — Wix slug may have "estándar" while CMS has "estandar"
    const normalizedSlug = productSlug
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    try {
        const wixClient = getWixServerClient();

        // First try exact match on the "reference" field
        let items: any[] = [];
        let result = await wixClient.items
            .query("CMSColores")
            .eq("reference", productSlug)
            .limit(100)
            .find();
        items = result.items;

        // If no exact match, try with normalized (accent-stripped) slug
        if (items.length === 0 && normalizedSlug !== productSlug) {
            result = await wixClient.items
                .query("CMSColores")
                .eq("reference", normalizedSlug)
                .limit(100)
                .find();
            items = result.items;
        }

        // Paginate to get ALL matching rows (some products may have 100+ combos)
        if (items.length === 100) {
            let skip = 100;
            while (true) {
                const page = await wixClient.items
                    .query("CMSColores")
                    .eq("reference", items[0]?.reference || productSlug)
                    .limit(100)
                    .skip(skip)
                    .find();
                items = items.concat(page.items);
                if (page.items.length < 100) break;
                skip += 100;
            }
        }

        if (items.length === 0) return [];

        return items.map((item: any) => ({
            title: item.title_fld || item.title || "",
            slug: item.reference || "",
            imageUrl: getWixImageUrl(item.fotoDeProducto || ""),
            medidas: item.terminado || "",
            estilo: item.estilo || "",
            colorVinil: item.colorDelVinil || "",
            tipoDeMesa: item.tipoDeMesa || "",
        }));
    } catch (error) {
        console.warn("[CMS Colores] Could not fetch color data:", error);
        return [];
    }
}

/**
 * Extract unique, non-empty values for a given field from the color list.
 */
export function getDistinctValues(items: ColorCombination[], field: keyof ColorCombination): string[] {
    const values = new Set<string>();
    for (const item of items) {
        const val = item[field];
        if (typeof val === "string" && val.trim()) {
            values.add(val.trim());
        }
    }
    return Array.from(values);
}

/**
 * Find the matching image URL for a given combination of selections.
 * Returns null if no exact match is found.
 */
export function findImageForCombination(
    items: ColorCombination[],
    medidas: string | null,
    estilo: string | null,
    colorVinil: string | null,
    tipoDeMesa: string | null = null,
): string | null {
    const match = items.find((item) => {
        const medidasMatch = !medidas || item.medidas.toLowerCase() === medidas.toLowerCase();
        const estiloMatch = !estilo || item.estilo.toLowerCase() === estilo.toLowerCase();
        const vinilMatch = !colorVinil || item.colorVinil.toLowerCase() === colorVinil.toLowerCase();
        const mesaMatch = !tipoDeMesa || item.tipoDeMesa.toLowerCase() === tipoDeMesa.toLowerCase();
        return medidasMatch && estiloMatch && vinilMatch && mesaMatch;
    });
    return match?.imageUrl ?? null;
}
