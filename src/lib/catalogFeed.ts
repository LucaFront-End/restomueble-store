import { NextResponse } from "next/server";
import { products } from "@wix/stores";
import { getAllProducts } from "@/lib/wixProducts";
import { getWixImageUrl } from "@/lib/wixImageUrl";
import { COLLECTIONS, normalizeSlug } from "@/lib/wixCollections";

export interface CatalogFeedItem {
    id: string;
    title: string;
    description: string;
    inStock: boolean;
    condition: "new";
    price: string;
    salePrice: string;
    link: string;
    imageLink: string;
    additionalImageLinks: string[];
    brand: string;
    mpn: string;
    googleProductCategory: string;
    productType: string;
}

const DEFAULT_BASE_URL = "https://josepja.com";
const DEFAULT_BRAND = "Josepja";
const FURNITURE_TAXONOMY_ID = "436";
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_ADDITIONAL_IMAGES = 10;
const MAX_ADDITIONAL_IMAGES_CELL_LENGTH = 2000;

const HTML_NAMED_ENTITIES: Record<string, string> = {
    nbsp: " ",
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    aacute: "á",
    eacute: "é",
    iacute: "í",
    oacute: "ó",
    uacute: "ú",
    ntilde: "ñ",
    uuml: "ü",
    Aacute: "Á",
    Eacute: "É",
    Iacute: "Í",
    Oacute: "Ó",
    Uacute: "Ú",
    Ntilde: "Ñ",
    Uuml: "Ü",
    iexcl: "¡",
    iquest: "¿",
    deg: "°",
    ordm: "º",
    ordf: "ª",
    ndash: "–",
    mdash: "—",
    ldquo: '"',
    rdquo: '"',
    lsquo: "'",
    rsquo: "'",
    middot: "·",
    bull: "•",
};

function decodeHtmlEntities(input: string): string {
    return input.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (match, entity: string) => {
        if (entity.startsWith("#x") || entity.startsWith("#X")) {
            const code = Number.parseInt(entity.slice(2), 16);
            return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : match;
        }
        if (entity.startsWith("#")) {
            const code = Number.parseInt(entity.slice(1), 10);
            return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : match;
        }
        return HTML_NAMED_ENTITIES[entity] ?? match;
    });
}

