import { getWixServerClient } from "@/lib/wixClientServer";
import { getCollectionBySlug, getAllCollectionSlugs, COLLECTIONS } from "@/lib/wixCollections";
import { notFound } from "next/navigation";
import { CatalogueHero } from "@/components/catalogue/CatalogueHero";
import { ProductCard } from "@/components/catalogue/ProductCard";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ categoria: string }>;
}

// Fetch products, optionally filtered by collection ID
async function getProducts(collectionId?: string) {
    try {
        const wixClient = getWixServerClient();
        const allProducts = await wixClient.products.queryProducts().limit(100).find();

        let items = allProducts.items || [];

        if (collectionId) {
            items = items.filter((product) =>
                product.collectionIds?.includes(collectionId)
            );
        }

        return items;
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        return [];
    }
}

// Generate static params for all categories
export async function generateStaticParams() {
    return getAllCollectionSlugs().map((slug) => ({ categoria: slug }));
}

// Dynamic SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { categoria } = await params;
    const collection = getCollectionBySlug(categoria);

    if (!collection) {
        return { title: "Colección no encontrada | Restomueble" };
    }

    return {
        title: `${collection.name} | Restomueble — Mobiliario Premium`,
        description: collection.description,
        openGraph: {
            title: `${collection.name} | Restomueble`,
            description: collection.description,
        },
    };
}

export default async function CategoriaPage({ params }: PageProps) {
    const { categoria } = await params;
    const collection = getCollectionBySlug(categoria);

    if (!collection) {
        notFound();
    }

    // If wixId is set, filter by it; otherwise show all products
    const products = await getProducts(collection.wixId);

    return (
        <main className="bg-white min-h-screen">
            {/* Hero Section */}
            <CatalogueHero
                title={collection.name}
                subtitle={collection.description}
                productCount={products.length}
            />

            {/* Breadcrumb */}
            <div className="container mx-auto max-w-7xl px-6 pt-8">
                <nav className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gray-400">
                    <Link href="/" className="hover:text-[var(--accent)] transition-colors">
                        Inicio
                    </Link>
                    <span>→</span>
                    <Link href="/productos" className="hover:text-[var(--accent)] transition-colors">
                        Catálogo
                    </Link>
                    <span>→</span>
                    <span className="text-[var(--text-primary)]">{collection.name}</span>
                </nav>
            </div>

            {/* Category Navigation */}
            <div className="sticky top-[80px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 mt-6">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
                        <Link
                            href="/productos"
                            className="shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
                        >
                            Todos
                        </Link>
                        {COLLECTIONS.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/productos/${cat.slug}`}
                                className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${cat.slug === categoria
                                        ? "bg-[var(--brand-navy)] text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <section className="py-12 md:py-20 px-6 bg-white">
                <div className="container mx-auto max-w-7xl">
                    {/* Results Count */}
                    <div className="mb-12 flex justify-between items-center">
                        <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
                            Colección: {collection.name}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
                            {products.length} {products.length === 1 ? "Pieza" : "Piezas"}
                        </span>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-20">
                            {products.map((product, index) => (
                                <ProductCard key={product._id} product={product} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-gray-50 rounded-2xl">
                            <p className="text-xl text-[var(--text-secondary)] font-light mb-6">
                                {collection.wixId
                                    ? "Todavía no hay productos en esta colección."
                                    : "Esta colección aún no está vinculada a Wix. Actualiza el wixId en wixCollections.ts."}
                            </p>
                            <Link
                                href="/productos"
                                className="inline-block border-b border-black text-black text-sm font-bold tracking-widest uppercase pb-1 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                            >
                                Ver Todas las Colecciones
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
