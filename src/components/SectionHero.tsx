"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface SectionHeroProps {
    title: string | React.ReactNode;
    subtitle: string;
    overline?: string;
    backgroundImage?: string;
}

const SectionHero = ({ title, subtitle, overline, backgroundImage }: SectionHeroProps) => {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section ref={ref} className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden">
            {/* Parallax Background */}
            <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                {backgroundImage ? (
                    <Image
                        src={backgroundImage}
                        alt="Hero background"
                        fill
                        className="object-cover scale-110" // Escala ligera para evitar bordes blancos al mover
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-[var(--brand-navy-deep)]" />
                )}
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
            </motion.div>

            {/* Content */}
            <div className="container relative z-10 px-6 mx-auto pt-20">
                <div className="max-w-4xl">
                    {overline && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex items-center gap-4 mb-6"
                        >
                            <span className="w-12 h-px bg-[var(--accent)]" />
                            <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/90">
                                {overline}
                            </span>
                        </motion.div>
                    )}

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl lg:text-9xl font-serif !text-white mb-8 leading-[1]"
                    >
                        {title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-2xl !text-white/80 font-light leading-relaxed max-w-2xl"
                    >
                        {subtitle}
                    </motion.p>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
                <span className="text-[10px] tracking-widest uppercase">Scroll</span>
            </motion.div>
        </section>
    );
};

export default SectionHero;
