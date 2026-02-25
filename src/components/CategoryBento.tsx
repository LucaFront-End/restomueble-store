"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { getWixImageUrl } from "@/lib/wixImageUrl";

interface CategoryBentoProps {
    content?: {
        bento_overline?: string;
        bento_title?: string;
        bento_description?: string;
        cat_firme_title?: string;
        cat_firme_subtitle?: string;
        cat_firme_image?: string;
        cat_cafe_title?: string;
        cat_cafe_subtitle?: string;
        cat_cafe_image?: string;
        cat_pro_title?: string;
        cat_pro_subtitle?: string;
        cat_pro_image?: string;
        cat_hotel_title?: string;
        cat_hotel_subtitle?: string;
        cat_hotel_image?: string;
        cat_evento_title?: string;
        cat_evento_subtitle?: string;
        cat_evento_image?: string;
    };
}

const CategoryBento = ({ content = {} }: CategoryBentoProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    const productLines = [
        {
            id: "firme",
            title: content.cat_firme_title || "FIRME",
            subtitle: content.cat_firme_subtitle || "Mesas y bases de estabilidad superior.",
            href: "/productos/mesas",
            image: getWixImageUrl(content.cat_firme_image) || "/category-firme.png",
            size: "large",
            overlay: "from-black/70 via-black/50 to-black/60",
        },
        {
            id: "cafe",
            title: content.cat_cafe_title || "CAFÉ",
            subtitle: content.cat_cafe_subtitle || "Sillas de diseño.",
            href: "/productos/sillas-y-bancos",
            image: getWixImageUrl(content.cat_cafe_image) || "/category-cafe.png",
            size: "medium",
            overlay: "from-black/70 via-black/50 to-black/60",
        },
        {
            id: "pro",
            title: content.cat_pro_title || "PRO",
            subtitle: content.cat_pro_subtitle || "Industrial.",
            href: "/productos/booths",
            image: getWixImageUrl(content.cat_pro_image) || "/category-pro.png",
            size: "medium",
            overlay: "from-black/70 via-black/50 to-black/60",
        },
        {
            id: "hotel",
            title: content.cat_hotel_title || "HOTEL",
            subtitle: content.cat_hotel_subtitle || "Confort lounge.",
            href: "/productos/sala-lounge",
            image: getWixImageUrl(content.cat_hotel_image) || "/category-hotel.png",
            size: "small",
            overlay: "from-black/70 via-black/50 to-black/60",
        },
        {
            id: "evento",
            title: content.cat_evento_title || "EVENTO",
            subtitle: content.cat_evento_subtitle || "Alto tráfico.",
            href: "/productos/linea-plegable",
            image: getWixImageUrl(content.cat_evento_image) || "/category-evento.png",
            size: "small",
            overlay: "from-black/70 via-black/50 to-black/60",
        },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Headings with Fallbacks
    const overline = content.bento_overline || "Catálogo 2025";
    const title = content.bento_title || "Espacios que inspiran.";
    const description = content.bento_description || "Diseño, confort y durabilidad en nuestras cinco líneas exclusivas para hoteles y restaurantes.";

    return (
        <section
            id="catalogo-bento"
            ref={sectionRef}
            className="relative z-20 bg-white mt-12 md:mt-20"
        >
            <div className="container mx-auto px-6 md:px-8 lg:px-20 pt-12 md:pt-20 lg:pt-32 pb-16 md:pb-24 lg:pb-36">

                {/* Section Header - Refined editorial proportions */}
                <div className={`
                    flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 lg:mb-24 gap-6 md:gap-10 lg:gap-16
                    transition-all duration-1000 ease-out
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}>
                    <div className="max-w-4xl relative">
                        {/* Subtle decorative bar */}
                        <div className="absolute -left-4 md:-left-8 top-0 w-1 md:w-1.5 h-full bg-[#003366] rounded-full opacity-10"></div>

                        <span className="text-xs md:text-sm font-bold tracking-[0.25em] text-[#003366] uppercase mb-3 md:mb-4 block pl-2">
                            {overline}
                        </span>

                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-[#1d1d1f] leading-[1.05] pl-2">
                            {title.includes("inspiran.") ? (
                                <>
                                    {title.split("inspiran.")[0]}
                                    <span className="bg-gradient-to-r from-[#FDB813] via-[#FFD700] to-[#FDB813] bg-clip-text text-transparent filter drop-shadow-sm">
                                        inspiran.
                                    </span>
                                </>
                            ) : title}
                        </h2>
                    </div>

                    <div className="max-w-lg pb-1 md:pb-4">
                        <p className="text-base md:text-lg lg:text-xl text-[#515154] font-medium leading-relaxed border-l-2 border-[#FFD700] pl-4 md:pl-5 py-1">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Bento Grid - Stack on mobile, 2x2 on medium, 4-col on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 auto-rows-[240px] md:auto-rows-[220px] lg:auto-rows-[260px]">

                    {productLines.map((line, index) => {
                        const spanClass =
                            line.id === "firme" ? "col-span-1 md:col-span-2 row-span-1 md:row-span-2" :
                                line.id === "cafe" ? "col-span-1 md:col-span-1 row-span-1 md:row-span-2" :
                                    line.id === "pro" ? "col-span-1 md:col-span-1 row-span-1 md:row-span-2" :
                                        line.id === "hotel" ? "col-span-1 md:col-span-2 lg:col-span-2 row-span-1" :
                                            "col-span-1 md:col-span-2 lg:col-span-2 row-span-1";

                        return (
                            <Link
                                key={line.id}
                                href={line.href}
                                className={`
                                    group relative rounded-2xl md:rounded-[28px] overflow-hidden
                                    ${spanClass}
                                    shadow-lg shadow-black/10
                                    transition-all duration-700 ease-out
                                    hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/25
                                    md:hover:-translate-y-2
                                    touch-manipulation
                                    ${isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-12'}
                                `}
                                style={{
                                    transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
                                }}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 w-full h-full">
                                    <Image
                                        src={line.image}
                                        alt={line.title}
                                        fill
                                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                                        priority={index === 0}
                                    />
                                </div>

                                {/* Dark Overlay */}
                                <div className={`
                                    absolute inset-0 bg-gradient-to-t ${line.overlay}
                                    opacity-[0.92] group-hover:opacity-[0.88] 
                                    transition-opacity duration-700
                                `}></div>

                                {/* Content */}
                                <div className="absolute inset-0 p-7 md:p-10 flex flex-col justify-end">
                                    <div className="transform translate-y-2 md:translate-y-3 group-hover:translate-y-0 transition-all duration-700 ease-out">

                                        {/* Micro Label with Brand Color Highlight */}
                                        <div className="inline-block mb-2 md:mb-3 px-2.5 md:px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:border-[#FFD700]/50 transition-colors">
                                            <p className="text-[9px] md:text-[10px] font-bold tracking-[0.15em] text-white/80 uppercase">
                                                Restomueble
                                            </p>
                                        </div>

                                        {/* Title */}
                                        <h3
                                            className={`
                                                font-bold tracking-tight leading-[0.95] mb-2 md:mb-3
                                                drop-shadow-lg
                                                ${line.size === "large" ? "text-4xl md:text-5xl lg:text-6xl" : "text-2xl md:text-3xl lg:text-4xl"}
                                            `}
                                            style={{ color: '#FFFFFF' }}
                                        >
                                            {line.title}
                                        </h3>

                                        {/* Subtitle */}
                                        <p className={`
                                            text-white/90 font-medium leading-relaxed
                                            md:opacity-0 md:group-hover:opacity-100
                                            transition-opacity duration-700 delay-100
                                            drop-shadow-md
                                            ${line.size === "large" ? "text-base md:text-lg lg:text-xl max-w-md" : "text-sm md:text-base"}
                                        `}>
                                            {line.subtitle}
                                        </p>

                                        {/* CTA Arrow with Brand Yellow Accent */}
                                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                                            <div className="inline-flex items-center gap-2 text-white font-semibold text-sm md:text-base group-hover:text-[#FFD700] transition-colors">
                                                <span>Explorar la línea</span>
                                                <svg
                                                    className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Inner Border with Blue Accent on Hover */}
                                <div className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/20 group-hover:ring-[#003366]/40 transition-all duration-500 pointer-events-none"></div>

                                {/* Corner Accent */}
                                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            </Link>
                        );
                    })}

                </div>
            </div>
        </section>
    );
};



export default CategoryBento;
