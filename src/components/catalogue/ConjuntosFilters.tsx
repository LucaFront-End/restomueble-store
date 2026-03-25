"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeSlug } from "@/lib/wixCollections";

/* ── Serialized product shape (from server) ── */
export interface ConjuntoProduct {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    price: string;
    inStock: boolean;
    isOnSale: boolean;
}

/* ── Model & type constants ── */
const MODELS = [
    { key: "chabeli", label: "CHABELI" },
    { key: "solera", label: "SOLERA" },
    { key: "panda", label: "PANDA" },
    { key: "italia", label: "ITALIA" },
    { key: "roma", label: "ROMA" },
    { key: "hit", label: "HIT" },
    { key: "tulum", label: "TULUM" },
    { key: "nova", label: "NOVA" },
    { key: "tolix", label: "TOLIX" },
    { key: "tiffany", label: "TIFFANY" },
] as const;

const TYPES = [
    { key: "estandar", label: "Mesa Estándar", keywords: ["estandar", "estándar", "estándar"] },
    { key: "periquero", label: "Periquero", keywords: ["periquero"] },
] as const;

type ModelKey = (typeof MODELS)[number]["key"] | null;
type TypeKey = (typeof TYPES)[number]["key"] | null;

/* ── Helpers ── */
function detectModel(name: string): string | null {
    const lower = name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    for (const m of MODELS) {
        if (lower.includes(m.key)) return m.key;
    }
    return null;
}

function detectType(name: string): string {
    const lower = name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (lower.includes("periquero")) return "periquero";
    return "estandar";
}

/* ── Component ── */
export default function ConjuntosFilters({ products }: { products: ConjuntoProduct[] }) {
    const [activeModel, setActiveModel] = useState<ModelKey>(null);
    const [activeType, setActiveType] = useState<TypeKey>(null);

    // Count products per filter for badges
    const modelCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const m of MODELS) {
            counts[m.key] = products.filter(p => detectModel(p.name) === m.key).length;
        }
        return counts;
    }, [products]);

    const typeCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        for (const t of TYPES) {
            counts[t.key] = products.filter(p => detectType(p.name) === t.key).length;
        }
        return counts;
    }, [products]);

    // Apply filters
    const filtered = useMemo(() => {
        return products.filter(p => {
            if (activeModel && detectModel(p.name) !== activeModel) return false;
            if (activeType && detectType(p.name) !== activeType) return false;
            return true;
        });
    }, [products, activeModel, activeType]);

    return (
        <section className="py-8 md:py-12 px-6 bg-white">
            <div className="container mx-auto max-w-7xl">
                {/* ── Model Subcategory Tabs ── */}
                <div className="mb-8">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setActiveModel(null)}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                                activeModel === null
                                    ? "bg-[var(--brand-navy)] text-white shadow-lg shadow-[var(--brand-navy)]/20"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Todos
                        </button>
                        {MODELS.map((model) => (
                            <button
                                key={model.key}
                                onClick={() => setActiveModel(activeModel === model.key ? null : model.key)}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                                    activeModel === model.key
                                        ? "bg-[var(--brand-navy)] text-white shadow-lg shadow-[var(--brand-navy)]/20"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {model.label}
                                {modelCounts[model.key] > 0 && (
                                    <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] ${
                                        activeModel === model.key
                                            ? "bg-white/20 text-white"
                                            : "bg-gray-200 text-gray-500"
                                    }`}>
                                        {modelCounts[model.key]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Layout: Sidebar + Grid ── */}
                <div className="flex gap-8">
                    {/* Sidebar Filter */}
                    <aside className="hidden md:block w-56 shrink-0">
                        <div className="sticky top-[140px]">
                            <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">
                                Tipo de mesa
                            </h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setActiveType(null)}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                        activeType === null
                                            ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30"
                                            : "bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100"
                                    }`}
                                >
                                    <span className="flex items-center justify-between">
                                        Todos los tipos
                                        <span className="text-xs text-gray-400">{products.length}</span>
                                    </span>
                                </button>
                                {TYPES.map((type) => (
                                    <button
                                        key={type.key}
                                        onClick={() => setActiveType(activeType === type.key ? null : type.key)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                            activeType === type.key
                                                ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30"
                                                : "bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100"
                                        }`}
                                    >
                                        <span className="flex items-center justify-between">
                                            {type.label}
                                            <span className="text-xs text-gray-400">{typeCounts[type.key]}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Active Filters Summary */}
                            {(activeModel || activeType) && (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={() => { setActiveModel(null); setActiveType(null); }}
                                        className="text-xs font-medium text-[var(--accent)] hover:underline uppercase tracking-wider"
                                    >
                                        ✕ Limpiar Filtros
                                    </button>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Mobile Filter Bar (visible on small screens) */}
                    <div className="md:hidden w-full mb-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            <button
                                onClick={() => setActiveType(null)}
                                className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                                    activeType === null
                                        ? "bg-[var(--accent)] text-white"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >
                                Todos
                            </button>
                            {TYPES.map((type) => (
                                <button
                                    key={type.key}
                                    onClick={() => setActiveType(activeType === type.key ? null : type.key)}
                                    className={`shrink-0 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                                        activeType === type.key
                                            ? "bg-[var(--accent)] text-white"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 min-w-0">
                        {/* Result count */}
                        <div className="mb-6 flex justify-between items-center">
                            <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
                                {activeModel ? MODELS.find(m => m.key === activeModel)?.label : "Todos los modelos"}
                                {activeType ? ` · ${TYPES.find(t => t.key === activeType)?.label}` : ""}
                            </span>
                            <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
                                {filtered.length} {filtered.length === 1 ? "Pieza" : "Piezas"}
                            </span>
                        </div>

                        <AnimatePresence mode="wait">
                            {filtered.length > 0 ? (
                                <motion.div
                                    key={`${activeModel}-${activeType}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
                                >
                                    {filtered.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ duration: 0.6, delay: index * 0.05 }}
                                        >
                                            <Link href={`/producto/${normalizeSlug(product.slug)}`} className="group block">
                                                {/* Image Container */}
                                                <div className="relative aspect-square bg-white overflow-hidden mb-4 rounded-sm">
                                                    <Image
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain p-4 transition-all duration-700 ease-out group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                    {product.isOnSale && (
                                                        <div className="absolute top-4 left-4 px-3 py-1 bg-[var(--accent)] text-white text-[10px] font-bold tracking-widest uppercase">
                                                            Oferta
                                                        </div>
                                                    )}

                                                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                                        <div className="w-full bg-white/95 backdrop-blur-sm py-3.5 text-center text-xs font-bold tracking-widest uppercase text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-white transition-colors duration-300 shadow-lg">
                                                            Ver Detalles
                                                            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/0 group-hover:border-white/50 transition-colors duration-500 m-3" />
                                                </div>

                                                {/* Product Info */}
                                                <div className="space-y-1 px-1">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <h3 className="text-sm md:text-base font-medium text-[var(--text-primary)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors duration-300">
                                                            {product.name}
                                                        </h3>
                                                        <span className="text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap">
                                                            {product.price}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-amber-500'}`} />
                                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                                                            {product.inStock ? "Disponible" : "Sobre Pedido"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20 bg-gray-50 rounded-2xl"
                                >
                                    <p className="text-lg text-gray-400 font-light mb-4">
                                        No hay productos con este filtro
                                    </p>
                                    <button
                                        onClick={() => { setActiveModel(null); setActiveType(null); }}
                                        className="text-sm font-bold text-[var(--accent)] hover:underline uppercase tracking-wider"
                                    >
                                        Ver todos los conjuntos
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
