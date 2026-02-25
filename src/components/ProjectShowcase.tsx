"use client";

import { useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

const projects = [
    {
        id: 1,
        name: "La Terraza Gourmet",
        location: "Ciudad de México",
        category: "RESTAURANTE FINE DINING",
        image: "/images/projects/terraza.jpg",
        tags: ["Mesas de roble", "Sillas tapizadas", "Barra central"],
    },
    {
        id: 2,
        name: "Café Central",
        location: "Monterrey",
        category: "CAFETERÍA BOUTIQUE",
        image: "/images/projects/cafe.jpg",
        tags: ["Mesas bistró", "Bancos altos", "Estantería"],
    },
    {
        id: 3,
        name: "Taquería Premium",
        location: "Guadalajara",
        category: "RESTAURANTE CASUAL",
        image: "/images/projects/taqueria.jpg",
        tags: ["Bancos centrales", "Mesas altas", "Barra de bar"],
    },
    {
        id: 4,
        name: "Hotel Riviera",
        location: "Cancún",
        category: "HOTEL BOUTIQUE",
        image: "/images/projects/terraza.jpg",
        tags: ["Lobby lounge", "Terraza exterior", "Sillas de playa"],
    },
];

interface ProjectShowcaseProps {
    content?: {
        projects_title?: string;
        projects_description?: string;
        projects_cta_text?: string;
        projects_cta_button?: string;
    };
}

export default function ProjectShowcase({ content = {} }: ProjectShowcaseProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Mouse drag state
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeftStart = useRef(0);
    const hasDragged = useRef(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 5);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth * 0.75;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
            setTimeout(checkScroll, 400);
        }
    };

    // Mouse drag handlers for desktop click-and-drag
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        isDragging.current = true;
        hasDragged.current = false;
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeftStart.current = scrollRef.current.scrollLeft;
        scrollRef.current.style.cursor = "grabbing";
        scrollRef.current.style.scrollSnapType = "none"; // Disable snap while dragging
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5; // Speed multiplier
        if (Math.abs(walk) > 5) hasDragged.current = true;
        scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
    };

    const handleMouseUpOrLeave = () => {
        if (!scrollRef.current) return;
        isDragging.current = false;
        scrollRef.current.style.cursor = "grab";
        scrollRef.current.style.scrollSnapType = "x mandatory"; // Re-enable snap
        checkScroll();
    };

    // Prevent link navigation when dragging
    const handleCardClick = (e: React.MouseEvent) => {
        if (hasDragged.current) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    // Dynamic Content with Fallbacks
    const title = content.projects_title || "Espacios que transformamos";
    const description = content.projects_description || "Más de 30 años creando mobiliario que define la atmósfera de los mejores restaurantes y hoteles de México.";
    const ctaText = content.projects_cta_text || "¿Tienes un proyecto en mente?";
    const ctaButton = content.projects_cta_button || "Cotizar proyecto";

    return (
        <section id="proyectos" className="py-16 md:py-24 bg-white relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-14">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-3 md:mb-5 leading-[1.1]">
                            {title.includes("transformamos") ? (
                                <>
                                    {title.split("transformamos")[0]}
                                    <span className="italic text-[var(--brand-navy)]">transformamos</span>
                                    {title.split("transformamos")[1]}
                                </>
                            ) : title}
                        </h2>
                        <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="hidden md:flex gap-3 flex-shrink-0">
                        <button
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            aria-label="Anterior"
                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${canScrollLeft
                                ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                                : "border-gray-200 text-gray-300 cursor-not-allowed"
                                }`}
                        >
                            <FiChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            disabled={!canScrollRight}
                            aria-label="Siguiente"
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${canScrollRight
                                ? "bg-gray-900 text-white border-2 border-gray-900 hover:bg-gray-700"
                                : "bg-gray-100 text-gray-300 border-2 border-gray-200 cursor-not-allowed"
                                }`}
                        >
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Carousel Container with fade mask on sides */}
                <div className="relative">
                    {/* Gradient Mask - Left only */}
                    <div className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />

                    <div
                        ref={scrollRef}
                        onScroll={checkScroll}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUpOrLeave}
                        onMouseLeave={handleMouseUpOrLeave}
                        className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 pr-6 md:pr-0 md:-mr-[calc((100vw-1400px)/2+1.5rem)] cursor-grab select-none"
                        style={{
                            scrollbarWidth: 'none',   /* Firefox */
                            msOverflowStyle: 'none',  /* IE and Edge */
                        }}
                    >
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="relative flex-shrink-0 w-[80vw] md:w-[600px] h-[400px] md:h-[550px] rounded-2xl overflow-hidden group cursor-pointer snap-start"
                            >
                                {/* Image */}
                                <Image
                                    src={project.image}
                                    alt={project.name}
                                    fill
                                    sizes="(max-width:768px) 85vw, 600px"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                                    draggable={false}
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between">
                                    {/* Badge */}
                                    <span className="self-start px-3 md:px-4 py-1 md:py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] md:text-[11px] font-semibold tracking-widest">
                                        {project.category}
                                    </span>

                                    {/* Bottom */}
                                    <div>
                                        <h3 className="text-2xl md:text-5xl font-serif !text-white mb-2 leading-tight">
                                            {project.name}
                                        </h3>

                                        <div className="flex items-center gap-2 mb-5">
                                            <svg
                                                className="w-3.5 h-3.5 text-[#C8A882]"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span className="!text-gray-300 text-sm">
                                                {project.location}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full !text-gray-300 text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* CTA Card - Enhanced Blue Identity */}
                        <div className="relative flex-shrink-0 w-[80vw] md:w-[400px] h-[400px] md:h-[550px] rounded-2xl overflow-hidden snap-start bg-[var(--brand-navy-light)] flex flex-col items-center justify-center text-center p-8 md:p-10 group border border-[var(--brand-navy)]/10 mr-6 md:mr-8">
                            <div className="mb-6 w-16 h-16 rounded-full bg-[var(--brand-navy)]/10 flex items-center justify-center">
                                <FiArrowRight className="text-[var(--brand-navy)] w-7 h-7 transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-serif mb-4 text-gray-900">
                                {ctaText}
                            </h3>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                {ctaButton === "Cotizar proyecto"
                                    ? "Platícanos tu idea y diseñamos el mobiliario perfecto para tu espacio."
                                    : description}
                            </p>
                            <Link
                                href="#concierge"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--brand-navy)] text-white rounded-full text-sm font-medium hover:bg-[#1A2350] transition-colors duration-300 shadow-md hover:shadow-lg"
                            >
                                {ctaButton}
                                <FiArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Hide Scrollbar Style */}
                <style jsx global>{`
                    .scrollbar-none::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
            </div>
        </section>
    );
}
