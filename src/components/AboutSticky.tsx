"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getWixImageUrl } from "@/lib/wixImageUrl";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
    {
        id: "historia",
        title: "Historia",
        heading: "30+ años fabricando el legado de México",
        description:
            "Desde 1990, en Restomueble hemos dedicado cada jornada a crear mobiliario que resiste al paso del tiempo. Comenzamos en un pequeño taller en la CDMX y hoy somos referentes en la industria.",
        stats: [
            { value: "30+", label: "AÑOS" },
            { value: "500+", label: "PROYECTOS" },
            { value: "100%", label: "MÉXICO" },
        ],
        image: "/images/about-workshop-new.png", // Updated
    },
    {
        id: "mision",
        title: "Misión",
        heading: "Espacios que inspiran experiencias",
        description:
            "Nuestra misión es diseñar y fabricar mobiliario de alta calidad que transforme restaurantes y hoteles en espacios memorables. Buscamos que cada pieza cuente una historia de excelencia y artesanía.",
        stats: [
            { value: "100%", label: "NACIONAL" },
            { value: "5", label: "AÑOS GARANTÍA" },
            { value: "24/7", label: "SOPORTE" },
        ],
        image: "/images/about-craft-new.png", // Updated
    },
    {
        id: "valores",
        title: "Valores",
        heading: "Calidad, diseño y compromiso",
        description:
            "Nos guiamos por valores inquebrantables: excelencia en cada detalle, innovación en el diseño, compromiso con nuestros clientes y orgullo por nuestras raíces artesanas.",
        stats: [
            { value: "50+", label: "ARTESANOS" },
            { value: "10K+", label: "PIEZAS ANUALES" },
            { value: "100%", label: "CALIDAD" },
        ],
        image: "/images/about-legacy-new.png", // Updated
    },
];

interface AboutStickyProps {
    content?: {
        about_historia_heading?: string;
        about_historia_description?: string;
        about_historia_image?: string;
        about_mision_heading?: string;
        about_mision_description?: string;
        about_mision_image?: string;
        about_valores_heading?: string;
        about_valores_description?: string;
        about_valores_image?: string;
    };
}

export default function AboutSticky({ content = {} }: AboutStickyProps) {
    const [activeSection, setActiveSection] = useState("historia");
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Merge static data with CMS content
    const dynamicSections = [
        {
            ...sections[0],
            heading: content.about_historia_heading || sections[0].heading,
            description: content.about_historia_description || sections[0].description,
            image: getWixImageUrl(content.about_historia_image) || sections[0].image,
        },
        {
            ...sections[1],
            heading: content.about_mision_heading || sections[1].heading,
            description: content.about_mision_description || sections[1].description,
            image: getWixImageUrl(content.about_mision_image) || sections[1].image,
        },
        {
            ...sections[2],
            heading: content.about_valores_heading || sections[2].heading,
            description: content.about_valores_description || sections[2].description,
            image: getWixImageUrl(content.about_valores_image) || sections[2].image,
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const windowH = window.innerHeight;

            let bestCandidate = dynamicSections[0].id;
            let maxOverlap = 0;

            sectionRefs.current.forEach((el, idx) => {
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const overlapStart = Math.max(rect.top, windowH * 0.2);
                const overlapEnd = Math.min(rect.bottom, windowH * 0.8);
                const overlap = Math.max(0, overlapEnd - overlapStart);

                if (overlap > maxOverlap) {
                    maxOverlap = overlap;
                    bestCandidate = dynamicSections[idx].id;
                }
            });

            if (maxOverlap > 0) {
                setActiveSection(bestCandidate);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [dynamicSections]);

    return (
        <section id="about" className="bg-[#F8F6F3]">
            <div className="container mx-auto px-6">

                {/* --- MOBILE LAYOUT --- */}
                <div className="md:hidden py-16 flex flex-col gap-24">
                    {dynamicSections.map((section) => (
                        <div key={section.id} className="flex flex-col gap-8">
                            <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                                <Image
                                    src={section.image}
                                    alt={section.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/80 mb-2 block">{section.title}</span>
                                    <h3 className="text-2xl font-serif text-white leading-tight mb-2">{section.heading}</h3>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light">
                                    {section.description}
                                </p>
                                <div className="grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
                                    {section.stats.map((stat, sIdx) => (
                                        <div key={sIdx}>
                                            <div className="text-2xl font-serif font-bold text-[var(--brand-navy)] mb-1">
                                                {stat.value}
                                            </div>
                                            <div className="text-[9px] text-gray-400 tracking-widest font-bold uppercase">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- DESKTOP LAYOUT --- */}
                <div className="hidden md:grid grid-cols-12 gap-20 items-start">

                    {/* Left Columns: Visuals Sticky */}
                    <div className="col-span-6 h-[300vh] relative">
                        <div className="sticky top-0 h-screen flex items-center justify-center py-20 box-border">
                            <div className="relative w-full max-w-lg aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                                <AnimatePresence mode="popLayout">
                                    {dynamicSections.map((section) => activeSection === section.id && (
                                        <motion.div
                                            key={section.id}
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.8 }}
                                            className="absolute inset-0"
                                        >
                                            <Image
                                                src={section.image}
                                                alt={section.title}
                                                fill
                                                className="object-cover"
                                                priority={section.id === "historia"}
                                            />
                                            {/* Gradient Overlay for Text Readability if needed */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40" />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Current Section Indicator/Tabs inside Image */}
                                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
                                    {dynamicSections.map((s) => (
                                        <div
                                            key={s.id}
                                            className={`h-1 rounded-full transition-all duration-500 ${activeSection === s.id ? "w-12 bg-white" : "w-2 bg-white/30"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Columns: Content Scrollable */}
                    <div className="col-span-6 py-[20vh]">
                        {dynamicSections.map((section, idx) => (
                            <motion.div
                                key={section.id}
                                ref={(el: HTMLDivElement | null) => {
                                    sectionRefs.current[idx] = el;
                                }}
                                initial={{ opacity: 0.2 }}
                                animate={{ opacity: activeSection === section.id ? 1 : 0.2 }}
                                transition={{ duration: 0.5 }}
                                className="min-h-[85vh] flex flex-col justify-center max-w-lg mx-auto"
                            >
                                <span className="text-xs font-bold tracking-[0.3em] text-[var(--accent)] uppercase mb-6 block">
                                    0{idx + 1}. {section.title}
                                </span>

                                <h3 className="text-5xl lg:text-7xl font-serif mb-8 leading-[1.1] text-gray-900">
                                    {section.heading}
                                </h3>

                                <p className="text-gray-500 text-xl leading-relaxed mb-12 font-light">
                                    {section.description}
                                </p>

                                <div className="flex gap-12 border-t border-gray-200 pt-8">
                                    {section.stats.map((stat, sIdx) => (
                                        <div key={sIdx}>
                                            <div className="text-4xl font-serif text-[var(--brand-navy)] mb-2">
                                                {stat.value}
                                            </div>
                                            <div className="text-[10px] text-gray-400 tracking-[0.2em] font-bold uppercase">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
