"use client";

import { motion } from "framer-motion";

export const CatalogueHero = ({ title = "Catálogo", subtitle = "Nuestra colección completa", productCount = 0 }: { title?: string, subtitle?: string, productCount?: number }) => {
    return (
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-6 overflow-hidden bg-white">
            {/* Premium Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top-Left Corner Accent */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute top-16 left-8 md:left-16 w-24 h-24 border-l border-t border-[var(--accent)]/20"
                />
                {/* Bottom-Right Corner Accent */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="absolute bottom-16 right-8 md:right-16 w-24 h-24 border-r border-b border-[var(--accent)]/20"
                />
                {/* Floating Dot Grid (Subtle Pattern) */}
                <div className="absolute top-1/2 right-12 md:right-24 -translate-y-1/2 opacity-30 hidden lg:block">
                    <div className="grid grid-cols-3 gap-4">
                        {[...Array(9)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                transition={{ delay: 0.8 + i * 0.05 }}
                                className="w-1 h-1 rounded-full bg-[var(--accent)]"
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="max-w-4xl">
                    {/* Overline with Accent Line */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-4 mb-6"
                    >
                        <span className="w-8 md:w-12 h-px bg-[var(--accent)]" />
                        <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-[var(--accent)] uppercase">
                            The Collection
                        </span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-[var(--text-primary)] mb-6 md:mb-8 leading-[0.9]"
                    >
                        {title}
                        <span className="text-[var(--accent)]">.</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-lg md:text-xl text-[var(--text-secondary)] font-light max-w-2xl leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>

                    {/* Product Count Badge (Optional) */}
                    {productCount > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-8 inline-flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-100"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium text-[var(--text-secondary)]">
                                {productCount} piezas disponibles
                            </span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Animated Bottom Border */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent origin-left"
            />
        </section>
    );
};
