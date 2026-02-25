"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Zonas de envío representativas para México.
 * Basadas en rango de CPs de 5 dígitos.
 * 
 * TODO: Conectar con Wix Shipping Rates SPI cuando esté habilitado en el panel Wix:
 *   Wix eCom > Shipping & Delivery > definir tarifas por zona.
 *   La API oficial es el Shipping Rates SPI (serverless) — no expone un endpoint REST público.
 */

interface Zona {
    label: string;
    transportista: string;
    precio: number;
    dias: string;
    check: (cp: number) => boolean;
}

const ZONAS: Zona[] = [
    {
        label: "Ciudad de México",
        transportista: "Estafeta / DHL",
        precio: 0,
        dias: "1-2 días hábiles",
        check: (cp) => cp >= 1000 && cp <= 16999,
    },
    {
        label: "Área Metropolitana",
        transportista: "Estafeta / DHL",
        precio: 149,
        dias: "2-3 días hábiles",
        // Edo. Méx. más cercano a CDMX
        check: (cp) =>
            (cp >= 50000 && cp <= 57999) ||
            (cp >= 52000 && cp <= 54000) ||
            (cp >= 40000 && cp <= 43999),
    },
    {
        label: "Principales Ciudades",
        transportista: "Estafeta / FedEx",
        precio: 299,
        dias: "3-5 días hábiles",
        // Guadalajara, Monterrey, Puebla, Querétaro, etc.
        check: (cp) =>
            (cp >= 44000 && cp <= 49999) || // Jalisco
            (cp >= 64000 && cp <= 67999) || // Nuevo León
            (cp >= 72000 && cp <= 75999) || // Puebla
            (cp >= 76000 && cp <= 76999),   // Querétaro
    },
    {
        label: "Interior de la República",
        transportista: "Estafeta",
        precio: 450,
        dias: "5-8 días hábiles",
        check: (_cp) => true, // fallback
    },
];

function getZona(cp: string): Zona | null {
    const clean = cp.trim().replace(/\D/g, "");
    if (clean.length !== 5) return null;
    const num = parseInt(clean, 10);
    return ZONAS.find((z) => z.check(num)) || null;
}

export default function ShippingCalculator() {
    const [cp, setCp] = useState("");
    const [result, setResult] = useState<Zona | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);

    const handleCheck = () => {
        setError(null);
        setResult(null);
        setChecked(false);

        if (cp.trim().replace(/\D/g, "").length !== 5) {
            setError("Ingresa un código postal válido de 5 dígitos (ej: 06600, 44100)");
            return;
        }

        const zona = getZona(cp);
        setResult(zona);
        setChecked(true);
    };

    return (
        <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                Calcular envío
            </p>

            <div className="flex gap-2">
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Código postal (5 dígitos)"
                    value={cp}
                    onChange={(e) => setCp(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                    maxLength={5}
                    className="flex-grow text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[var(--brand-navy)] transition-colors bg-[#fafafa] placeholder:text-gray-400"
                />
                <button
                    onClick={handleCheck}
                    disabled={cp.length !== 5}
                    className="px-4 py-2.5 rounded-xl bg-[var(--brand-navy)] text-white text-xs font-bold tracking-wider hover:bg-[var(--accent)] transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Calcular
                </button>
            </div>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.p
                        key="error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 text-xs text-red-500"
                    >
                        {error}
                    </motion.p>
                )}

                {checked && result && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 px-4 py-3 rounded-xl bg-[var(--brand-navy)]/5 border border-[var(--brand-navy)]/10"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-[var(--text-primary)]">
                                    {result.label}
                                </p>
                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                    {result.transportista} · {result.dias}
                                </p>
                            </div>
                            <p className="text-sm font-bold text-[var(--brand-navy)] shrink-0">
                                {result.precio === 0 ? (
                                    <span className="text-green-600">Gratis</span>
                                ) : (
                                    `$${result.precio.toLocaleString("es-MX")} MXN`
                                )}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <p className="mt-2 text-[10px] text-[var(--text-secondary)] leading-relaxed">
                * Costos estimados. El costo final se confirma al momento de la compra.
            </p>
        </div>
    );
}
