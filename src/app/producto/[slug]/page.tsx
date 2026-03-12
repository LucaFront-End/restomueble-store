import { getWixServerClient } from "@/lib/wixClientServer";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";
import { ReviewsSection } from "@/components/catalogue/ReviewsSection";
import { RelatedProducts } from "@/components/catalogue/RelatedProducts";

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
        //    while the URL carries "estandar". Fetch all products and compare
        //    after stripping accents from both sides.
        const normalizedInput = normalizeForComparison(decodedSlug);
        const all = await wixClient.products
            .queryProducts()
            .limit(100)
            .find();
        const match = all.items.find(
            (p) => p.slug && normalizeForComparison(p.slug) === normalizedInput
        );
        return match || null;
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

    if (!product) return { title: "Producto no encontrado | Restomueble" };

    return {
        title: `${product.name} | Restomueble`,
        description: product.description?.substring(0, 160) || "Mobiliario premium para hospitalidad.",
        openGraph: {
            images: [product.media?.mainMedia?.image?.url || ""],
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

    return (
        <main className="bg-white min-h-screen pt-[var(--header-height)]">
            <div className="container mx-auto px-6 py-12 md:py-24">
                <ProductPageClient product={product} />
            </div>

            {/* Reviews Section */}
            <ReviewsSection productName={product.name || "Producto"} />

            {/* Related Products Section */}
            <RelatedProducts currentProductId={product._id || ""} products={relatedProducts} />
        </main>
    );
}

