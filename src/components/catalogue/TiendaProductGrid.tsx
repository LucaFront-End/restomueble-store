"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/catalogue/ProductCard";
import Link from "next/link";
import { COLLECTIONS } from "@/lib/wixCollections";

interface TiendaProductGridProps {
    products: any[];
}

export default function TiendaProductGrid({ products }: TiendaProductGridProps) {
    const [searchQuery, setSearchQuery] = useState("");

    /** Strip accents/diacritics and lowercase for Spanish-friendly matching */
    const normalize = (s: string) =>
        s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    const filteredProducts = useMemo(() => {
        if (searchQuery.length < 2) return products;
        
        const queryWords = normalize(searchQuery).split(/\s+/).filter(w => w.length > 0);
        
        return products.filter(p => {
            const nameNorm = normalize(p.name || "");
            const slugNorm = normalize(p.slug || "");
            const rawDesc = (p.description || "").replace(/<[^>]*>/g, "");
            const descNorm = normalize(rawDesc);
            const searchable = `${nameNorm} ${slugNorm} ${descNorm}`;
            
            return queryWords.every(word => searchable.includes(word));
        });
    }, [products, searchQuery]);

    return (
        <>
            {/* Sticky Category Bar + Search */}
            <div className="sticky top-[80px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="flex items-center gap-3 py-4">
                        {/* Categories — horizontal scroll */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
                            <Link
                                href="/tienda"
                                className="shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[var(--brand-navy)] text-white"
                            >
                                Todos
                            </Link>
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

                        {/* Inline Search */}
                        <div className="relative shrink-0">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Filtrar..."
                                className="pl-9 pr-4 py-2.5 w-36 md:w-48 text-sm bg-gray-100 rounded-full outline-none border-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:bg-white transition-all placeholder-gray-400"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <section className="py-16 md:py-24 px-6 bg-white">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-12 flex justify-between items-center">
                        <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
                            {searchQuery.length >= 2
                                ? `Resultados para "${searchQuery}"`
                                : "Todas las colecciones"}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
                            {filteredProducts.length} {filteredProducts.length === 1 ? "Pieza" : "Piezas"}
                        </span>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-20">
                            {filteredProducts.map((product, index) => (
                                <ProductCard key={product._id} product={product} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-gray-50 rounded-2xl">
                            <p className="text-xl text-gray-400 font-light mb-4">
                                No se encontraron productos para &quot;{searchQuery}&quot;
                            </p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="px-6 py-2.5 text-sm font-semibold text-[var(--brand-navy)] border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                Limpiar búsqueda
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
