"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";

interface Category {
    value: string;
    label: string;
}

interface FilterBarProps {
    categories: Category[];
}

export const FilterBar = ({ categories }: FilterBarProps) => {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get("category") || "";
    const [isSticky, setIsSticky] = useState(false);
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (barRef.current) {
                setIsSticky(window.scrollY > 300);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Add "Todos" option at the beginning
    const allCategories = [
        { value: "", label: "Todos" },
        ...categories
    ];

    return (
        <motion.div
            ref={barRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`
                sticky top-[var(--header-height)] z-30 
                bg-white/90 backdrop-blur-xl 
                border-b border-gray-100 
                transition-all duration-500
                ${isSticky ? 'shadow-md bg-white/95' : ''}
            `}
        >
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex items-center justify-between py-4 md:py-5">
                    {/* Filter Pills */}
                    <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
                        {allCategories.map((cat, index) => {
                            const isActive = currentCategory === cat.value;
                            return (
                                <motion.div
                                    key={cat.value || "all"}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                >
                                    <Link
                                        href={cat.value ? `/productos?category=${cat.value}` : "/productos"}
                                        className={`
                                            relative flex items-center gap-2 px-4 py-2.5 rounded-full
                                            text-xs md:text-sm font-semibold tracking-wide uppercase
                                            transition-all duration-300 whitespace-nowrap
                                            ${isActive
                                                ? 'bg-[var(--text-primary)] text-white shadow-lg'
                                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-[var(--text-primary)]'
                                            }
                                        `}
                                    >
                                        {cat.value === "" && <span className="text-[10px]">✦</span>}
                                        {cat.label}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Sort / View Toggle (Decorative for now) */}
                    <div className="hidden md:flex items-center gap-3 border-l border-gray-200 pl-6 ml-6">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Vista de Grilla">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                            </svg>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Vista de Lista">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
