"use client";

import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

const categories = [
    {
        id: "firme",
        title: "FIRME",
        subtitle: "Mesas y bases de estabilidad superior.",
        image: "/category-mesas.png",
        href: "/productos?category=mesas",
    },
    {
        id: "cafe",
        title: "CAFÉ",
        subtitle: "Sillas diseñadas para la conversación.",
        image: "/category-sillas.png",
        href: "/productos?category=sillas",
    },
    {
        id: "pro",
        title: "PRO",
        subtitle: "Equipamiento industrial de alto rendimiento.",
        image: "/category-bancos.png",
        href: "/productos?category=bancos",
    },
    {
        id: "hotel",
        title: "HOTEL",
        subtitle: "Hospitalidad y confort redefinidos.",
        image: "/category-sillas.png", // Reusing placeholder
        href: "/productos?category=hotel",
    },
    {
        id: "evento",
        title: "EVENTO",
        subtitle: "Soluciones versátiles para grandes aforos.",
        image: "/category-mesas.png", // Reusing placeholder
        href: "/productos?category=eventos",
    },
];

const CategorySwiss = () => {
    return (
        <section className="bg-white text-[#1D1D1F]">
            <div className="container mx-auto px-6 md:px-16 py-24 md:py-32">

                {/* Section Header - Apple Style with more whitespace */}
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#1d1d1f]">
                        Líneas de Producto.
                    </h2>
                    <p className="text-lg md:text-xl text-[#86868b] font-medium">
                        Diseñadas con precisión para cada necesidad de tu negocio.
                    </p>
                </div>

                {/* Gallery Grid - Clean, no borders, contact shadows */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">

                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={cat.href}
                            className="group block text-center"
                        >
                            {/* Product Image - Isolated on white with contact shadow */}
                            <div className="relative aspect-square mb-6 flex items-end justify-center">
                                {/* Product Image */}
                                <div className="relative w-[85%] h-[85%]">
                                    <Image
                                        src={cat.image}
                                        alt={cat.title}
                                        fill
                                        className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                </div>
                                {/* Contact Shadow - Subtle ellipse below product */}
                                <div
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-4 bg-black/8 blur-xl rounded-[100%] opacity-60 group-hover:opacity-80 transition-opacity"
                                    style={{ transform: 'translateX(-50%) scaleY(0.3)' }}
                                ></div>
                            </div>

                            {/* Text Below - Apple Typography */}
                            <h3 className="text-lg md:text-xl font-bold text-[#1d1d1f] mb-2 tracking-tight group-hover:text-[#0066CC] transition-colors">
                                {cat.title}
                            </h3>
                            <p className="text-sm text-[#86868b] font-medium leading-relaxed">
                                {cat.subtitle}
                            </p>
                        </Link>
                    ))}

                </div>
            </div>
        </section>
    );
};

export default CategorySwiss;
