"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useWixClient } from "@/hooks/useWixClient";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeSlug } from "@/lib/wixCollections";

interface SearchResult {
    _id: string;
    name: string;
    slug: string;
    imageUrl: string;
    price: string;
}

export default function NavbarSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const { wixClient, isReady } = useWixClient();
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 200);
        }
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

    const loadAllProducts = useCallback(async () => {
        if (allProductsRef.current.length > 0 || loadingProductsRef.current || !isReady) return;
        loadingProductsRef.current = true;
        try {
            // Paginate through all products
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

    // Preload products when search panel opens
    useEffect(() => {
        if (isOpen && isReady) loadAllProducts();
    }, [isOpen, isReady, loadAllProducts]);

    const searchProducts = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setResults([]);
            return;
        }

        setIsSearching(true);
        try {
            // Wait for products to load if not yet ready
            if (allProductsRef.current.length === 0) {
                await loadAllProducts();
            }

            const lowerQuery = searchQuery.toLowerCase();
            const filtered = allProductsRef.current.filter(p =>
                p.name?.toLowerCase().includes(lowerQuery) ||
                p.slug?.toLowerCase().includes(lowerQuery)
            );

            setResults(filtered.slice(0, 8).map(p => ({
                _id: p._id || "",
                name: p.name || "Producto",
                slug: normalizeSlug(p.slug || ""),
                imageUrl: p.media?.mainMedia?.image?.url || "/placeholder-product.png",
                price: p.priceData?.formatted?.price || "Consultar",
            })));
        } catch (err) {
            console.error("[Search] Error:", err);
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [loadAllProducts]);

    const handleInputChange = (value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => searchProducts(value), 300);
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

            {/* Search Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Search Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed top-[80px] left-0 right-0 z-[70] bg-white shadow-2xl rounded-b-2xl"
                        >
                            <div className="container mx-auto max-w-3xl px-6 py-8">
                                {/* Search Input */}
                                <div className="flex items-center gap-4 mb-6">
                                    <svg className="w-6 h-6 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.3-4.3" />
                                    </svg>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        placeholder="Buscar productos..."
                                        className="flex-1 text-2xl font-light text-gray-900 placeholder-gray-300 bg-transparent outline-none border-none"
                                    />
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="border-t border-gray-100" />

                                {/* Results */}
                                <div className="mt-6 max-h-[60vh] overflow-y-auto">
                                    {isSearching && (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                                        </div>
                                    )}

                                    {!isSearching && query.length >= 2 && results.length === 0 && (
                                        <div className="text-center py-12">
                                            <p className="text-gray-400 text-lg">No se encontraron productos para &quot;{query}&quot;</p>
                                            <p className="text-gray-300 text-sm mt-2">Probá con otro término de búsqueda</p>
                                        </div>
                                    )}

                                    {!isSearching && results.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {results.map((product) => (
                                                <Link
                                                    key={product._id}
                                                    href={`/producto/${product.slug}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="group"
                                                >
                                                    <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
                                                        <Image
                                                            src={product.imageUrl}
                                                            alt={product.name}
                                                            fill
                                                            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">{product.price}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {!isSearching && query.length < 2 && (
                                        <div className="text-center py-12">
                                            <p className="text-gray-300 text-lg">Escribí al menos 2 caracteres para buscar</p>
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
