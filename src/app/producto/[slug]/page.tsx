import { getWixServerClient } from "@/lib/wixClientServer";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";
import { ReviewsSection } from "@/components/catalogue/ReviewsSection";
import { RelatedProducts } from "@/components/catalogue/RelatedProducts";
import { getColorsByProduct } from "@/lib/wixCmsColores";

export const revalidate = 60; // Revalidate product pages every 60 seconds

interface PageProps {
    params: Promise<{ slug: string }>;
}

/** Strip accents and lowercase — matches what Wix does to MOST slugs */
function normalizeForComparison(s: string): string {
    return s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

async function getProduct(slug: string) {
    try {
        const wixClient = getWixServerClient();
        const decodedSlug = decodeURIComponent(slug);

        // 1. Try the exact decoded slug (fast path — works for most products)
        const exact = await wixClient.products
            .queryProducts()
            .eq("slug", decodedSlug)
            .limit(1)
            .find();
        if (exact.items[0]) return exact.items[0];

        // 2. Fallback: Wix may have stored the slug WITH accents (e.g. "estándar")
        //    while the URL carries "estandar". Paginate through ALL products and compare
        //    after stripping accents from both sides.
        const normalizedInput = normalizeForComparison(decodedSlug);
        let skip = 0;
        const pageSize = 100;
        while (true) {
            const page = await wixClient.products
                .queryProducts()
                .limit(pageSize)
                .skip(skip)
                .find();
            const match = page.items.find(
                (p) => p.slug && normalizeForComparison(p.slug) === normalizedInput
            );
            if (match) return match;
            if (page.items.length < pageSize) break;
            skip += pageSize;
        }
        return null;
    } catch (error) {
        console.error("❌ Error fetching product:", error);
        return null;
    }
}


// Fetch some products for the related section
async function getRelatedProducts(limit = 8) {
    try {
        const wixClient = getWixServerClient();
        const result = await wixClient.products
            .queryProducts()
            .limit(limit)
            .find();
        return result.items || [];
    } catch (error) {
        return [];
    }
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) return { title: "Producto no encontrado | Josepja" };

    const name = product.name || "Producto";

    // Strip HTML tags from Wix rich-text description
    const rawDesc = product.description || "";
    const plainDesc = rawDesc.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    const descSnippet = plainDesc.substring(0, 140);

    const title = `Mesas para restaurantes | ${name} | Josepja Muebles | Mobiliario para Restaurantes`;
    const description = descSnippet
        ? `Tienda de mobiliario para restaurantes | ${descSnippet}`
        : "Tienda de mobiliario para restaurantes | Josepja — Mesas y sillas de diseño para restaurantes, cafeterías y hoteles.";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: product.media?.mainMedia?.image?.url
                ? [{ url: product.media.mainMedia.image.url, width: 1200, height: 630, alt: name }]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function ProductoPage({ params }: PageProps) {
    const { slug } = await params;
    const product = await getProduct(slug);
    const relatedProducts = await getRelatedProducts();

    if (!product) {
        notFound();
    }

    // Fetch color/material combinations from the "CMS Colores" CMS collection.
    // Matches by slug (Referencia field) — the most precise product identifier.
    const colorData = await getColorsByProduct(product.slug || "");

    return (
        <main className="bg-white min-h-screen pt-[var(--header-height)]">
            <div className="container mx-auto px-6 py-12 md:py-24">
                <ProductPageClient product={product} colorData={colorData} />
            </div>

            {/* Reviews Section */}
            <ReviewsSection productName={product.name || "Producto"} />

            {/* Related Products Section */}
            <RelatedProducts currentProductId={product._id || ""} products={relatedProducts} />
        </main>
    );
}

