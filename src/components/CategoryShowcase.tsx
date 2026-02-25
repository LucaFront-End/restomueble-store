"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Definición de las líneas de producto para el Showcase
const categories = [
    {
        id: "firme",
        slug: "mesas",
        title: "Restomueble FIRME",
        productName: "Mesa Bar Industrial",
        description: "Estabilidad superior y acabados de uso rudo para los espacios más exigentes.",
        image: "/product-firme.png",
    },
    {
        id: "cafe",
        slug: "sillas",
        title: "Restomueble CAFÉ",
        productName: "Silla Minimalista Cuero",
        description: "Elegancia atemporal combinada con la ergonomía necesaria para largas estancias.",
        image: "/product-cafe.png",
    },
    {
        id: "pro",
        slug: "bancos",
        title: "Restomueble PRO",
        productName: "Banco Industrial PRO",
        description: "Diseño industrial puro con durabilidad estructural garantizada.",
        image: "/product-pro.png",
    },
    {
        id: "hotel",
        slug: "hotel",
        title: "Restomueble HOTEL",
        productName: "Sillón Lounge Velvet",
        description: "Confort premium y diseño sofisticado para lobbies y zonas de descanso.",
        image: "/product-hotel.png",
    },
    {
        id: "evento",
        slug: "eventos",
        title: "Restomueble EVENTO",
        productName: "Silla Apilable Elite",
        description: "La solución definitiva para eventos masivos: ligereza, fuerza y almacenamiento eficiente.",
        image: "/product-evento.png",
    },
];

const CategoryShowcase = () => {
    const [activeIdx, setActiveIdx] = useState(0);

    const activeCat = categories[activeIdx];

    return (
        <section className="bg-white py-32 overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* --- HERO DISPLAY AREA --- */}
                <div className="relative min-h-[500px] flex flex-col items-center justify-center text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCat.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 1.05 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full flex flex-col items-center"
                        >
                            {/* Product Photo */}
                            <div className="relative w-full max-w-2xl aspect-[4/3] mb-12">
                                <Image
                                    src={activeCat.image}
                                    alt={activeCat.productName}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {/* Typography */}
                            <div className="max-w-2xl px-4">
                                <h3 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] tracking-tight mb-4">
                                    {activeCat.productName}
                                </h3>
                                <p className="text-xl text-[#86868B] font-medium leading-relaxed">
                                    {activeCat.description}
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* --- CATEGORY NAVIGATION (PILLS) --- */}
                <div className="mt-24 flex flex-wrap justify-center gap-4">
                    {categories.map((cat, idx) => {
                        const isActive = idx === activeIdx;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveIdx(idx)}
                                className={`
                                    px-8 py-3 rounded-full border text-sm font-semibold transition-all duration-300
                                    ${isActive
                                        ? "bg-[#007AFF] border-[#007AFF] text-white shadow-lg shadow-blue-500/20"
                                        : "bg-white border-[#E5E5E5] text-[#1D1D1F] hover:bg-[#F5F5F7] hover:border-[#D1D1D6]"}
                                `}
                            >
                                {cat.title}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CategoryShowcase;
