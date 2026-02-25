"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getWixImageUrl } from "@/lib/wixImageUrl";

interface HeroSectionProps {
    content?: {
        hero_overline?: string;
        hero_title?: string;
        hero_subtitle?: string;
        hero_image?: string;
        hero_cta_text?: string;
        hero_cta_secondary_text?: string;
        hero_stat_1_value?: string;
        hero_stat_1_label?: string;
        hero_stat_2_value?: string;
        hero_stat_2_label?: string;
        hero_stat_3_value?: string;
        hero_stat_3_label?: string;
    };
}

const HeroSection = ({ content = {} }: HeroSectionProps) => {
    const [loaded, setLoaded] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        setLoaded(true);

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Dynamic Content with Fallbacks
    const overline = content.hero_overline || "Fabricación Nacional • Est. 2009";
    const titulo = content.hero_title || "Mobiliario de diseño para espacios que inspiran.";
    const subtitulo = content.hero_subtitle || "Fabricación de mobiliario a medida para restaurantes, hoteles y oficinas. Calidad garantizada.";
    const ctaText = content.hero_cta_text || "Ver Catálogo";
    const ctaSecondaryText = content.hero_cta_secondary_text || "Cotizar Proyecto";
    const bgImage = getWixImageUrl(content.hero_image) || "/hero-restaurant.png";

    // Format title if it contains specific markers or needs split (Simplified for CMS)
    const renderTitle = () => {
        if (!content.hero_title) {
            return (
                <>
                    Mobiliario de <em className="text-[var(--accent)] not-italic">diseño</em> para espacios que inspiran.
                </>
            );
        }

        // Emphasize "espacios" if present in CMS title
        if (titulo.toLowerCase().includes("espacios")) {
            const parts = titulo.split(/espacios/i);
            return (
                <>
                    {parts[0]}
                    <em className="text-[var(--accent)] not-italic">espacios</em>
                    {parts[1]}
                </>
            );
        }
        return titulo;
    };

    // Calculate blur and dimming based on scroll position
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const blurAmount = isMobile ? 0 : Math.min(scrollY / 40, 4);
    const overlayOpacity = Math.min(0.65 + (scrollY / 1000), 0.9);

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">

            {/* BACKGROUND LAYER */}
            <div
                className="absolute inset-0 z-0 will-change-transform"
                style={{
                    transform: `translateY(${scrollY * 0.5}px)`,
                }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-75 ease-out"
                    style={{
                        backgroundImage: `url('${bgImage}')`,
                        filter: `blur(${blurAmount}px)`,
                    }}
                />
                {/* Dynamic Dark Overlay (Navy Blue Tint) */}
                <div
                    className="absolute inset-0 bg-[var(--brand-navy-deep)] transition-opacity duration-75 ease-out"
                    style={{ opacity: overlayOpacity }}
                />
            </div>

            {/* DECORATIVE LAYER */}
            <div
                className="absolute inset-0 z-0 pointer-events-none hidden md:block"
                style={{
                    transform: `translateY(${scrollY * 0.3}px)`,
                    filter: `blur(${blurAmount * 0.5}px)`
                }}
            >
                <div className="absolute top-10 left-10 w-32 h-32 border-l border-t border-white/20 opacity-60"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 border-r border-b border-white/20 opacity-60"></div>
                <div className="absolute left-16 top-1/2 -translate-y-1/2 h-64 w-px bg-gradient-to-b from-transparent via-[var(--accent)] to-[var(--brand-navy)] opacity-60"></div>
            </div>

            {/* CONTENT LAYER */}
            <div className="container relative z-10 py-16 md:py-24 px-6">
                <div className="max-w-4xl">

                    {/* Overline */}
                    <div
                        className={`flex items-center gap-6 mb-8 transition-all duration-1000 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
                    >
                        <span className="w-12 md:w-16 h-px bg-[var(--accent)]"></span>
                        <span className="text-[10px] md:text-sm font-medium tracking-[0.2em] md:tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.8)' }}>
                            {overline}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="mb-6 md:mb-8">
                        <span
                            className={`block font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.15] md:leading-[1.1] transition-all duration-1000 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                            style={{ color: '#FFFFFF' }}
                        >
                            {renderTitle()}
                        </span>
                    </h1>

                    {/* Description */}
                    <p
                        className={`text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-xl mb-8 md:mb-12 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                        style={{ color: 'rgba(255,255,255,0.9)' }}
                    >
                        {subtitulo}
                    </p>

                    {/* Buttons */}
                    <div
                        className={`flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 mb-12 md:mb-20 transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    >
                        <Link
                            href="/productos"
                            className="group relative inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-white text-[var(--text-primary)] text-xs md:text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:bg-[var(--accent)] hover:text-white min-h-[48px] touch-manipulation"
                        >
                            <span>{ctaText}</span>
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>

                        <Link
                            href="#concierge"
                            className="inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 border border-white/40 text-white text-xs md:text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:bg-white hover:text-[var(--text-primary)] hover:border-white min-h-[48px] touch-manipulation"
                        >
                            {ctaSecondaryText}
                        </Link>
                    </div>

                    {/* Stats */}
                    <div
                        className={`grid grid-cols-3 gap-6 md:gap-16 pt-6 md:pt-8 border-t border-white/10 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div>
                            <span className="block text-2xl md:text-4xl font-serif mb-1" style={{ color: '#FFFFFF' }}>{content.hero_stat_1_value || "+500"}</span>
                            <span className="text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{content.hero_stat_1_label || "Proyectos"}</span>
                        </div>
                        <div>
                            <span className="block text-2xl md:text-4xl font-serif mb-1" style={{ color: '#FFFFFF' }}>{content.hero_stat_2_value || "15"}</span>
                            <span className="text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{content.hero_stat_2_label || "Años Exp."}</span>
                        </div>
                        <div>
                            <span className="block text-2xl md:text-4xl font-serif mb-1" style={{ color: '#FFFFFF' }}>{content.hero_stat_3_value || "100%"}</span>
                            <span className="text-[10px] md:text-xs uppercase tracking-wider md:tracking-widest font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{content.hero_stat_3_label || "México"}</span>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    );
};

export default HeroSection;
