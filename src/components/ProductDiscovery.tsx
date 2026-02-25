"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@wix/stores";
import { COLLECTIONS, normalizeSlug } from "@/lib/wixCollections";

interface ProductDiscoveryProps {
    initialProducts: products.Product[];
    content?: {
        discovery_title?: string;
        discovery_subtitle?: string;
    };
}

const ProductDiscovery = ({ initialProducts, content = {} }: ProductDiscoveryProps) => {
    const [activeIdx, setActiveIdx] = useState(0);

    const activeCollection = COLLECTIONS[activeIdx];

    // Filter products by the real Wix collection ID — single source of truth
    const filteredProducts = useMemo(() => {
        if (!activeCollection.wixId) return initialProducts;
        return initialProducts.filter((p) =>
            p.collectionIds?.includes(activeCollection.wixId!)
        );
    }, [initialProducts, activeIdx, activeCollection]);

    const discoveryTitle = content.discovery_title || "Exploración por Línea";
    const discoverySubtitle = content.discovery_subtitle || "";

    return (
        <section className="bg-white py-12 md:py-20 lg:py-32">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Header + Nav */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] }}
                    className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12 mb-16 md:mb-24"
                >
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-xs font-bold tracking-[0.3em] text-[var(--brand-navy)] uppercase mb-4 block"
                        >
                            {discoveryTitle}
                        </motion.span>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIdx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            >
                                <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-[#1D1D1F] leading-[1.1] mb-4 md:mb-6">
                                    {activeCollection.name}
                                </h2>
                                <p className="text-base md:text-lg lg:text-xl text-[#86868B] font-medium leading-relaxed max-w-xl">
                                    {discoverySubtitle || activeCollection.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Category Tabs */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="border-b border-[#F5F5F7] -mx-6 px-6 md:mx-0 md:px-0"
                    >
                        <nav className="flex gap-4 md:gap-6 lg:gap-10 pb-3 md:pb-4 overflow-x-auto no-scrollbar">
                            {COLLECTIONS.map((col, i) => (
                                <button
                                    key={col.slug}
                                    onClick={() => setActiveIdx(i)}
                                    className={`
                                        text-xs md:text-sm font-medium tracking-widest transition-all duration-300 whitespace-nowrap uppercase relative px-1 py-1 touch-manipulation min-h-[44px] flex items-center
                                        ${activeIdx === i
                                            ? "text-[#1D1D1F] font-bold"
                                            : "text-[#86868B] hover:text-[#1D1D1F]"}`}
                                >
                                    {col.name}
                                    {activeIdx === i && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute -bottom-[13px] md:-bottom-[17px] left-0 right-0 h-[2px] bg-black"
                                        />
                                    )}
                                </button>
                            ))}
                        </nav>
                    </motion.div>
                </motion.div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-16 md:gap-x-8 md:gap-y-20 lg:gap-x-12 lg:gap-y-24 items-start min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.slice(0, 12).map((product, index) => {
                                const imageUrl = product.media?.mainMedia?.image?.url || "/placeholder-product.png";

                                return (
                                    <Link
                                        href={`/producto/${normalizeSlug(product.slug || "")}`}
                                        key={product._id}
                                        className="flex flex-col group cursor-pointer"
                                    >
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{
                                                duration: 0.6,
                                                ease: [0.22, 1, 0.36, 1],
                                                delay: index * 0.05,
                                            }}
                                            className="w-full flex flex-col"
                                        >
                                            <div className="relative w-full aspect-square mb-6 flex items-center justify-center">
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/[0.03] blur-xl rounded-full transition-all duration-500 group-hover:bg-black/[0.05] group-hover:scale-110" />
                                                <div className="relative w-full h-full p-8 md:p-12 transition-transform duration-700 group-hover:-translate-y-4">
                                                    <Image
                                                        src={imageUrl}
                                                        alt={product.name || "Producto"}
                                                        fill
                                                        className="object-contain"
                                                        sizes="(max-width: 768px) 50vw, 33vw"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center text-center px-4">
                                                <h4 className="text-[10px] md:text-xs font-black text-[#1D1D1F] uppercase tracking-[0.2em] mb-1">
                                                    {product.name}
                                                </h4>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-[10px] md:text-xs font-normal text-[#86868B] uppercase tracking-[0.1em]">
                                                        {activeCollection.name}
                                                    </p>
                                                    <span className="w-1 h-1 bg-[#E5E5E5] rounded-full" />
                                                    <p className="text-[10px] md:text-xs font-bold text-[#1D1D1F] tracking-tight">
                                                        {product.priceData?.formatted?.price || "Consultar"}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-20 text-center"
                            >
                                <p className="text-xl text-[#86868B] font-medium">
                                    Próximamente más productos en esta línea.
                                </p>
                                <Link
                                    href="/tienda"
                                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--brand-navy)] border-b border-[var(--brand-navy)] pb-0.5 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                                >
                                    Ver catálogo completo →
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Link to full catalogue */}
                <div className="mt-16 md:mt-24 text-center">
                    <Link
                        href="/productos"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--brand-navy)] text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[var(--accent)] hover:text-[var(--brand-navy)] transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        Ver catálogo completo
                        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 11L11 1M11 1H3M11 1V9" />
                        </svg>
                    </Link>
                </div>
            </div>

            <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </section>
    );
};

export default ProductDiscovery;
