import { getWixServerClient } from "@/lib/wixClientServer";
import { COLLECTIONS } from "@/lib/wixCollections";
import { getStorePageContent } from "@/lib/wixCmsStore";
import { CatalogueHero } from "@/components/catalogue/CatalogueHero";
import { ProductCard } from "@/components/catalogue/ProductCard";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 60;

async function getProducts() {
    try {
        const wixClient = getWixServerClient();
        const result = await wixClient.products.queryProducts().limit(100).find();
        return result.items || [];
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        return [];
    }
}

export async function generateMetadata(): Promise<Metadata> {
    const content = await getStorePageContent();
    return {
        title: `${content.titulo} | Josepja`,
        description: content.descripcion,
    };
}

export default async function TiendaPage() {
    const [products, content] = await Promise.all([
        getProducts(),
        getStorePageContent(),
    ]);

    return (
        <main className="bg-white min-h-screen">
            {/* 1. Hero — título y descripción vienen del CMS */}
            <CatalogueHero
                title={content.titulo}
                subtitle={content.descripcion}
                productCount={products.length}
            />

            {/* 2. Category Navigation */}
            <div className="sticky top-[80px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
                        <span className="shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[var(--brand-navy)] text-white">
                            Todos
                        </span>
                        {COLLECTIONS.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/tienda/${cat.slug}`}
                                className="shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Product Grid */}
            <section className="py-16 md:py-24 px-6 bg-white">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-12 flex justify-between items-center">
                        <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
                            Todas las colecciones
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
                                No se encontraron productos.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
