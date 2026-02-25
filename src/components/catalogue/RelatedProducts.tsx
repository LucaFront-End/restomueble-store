"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { normalizeSlug } from "@/lib/wixCollections";

interface Product {
    _id: string;
    slug: string;
    name: string;
    price: string;
    image: string;
    category?: string;
}

interface RelatedProductsProps {
    currentProductId: string;
    products: any[]; // Raw wix products
}

export const RelatedProducts = ({ currentProductId, products }: RelatedProductsProps) => {
    // Filter out current product and take 4
    const related = products
        .filter(p => p._id !== currentProductId)
        .slice(0, 4);

    if (related.length === 0) return null;

    return (
        <section className="border-t border-gray-100 py-24 mt-24">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-heading font-bold text-gray-900">
                            Completa el Espacio
                        </h2>
                        <p className="text-gray-500 max-w-md">
                            Piezas seleccionadas que combinan perfectamente con tu elección.
                        </p>
                    </div>
                    <Link href="/tienda" className="hidden md:block text-sm font-semibold text-gray-900 border-b border-gray-900 pb-1 hover:opacity-70 transition-opacity">
                        Ver Todo el Catálogo
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {related.map((product, idx) => (
                        <Link href={`/producto/${normalizeSlug(product.slug || "")}`} key={product._id} className="group block">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                            >
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6">
                                    {product.media?.mainMedia?.image?.url ? (
                                        <Image
                                            src={product.media.mainMedia.image.url}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                    )}
                                    {/* Quick Add Overlay */}
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-medium text-gray-900 group-hover:underline decoration-1 underline-offset-4">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-500 font-light">
                                        {product.priceData?.formatted?.price}
                                    </p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 md:hidden text-center">
                    <Link href="/tienda" className="text-sm font-semibold text-gray-900 border-b border-gray-900 pb-1">
                        Ver Todo el Catálogo
                    </Link>
                </div>
            </div>
        </section>
    );
};
