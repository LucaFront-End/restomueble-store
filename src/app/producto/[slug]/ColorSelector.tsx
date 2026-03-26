"use client";

import { useState, useMemo, useEffect } from "react";
import type { ColorCombination } from "@/lib/wixCmsColores";
import { getDistinctValues, findImageForCombination } from "@/lib/wixCmsColores";

interface ColorSelectorProps {
    colorData: ColorCombination[];
    onImageChange: (imageUrl: string) => void;
}

/**
 * Color/material selector driven by Wix CMS "CMS Colores" data.
 *
 * Shows cascading selectors: Medidas → Estilo → Color del Vinil → Image
 *
 * When the user selects a combination, the product image updates
 * to match that specific variant photo from the CMS.
 */
export default function ColorSelector({ colorData, onImageChange }: ColorSelectorProps) {
    // === Step 1: Medidas (e.g. "Mesa de 60x60cm", "Sin terminado adicional") ===
    const allMedidas = useMemo(() => getDistinctValues(colorData, "medidas"), [colorData]);

    const [selectedMedidas, setSelectedMedidas] = useState<string | null>(null);

    // Auto-select first medida on load
    useEffect(() => {
        if (allMedidas.length > 0 && !selectedMedidas) {
            setSelectedMedidas(allMedidas[0]);
        }
    }, [allMedidas, selectedMedidas]);

    // === Step 2: Estilo (filtered by selected Medidas) ===
    const filteredByMedidas = useMemo(() => {
        if (!selectedMedidas) return colorData;
        return colorData.filter(item =>
            item.medidas.toLowerCase() === selectedMedidas.toLowerCase()
        );
    }, [colorData, selectedMedidas]);

    const estilos = useMemo(() => getDistinctValues(filteredByMedidas, "estilo"), [filteredByMedidas]);

    const [selectedEstilo, setSelectedEstilo] = useState<string | null>(null);

    // Auto-select first estilo when options change
    useEffect(() => {
        if (estilos.length > 0) {
            setSelectedEstilo(estilos[0]);
        } else {
            setSelectedEstilo(null);
        }
    }, [estilos]);

    // === Step 3: Color del Vinil (filtered by Medidas + Estilo) ===
    const filteredByEstilo = useMemo(() => {
        if (!selectedEstilo) return filteredByMedidas;
        return filteredByMedidas.filter(item =>
            item.estilo.toLowerCase() === selectedEstilo.toLowerCase()
        );
    }, [filteredByMedidas, selectedEstilo]);

    const vinilos = useMemo(() => getDistinctValues(filteredByEstilo, "colorVinil"), [filteredByEstilo]);

    const [selectedVinil, setSelectedVinil] = useState<string | null>(null);

    // Auto-select first vinil when options change
    useEffect(() => {
        if (vinilos.length > 0) {
            setSelectedVinil(vinilos[0]);
        } else {
            setSelectedVinil(null);
        }
    }, [vinilos]);

    // === Image Update: find matching image for current combination ===
    useEffect(() => {
        if (selectedMedidas || selectedEstilo || selectedVinil) {
            const imageUrl = findImageForCombination(colorData, selectedMedidas, selectedEstilo, selectedVinil);
            if (imageUrl) onImageChange(imageUrl);
        }
    }, [selectedMedidas, selectedEstilo, selectedVinil, colorData, onImageChange]);

    // Don't render if no data
    if (colorData.length === 0) return null;

    return (
        <div className="space-y-5 pt-2 pb-2">
            {/* Section header */}
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
                    Personalización visual
                </span>
                <span className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Medidas selector */}
            {allMedidas.length > 0 && (
                <div>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                            Medidas:
                        </span>
                        <span className="text-[11px] text-gray-900 font-medium">
                            — {selectedMedidas || "Seleccioná"}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {allMedidas.map((m) => {
                            const isSelected = selectedMedidas === m;
                            return (
                                <button
                                    key={m}
                                    onClick={() => setSelectedMedidas(m)}
                                    className={`
                                        px-5 py-2.5 text-xs font-semibold tracking-wide
                                        border transition-all duration-200
                                        ${isSelected
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-gray-200 text-gray-600 bg-white hover:border-gray-900 hover:text-gray-900"
                                        }
                                    `}
                                >
                                    {m}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Estilo selector */}
            {estilos.length > 0 && (
                <div>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                            Estilo:
                        </span>
                        <span className="text-[11px] text-gray-900 font-medium">
                            — {selectedEstilo || "Seleccioná"}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {estilos.map((e) => {
                            const isSelected = selectedEstilo === e;
                            return (
                                <button
                                    key={e}
                                    onClick={() => setSelectedEstilo(e)}
                                    className={`
                                        px-5 py-2.5 text-xs font-semibold tracking-wide
                                        border transition-all duration-200
                                        ${isSelected
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-gray-200 text-gray-600 bg-white hover:border-gray-900 hover:text-gray-900"
                                        }
                                    `}
                                >
                                    {e}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Color del Vinil selector */}
            {vinilos.length > 0 && (
                <div>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                            Color de asientos:
                        </span>
                        <span className="text-[11px] text-gray-900 font-medium">
                            — {selectedVinil || "Seleccioná"}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {vinilos.map((v) => {
                            const isSelected = selectedVinil === v;
                            return (
                                <button
                                    key={v}
                                    onClick={() => setSelectedVinil(v)}
                                    className={`
                                        px-5 py-2.5 text-xs font-semibold tracking-wide
                                        border transition-all duration-200
                                        ${isSelected
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-gray-200 text-gray-600 bg-white hover:border-gray-900 hover:text-gray-900"
                                        }
                                    `}
                                >
                                    {v}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="border-t border-gray-100" />
        </div>
    );
}
