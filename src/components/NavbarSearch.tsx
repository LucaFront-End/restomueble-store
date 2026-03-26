"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useWixClient } from "@/hooks/useWixClient";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
    _id: string;
    name: string;
    slug: string;
    imageUrl: string;
    price: string;
}

/** Max results shown in the dropdown */
const MAX_VISIBLE = 4;

export default function NavbarSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [totalMatches, setTotalMatches] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const { wixClient, isReady } = useWixClient();
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 200);
        }
        // Lock body scroll when open
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Cache all products so searches are instant after first load
    const allProductsRef = useRef<any[]>([]);
    const loadingProductsRef = useRef(false);

    /** Strip accents/diacritics and lowercase for Spanish-friendly matching */
    const normalize = (s: string) =>
        s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

    const loadAllProducts = useCallback(async () => {
        if (allProductsRef.current.length > 0 || loadingProductsRef.current || !isReady) return;
        loadingProductsRef.current = true;
        try {
            let allItems: any[] = [];
            let skip = 0;
            const pageSize = 100;
            while (true) {
                const res = await wixClient.products
                    .queryProducts()
                    .limit(pageSize)
                    .skip(skip)
                    .find();
                allItems = allItems.concat(res.items);
                if (res.items.length < pageSize) break;
                skip += pageSize;
            }
            allProductsRef.current = allItems;
        } catch (err) {
            console.error("[Search] Error loading products:", err);
        }
        loadingProductsRef.current = false;
    }, [wixClient, isReady]);

    // Preload products when modal opens
    useEffect(() => {
        if (isOpen && isReady) loadAllProducts();
    }, [isOpen, isReady, loadAllProducts]);

    const searchProducts = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setResults([]);
            setTotalMatches(0);
            return;
        }

        setIsSearching(true);
        try {
            if (allProductsRef.current.length === 0) {
                await loadAllProducts();
            }

            const queryWords = normalize(searchQuery).split(/\s+/).filter(w => w.length > 0);

            const scored = allProductsRef.current.map(p => {
                const nameNorm = normalize(p.name || "");
                const slugNorm = normalize(p.slug || "");
                const rawDesc = (p.description || "").replace(/<[^>]*>/g, "");
                const descNorm = normalize(rawDesc);
                const searchable = `${nameNorm} ${slugNorm} ${descNorm}`;

                const allMatch = queryWords.every(word => searchable.includes(word));
                if (!allMatch) return { p, score: 0 };

                let score = 0;
                for (const word of queryWords) {
                    if (nameNorm.includes(word)) score += 10;
                    if (slugNorm.includes(word)) score += 5;
                    if (descNorm.includes(word)) score += 2;
                }
                if (nameNorm.includes(normalize(searchQuery))) score += 20;

                return { p, score };
            });

            const filtered = scored
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score);

            setTotalMatches(filtered.length);

            setResults(filtered.slice(0, MAX_VISIBLE).map(({ p }) => ({
                _id: p._id || "",
                name: p.name || "Producto",
                slug: p.slug || "",
                imageUrl: p.media?.mainMedia?.image?.url || "/placeholder-product.png",
                price: p.priceData?.formatted?.price || "Consultar",
            })));
        } catch (err) {
            console.error("[Search] Error:", err);
            setResults([]);
            setTotalMatches(0);
        } finally {
            setIsSearching(false);
        }
    }, [loadAllProducts]);

    const handleInputChange = (value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => searchProducts(value), 150);
    };

    return (
        <>
            {/* Search Icon Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative group p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Buscar productos"
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </button>

            {/* Search Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Centered Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed inset-0 z-[70] flex items-start justify-center pt-[10vh] md:pt-[12vh] px-4"
                        >
                            <div
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Search Input */}
                                <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
                                    <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.3-4.3" />
                                    </svg>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        placeholder="Buscar productos..."
                                        className="flex-1 text-lg font-light text-gray-900 placeholder-gray-300 bg-transparent outline-none border-none"
                                    />
                                    {query && (
                                        <button
                                            onClick={() => { setQuery(""); setResults([]); setTotalMatches(0); }}
                                            className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 bg-gray-100 rounded-md transition-colors"
                                        >
                                            Limpiar
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Results Body */}
                                <div className="px-6 py-5">
                                    {isSearching && (
                                        <div className="flex items-center justify-center py-10">
                                            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                                        </div>
                                    )}

                                    {!isSearching && query.length >= 2 && results.length === 0 && (
                                        <div className="text-center py-10">
                                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                    <circle cx="11" cy="11" r="8" />
                                                    <path d="m21 21-4.3-4.3" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-400 text-base">Sin resultados para &quot;{query}&quot;</p>
                                            <p className="text-gray-300 text-sm mt-1">Intentá con otro término</p>
                                        </div>
                                    )}

                                    {!isSearching && results.length > 0 && (
                                        <>
                                            {/* Results count */}
                                            <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-4">
                                                {totalMatches} resultado{totalMatches !== 1 ? "s" : ""}
                                            </p>

                                            {/* Product List — compact rows */}
                                            <div className="space-y-1">
                                                {results.map((product) => (
                                                    <Link
                                                        key={product._id}
                                                        href={`/producto/${product.slug}`}
                                                        onClick={() => setIsOpen(false)}
                                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                                    >
                                                        <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                                                            <Image
                                                                src={product.imageUrl}
                                                                alt={product.name}
                                                                fill
                                                                className="object-contain p-1.5 group-hover:scale-110 transition-transform duration-300"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-900 group-hover:text-[var(--accent)] transition-colors truncate">
                                                                {product.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-400 mt-0.5">{product.price}</p>
                                                        </div>
                                                        <svg className="w-4 h-4 text-gray-300 group-hover:text-[var(--accent)] shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* "Ver más" button */}
                                            {totalMatches > MAX_VISIBLE && (
                                                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                                                    <Link
                                                        href={`/tienda?q=${encodeURIComponent(query)}`}
                                                        onClick={() => setIsOpen(false)}
                                                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-navy)] hover:text-[var(--accent)] transition-colors"
                                                    >
                                                        Ver todos los resultados ({totalMatches})
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {!isSearching && query.length < 2 && (
                                        <div className="text-center py-8">
                                            <p className="text-gray-300 text-sm">Escribí al menos 2 caracteres</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
