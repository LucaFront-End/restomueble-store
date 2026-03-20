import { getWixServerClient } from "@/lib/wixClientServer";
import { getWixImageUrl } from "@/lib/wixImageUrl";

/**
 * Represents a single color/material combination for a product,
 * fetched from the "CMS Colores" Wix CMS collection.
 *
 * Each row maps a specific Fórmica + Vinil combination to a product photo.
 * These selectors only change the displayed image (NOT the price).
 */
export interface ColorCombination {
    /** Product model name (e.g. "CHABELLI") */
    title: string;
    /** Product slug used for matching (e.g. "silla-modelo-chabeli") — from "Referencia" field */
    slug: string;
    /** HTTP URL to the product image for this combination */
    imageUrl: string | null;
    /** Fórmica color/material (e.g. "Verde Limon") */
    formica: string;
    /** Vinil color (e.g. "naranja") */
    colorVinil: string;
    /** Terminado / finish (e.g. "Rústico brillante") */
    terminado: string;
}

/**
 * Fetch all color combinations for a given product from Wix CMS.
 *
 * Collection: "CMS Colores"
 * Matches by the "Referencia" field which must contain the product slug
 * (e.g. "silla-modelo-chabeli"). This is the most precise match.
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
        let result = await wixClient.items
            .query("CMSColores")
            .eq("reference", productSlug)
            .find();

        // If no exact match, try with normalized (accent-stripped) slug
        if (result.items.length === 0 && normalizedSlug !== productSlug) {
            result = await wixClient.items
                .query("CMSColores")
                .eq("reference", normalizedSlug)
                .find();
        }

        if (result.items.length === 0) return [];

        return result.items.map((item: any) => ({
            title: item.title_fld || "",
            slug: item.reference || "",
            imageUrl: getWixImageUrl(item.fotoDeProducto || ""),
            formica: item.formaica1 || "",
            colorVinil: item.colorDelVinil || "",
            terminado: item.terminado || "",
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
    formica: string | null,
    colorVinil: string | null,
): string | null {
    const match = items.find((item) => {
        const formicaMatch = !formica || item.formica.toLowerCase() === formica.toLowerCase();
        const vinilMatch = !colorVinil || item.colorVinil.toLowerCase() === colorVinil.toLowerCase();
        return formicaMatch && vinilMatch;
    });
    return match?.imageUrl ?? null;
}
