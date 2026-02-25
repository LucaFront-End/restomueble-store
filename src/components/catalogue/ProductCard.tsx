"use client";

import Image from "next/image";
import Link from "next/link";
import { products } from "@wix/stores";
import { motion } from "framer-motion";
import { normalizeSlug } from "@/lib/wixCollections";

export const ProductCard = ({ product, index = 0 }: { product: products.Product, index?: number }) => {
    const imageUrl = product.media?.mainMedia?.image?.url || "/placeholder-product.png";
    const price = product.priceData?.formatted?.price || "$0";
    const productName = product.name || "Producto";
    const isOnSale = product.discount?.type === "PERCENT" || product.discount?.type === "AMOUNT";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
        >
            <Link href={`/producto/${normalizeSlug(product.slug || "")}`} className="group block">
                {/* Image Container */}
                <div className="relative aspect-[4/5] bg-[#F5F5F7] overflow-hidden mb-4 rounded-sm">
                    <Image
                        src={imageUrl}
                        alt={productName}
                        fill
                        className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Sale Badge */}
                    {isOnSale && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-[var(--accent)] text-white text-[10px] font-bold tracking-widest uppercase">
                            Oferta
                        </div>
                    )}

                    {/* Quick View Button - Appears on Hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <div className="w-full bg-white/95 backdrop-blur-sm py-3.5 text-center text-xs font-bold tracking-widest uppercase text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-white transition-colors duration-300 shadow-lg">
                            Ver Detalles
                            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                        </div>
                    </div>

                    {/* Corner Accent (Subtle Premium Detail) */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/0 group-hover:border-white/50 transition-colors duration-500 m-3" />
                </div>

                {/* Product Info */}
                <div className="space-y-1 px-1">
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="text-sm md:text-base font-medium text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors duration-300">
                            {productName}
                        </h3>
                        <span className="text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap">
                            {price}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${product.stock?.inStock ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                            {product.stock?.inStock ? "Disponible" : "Sobre Pedido"}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};
