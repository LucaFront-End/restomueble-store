/**
 * Wix Collection Map
 *
 * Real Wix collection IDs from the dashboard.
 * The new Wix site uses Catalog V3, so we maintain this map
 * instead of using the V1 `queryCollections()` API.
 *
 * Main categories have wixId set for product filtering.
 * Dynamic filter categories (without wixId) show all products.
 */

export interface WixCollection {
    slug: string;
    name: string;
    description: string;
    wixId?: string;
}

/** Primary product collections from Wix */
export const COLLECTIONS: WixCollection[] = [
    {
        slug: "sillas",
        name: "Sillas",
        description: "Sillas de diseño para restaurantes, cafeterías y espacios de hospitalidad.",
        wixId: "1e6161fd-cfbc-4a34-b826-a0d4782faa23",
    },
    {
        slug: "mesas",
        name: "Mesas",
        description: "Mesas y bases de estabilidad superior para todo tipo de establecimientos.",
        wixId: "b61ed7ad-b30c-4c7e-a3ae-177f0a2994a7",
    },
    {
        slug: "conjuntos",
        name: "Conjuntos",
        description: "Conjuntos completos de mobiliario para equipar tu espacio.",
        wixId: "10312fa4-6afc-4258-bf01-d24bb61122a5",
    },
];

/**
 * Get a collection by its URL slug
 */
export function getCollectionBySlug(slug: string): WixCollection | undefined {
    return COLLECTIONS.find((c) => c.slug === slug);
}

/**
 * Get all collection slugs (for generateStaticParams)
 */
export function getAllCollectionSlugs(): string[] {
    return COLLECTIONS.map((c) => c.slug);
}

/**
 * Normalize a product slug the same way Wix does:
 * strip accents → lowercase.
 * Use this when building /producto/<slug> hrefs so URLs
 * never carry accented characters that Wix stripped at creation time.
 *
 * Examples:  "Sillón-bistró" → "sillon-bistro"
 *            "silla-Café"    → "silla-cafe"
 */
export function normalizeSlug(slug: string): string {
    return slug
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // strip combining diacritics
        .toLowerCase();
}