export function cleanHtmlToPlainText(html: string | null | undefined, fallbackTitle: string): string {
    const raw = (html ?? "")
        .replace(/<\/?(p|li|div|h[1-6]|tr|td|th|ul|ol|blockquote|section|article|br)\b[^>]*>/gi, " ")
        .replace(/<[^>]*>/g, "");

    const decoded = decodeHtmlEntities(raw)
        .replace(/[\x00-\x1F\x7F]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const text = decoded || `${fallbackTitle} — Mobiliario para restaurantes fabricado por ${DEFAULT_BRAND}.`;
    return text.length > MAX_DESCRIPTION_LENGTH
        ? text.slice(0, MAX_DESCRIPTION_LENGTH).trim()
        : text;
}

export function toCleanFeedImageUrl(rawUrl?: string | null, mediaId?: string | null): string | null {
    const trimmed = rawUrl?.trim();

    if (trimmed) {
        const wixStaticMatch = trimmed.match(/^https?:\/\/static\.wixstatic\.com\/media\/([^/?#]+)/i);
        if (wixStaticMatch?.[1]) {
            return `https://static.wixstatic.com/media/${wixStaticMatch[1]}`;
        }

        if (trimmed.startsWith("wix:image://")) {
            const converted = getWixImageUrl(trimmed);
            if (converted && /^https?:\/\//i.test(converted)) {
                return converted;
            }
        }

        if (/^https?:\/\//i.test(trimmed)) {
            return trimmed;
        }
    }

    const cleanMediaId = mediaId?.trim();
    if (cleanMediaId && !cleanMediaId.startsWith("http")) {
        return `https://static.wixstatic.com/media/${cleanMediaId.replace(/^\/+/, "")}`;
    }

    return null;
}

export function isProductInStock(product: products.Product): boolean {
    if (product.stock?.inStock === false) {
        return false;
    }

    if (product.manageVariants && Array.isArray(product.variants) && product.variants.length > 0) {
        return product.variants.some((variant) => variant.stock?.inStock !== false);
    }

    return true;
}

export function resolveProductType(collectionIds?: string[] | null): string {
    if (Array.isArray(collectionIds) && collectionIds.length > 0) {
        const matched = COLLECTIONS.find(
            (col) => col.wixId && collectionIds.includes(col.wixId)
        );
        if (matched) {
            return `Mobiliario para Restaurantes > ${matched.name}`;
        }
    }
    return "Mobiliario para Restaurantes";
}

function getBaseUrl(): string {
    const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL || DEFAULT_BASE_URL;
    return raw.replace(/\/+$/, "");
}

function extractProductImages(product: products.Product): {
    imageLink: string | null;
    additionalImageLinks: string[];
} {
    const mainMedia = product.media?.mainMedia;
    const primaryUrl = toCleanFeedImageUrl(mainMedia?.image?.url, mainMedia?._id);

    const seen = new Set<string>();
    if (primaryUrl) {
        seen.add(primaryUrl);
    }

    const additional: string[] = [];
    const galleryItems = product.media?.items ?? [];
    for (const item of galleryItems) {
        if (item.mediaType && item.mediaType !== "image") continue;
        const url = toCleanFeedImageUrl(item.image?.url, item._id);
        if (!url || seen.has(url)) continue;
        seen.add(url);
        if (!primaryUrl) {
            // Fallback if mainMedia was missing but gallery has an image
            additional.push(url);
        } else if (additional.length < MAX_ADDITIONAL_IMAGES) {
            additional.push(url);
        }
    }

    if (!primaryUrl && additional.length > 0) {
        const [first, ...rest] = additional;
        return {
            imageLink: first,
            additionalImageLinks: rest.slice(0, MAX_ADDITIONAL_IMAGES),
        };
    }

    return {
        imageLink: primaryUrl,
        additionalImageLinks: additional,
    };
}

export async function getCatalogFeedItems(): Promise<{ baseUrl: string; items: CatalogFeedItem[] }> {
    const baseUrl = getBaseUrl();
    const rawProducts = await getAllProducts();
    const items: CatalogFeedItem[] = [];

    for (const product of rawProducts) {
        if (!product._id || product.visible === false || !product.slug) {
            continue;
        }

        const priceData = product.priceData ?? product.price;
        const regularPrice = priceData?.price;
        if (typeof regularPrice !== "number" || !Number.isFinite(regularPrice) || regularPrice <= 0) {
            continue;
        }

        const { imageLink, additionalImageLinks } = extractProductImages(product);
        if (!imageLink) {
            continue;
        }

        const title = (product.name || "Producto").replace(/[\t\r\n]+/g, " ").trim();
        const currency = (priceData?.currency || "MXN").toUpperCase().trim();
        const discountedPrice = priceData?.discountedPrice;
        const hasValidSale =
            typeof discountedPrice === "number" &&
            Number.isFinite(discountedPrice) &&
            discountedPrice > 0 &&
            discountedPrice < regularPrice;

        const normalizedSlug = normalizeSlug(product.slug);
        const link = `${baseUrl}/producto/${encodeURIComponent(normalizedSlug)}`;
        const brand = product.brand?.trim() || DEFAULT_BRAND;
        const mpn =
            product.sku?.trim() ||
            (product.numericId ? `JP-${product.numericId}` : product._id);

        items.push({
            id: product._id,
            title,
            description: cleanHtmlToPlainText(product.description, title),
            inStock: isProductInStock(product),
            condition: "new",
            price: `${regularPrice.toFixed(2)} ${currency}`,
            salePrice: hasValidSale ? `${discountedPrice.toFixed(2)} ${currency}` : "",
            link,
            imageLink,
            additionalImageLinks,
            brand,
            mpn,
            googleProductCategory: FURNITURE_TAXONOMY_ID,
            productType: resolveProductType(product.collectionIds),
        });
    }

    return { baseUrl, items };
}

function formatAdditionalImages(urls: string[]): string {
    const kept: string[] = [];
    let totalLen = 0;

    for (const rawUrl of urls) {
        const safeUrl = rawUrl.replace(/,/g, "%2C");
        const addedLen = (kept.length > 0 ? 1 : 0) + safeUrl.length;
        if (totalLen + addedLen > MAX_ADDITIONAL_IMAGES_CELL_LENGTH) {
            break;
        }
        kept.push(safeUrl);
        totalLen += addedLen;
    }

    return kept.join(",");
}

function escapeXml(value: string): string {
    // Remove characters forbidden by XML 1.0
    const cleaned = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
    return cleaned
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function escapeCsvCell(value: string): string {
    if (/[",\r\n]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

function sanitizeTsvCell(value: string): string {
    return value.replace(/[\t\r\n]+/g, " ").trim();
}

function serializeTsv(headers: string[], rows: string[][]): string {
    const lines = [headers.join("\t")];
    for (const row of rows) {
        lines.push(row.map(sanitizeTsvCell).join("\t"));
    }
    return lines.join("\n");
}

export function buildMetaXml(baseUrl: string, items: CatalogFeedItem[]): string {
    const itemsXml = items
        .map((item) => {
            const availability = item.inStock ? "in stock" : "out of stock";
            const salePriceTag = item.salePrice
                ? `\n      <g:sale_price>${escapeXml(item.salePrice)}</g:sale_price>`
                : "";
            const additionalImageTags = item.additionalImageLinks
                .map((url) => `\n      <g:additional_image_link>${escapeXml(url)}</g:additional_image_link>`)
                .join("");

            return `    <item>
      <g:id>${escapeXml(item.id)}</g:id>
      <g:title>${escapeXml(item.title)}</g:title>
      <g:description>${escapeXml(item.description)}</g:description>
      <g:availability>${availability}</g:availability>
      <g:condition>${item.condition}</g:condition>
      <g:price>${escapeXml(item.price)}</g:price>${salePriceTag}
      <g:link>${escapeXml(item.link)}</g:link>
      <g:image_link>${escapeXml(item.imageLink)}</g:image_link>${additionalImageTags}
      <g:brand>${escapeXml(item.brand)}</g:brand>
      <g:product_type>${escapeXml(item.productType)}</g:product_type>
      <g:google_product_category>${escapeXml(item.googleProductCategory)}</g:google_product_category>
    </item>`;
        })
        .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Josepja — Catálogo de Mobiliario</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>Catálogo dinámico de mesas, sillas y mobiliario para restaurantes Josepja.</description>
${itemsXml}
  </channel>
</rss>`;
}

const META_DELIMITED_HEADERS = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "sale_price",
    "link",
    "image_link",
    "additional_image_link",
    "brand",
];

function toMetaDelimitedRows(items: CatalogFeedItem[]): string[][] {
    return items.map((item) => [
        item.id,
        item.title,
        item.description,
        item.inStock ? "in stock" : "out of stock",
        item.condition,
        item.price,
        item.salePrice,
        item.link,
        item.imageLink,
        formatAdditionalImages(item.additionalImageLinks),
        item.brand,
    ]);
}

export function buildMetaCsv(items: CatalogFeedItem[]): string {
    const lines = [META_DELIMITED_HEADERS.join(",")];
    for (const row of toMetaDelimitedRows(items)) {
        lines.push(row.map(escapeCsvCell).join(","));
    }
    return lines.join("\n");
}

export function buildMetaTsv(items: CatalogFeedItem[]): string {
    return serializeTsv(META_DELIMITED_HEADERS, toMetaDelimitedRows(items));
}

export function buildGoogleMerchantTsv(items: CatalogFeedItem[]): string {
    const headers = [
        "id",
        "title",
        "description",
        "link",
        "image_link",
        "additional_image_link",
        "availability",
        "price",
        "sale_price",
        "brand",
        "condition",
        "mpn",
        "identifier_exists",
        "google_product_category",
        "product_type",
    ];

    const rows = items.map((item) => [
        item.id,
        item.title,
        item.description,
        item.link,
        item.imageLink,
        formatAdditionalImages(item.additionalImageLinks),
        item.inStock ? "in_stock" : "out_of_stock",
        item.price,
        item.salePrice,
        item.brand,
        item.condition,
        item.mpn,
        "yes",
        item.googleProductCategory,
        item.productType,
    ]);

    return serializeTsv(headers, rows);
}

interface ServeCatalogFeedOptions {
    label: string;
    contentType: string;
    filename?: string;
    serialize: (data: { baseUrl: string; items: CatalogFeedItem[] }) => string;
}

export async function serveCatalogFeed({
    label,
    contentType,
    filename,
    serialize,
}: ServeCatalogFeedOptions): Promise<NextResponse> {
    try {
        const data = await getCatalogFeedItems();
        const body = serialize(data);
        const headers: Record<string, string> = {
            "Content-Type": contentType,
            "Cache-Control": "no-store, max-age=0",
        };
        if (filename) {
            headers["Content-Disposition"] = `inline; filename="${filename}"`;
        }
        return new NextResponse(body, { status: 200, headers });
    } catch (error) {
        console.error(`[Feed:${label}] Failed to generate dynamic catalog feed:`, error);
        return new NextResponse("Error generating catalog feed", {
            status: 500,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-store, max-age=0",
            },
        });
    }
}
