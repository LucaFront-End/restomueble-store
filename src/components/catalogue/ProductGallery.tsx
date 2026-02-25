"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
    mainImage: string;
    gallery: any[];
    productName: string;
}

export const ProductGallery = ({ mainImage, gallery, productName }: ProductGalleryProps) => {
    const [selectedImage, setSelectedImage] = useState(mainImage);

    // Filter out duplicates and ensure mainImage is first if needed, 
    // but Wix usually provides mainImage separately. 
    // We'll combine them for the thumbnail list.
    const allImages = [
        { image: { url: mainImage } },
        ...gallery.filter(item => item.image?.url !== mainImage)
    ];

    return (
        <div className="space-y-6">
            {/* Main Canvas - Sticky/Fixed Aspect Ratio */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F5F7] rounded-sm group"
            >
                <Image
                    src={selectedImage}
                    alt={productName}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    priority
                />
            </motion.div>

            {/* Thumbnail Strip (Scrollable) */}
            {allImages.length > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="flex gap-4 overflow-x-auto pb-2 scrollbar-none"
                >
                    {allImages.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(item.image?.url || "")}
                            className={`relative w-20 h-24 flex-shrink-0 overflow-hidden border transition-all duration-300 ${selectedImage === item.image?.url
                                    ? "border-gray-900 opacity-100 ring-1 ring-gray-900"
                                    : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                        >
                            <Image
                                src={item.image?.url || ""}
                                alt={`${productName} view ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </motion.div>
            )}
        </div>
    );
};
