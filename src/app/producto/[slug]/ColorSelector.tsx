"use client";

import { useState, useMemo, useEffect } from "react";
import type { ColorCombination } from "@/lib/wixCmsColores";
import { getDistinctValues, findImageForCombination } from "@/lib/wixCmsColores";

interface ColorSelectorProps {
    colorData: ColorCombination[];
    /** Currently selected variant options from AddToCart (e.g. {"Estilo:": "Pintura", "Terminados:": "Terminado rústico"}) */
    variantSelections?: Record<string, string>;
    onImageChange: (imageUrl: string) => void;
}

/**
 * Normalize a variant option name for fuzzy matching.
 * Wix options have trailing colons: "Terminados:" → "terminados"
 */
function normalizeKey(key: string): string {
    return key.replace(/:$/, "").trim().toLowerCase();
}

/**
 * Check if a CMS terminado value matches the selected variant terminado.
 * E.g. CMS has "Terminado rústico brillante", variant has "Terminado rústico brillante"
 * Uses case-insensitive comparison.
 */
function matchesTerminado(cmsValue: string, variantValue: string): boolean {
    if (!cmsValue || !variantValue) return true; // No filter if either is empty
    return cmsValue.toLowerCase().trim() === variantValue.toLowerCase().trim();
}

/**
 * Color/material selector driven by Wix CMS "CMS Colores" data.
 *
 * Shows selectors for Fórmica and Color del Vinil, filtered by the
 * currently selected variant options (Estilo, Terminado).
 *
 * Chain: Estilo → Terminado → Fórmica → Vinil → Image
 */
export default function ColorSelector({ colorData, variantSelections = {}, onImageChange }: ColorSelectorProps) {
    // Find relevant variant selections by normalizing keys
    const selectedTerminado = useMemo(() => {
        for (const [key, value] of Object.entries(variantSelections)) {
            if (normalizeKey(key).includes("terminado")) return value;
        }
        return null;
    }, [variantSelections]);

    // Filter CMS data based on the selected terminado
    const filteredData = useMemo(() => {
        if (!selectedTerminado) return colorData;
        return colorData.filter(item =>
            matchesTerminado(item.terminado, selectedTerminado)
        );
    }, [colorData, selectedTerminado]);

    const formicas = useMemo(() => getDistinctValues(filteredData, "formica"), [filteredData]);
    const vinilos = useMemo(() => getDistinctValues(filteredData, "colorVinil"), [filteredData]);

    const [selectedFormica, setSelectedFormica] = useState<string | null>(null);
    const [selectedVinil, setSelectedVinil] = useState<string | null>(null);

    // Reset selections when filtered options change (e.g. user changed Terminado)
    useEffect(() => {
        setSelectedFormica(formicas.length > 0 ? formicas[0] : null);
        setSelectedVinil(vinilos.length > 0 ? vinilos[0] : null);
    }, [formicas, vinilos]);

    // When selections change, find and emit the matching image
    useEffect(() => {
        if (selectedFormica || selectedVinil) {
            const imageUrl = findImageForCombination(filteredData, selectedFormica, selectedVinil);
            if (imageUrl) onImageChange(imageUrl);
        }
    }, [selectedFormica, selectedVinil, filteredData, onImageChange]);

    // Don't render anything if there's no color data after filtering
    if (filteredData.length === 0) return null;
    if (formicas.length === 0 && vinilos.length === 0) return null;

    const handleFormicaChange = (value: string) => {
        setSelectedFormica(value);
    };

    const handleVinilChange = (value: string) => {
        setSelectedVinil(value);
    };

    return (
        <div className="space-y-5 pt-2 pb-2">
            {/* Section header */}
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
                    Personalización visual
                </span>
                <span className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Fórmica selector */}
            {formicas.length > 0 && (
                <div>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                            Fórmica:
                        </span>
                        <span className="text-[11px] text-gray-900 font-medium">
                            — {selectedFormica || "Seleccioná"}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formicas.map((formica) => {
                            const isSelected = selectedFormica === formica;
                            return (
                                <button
                                    key={formica}
                                    onClick={() => handleFormicaChange(formica)}
                                    className={`
                                        px-5 py-2.5 text-xs font-semibold tracking-wide
                                        border transition-all duration-200
                                        ${isSelected
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-gray-200 text-gray-600 bg-white hover:border-gray-900 hover:text-gray-900"
                                        }
                                    `}
                                >
                                    {formica}
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
                            Color del Vinil:
                        </span>
                        <span className="text-[11px] text-gray-900 font-medium">
                            — {selectedVinil || "Seleccioná"}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {vinilos.map((vinil) => {
                            const isSelected = selectedVinil === vinil;
                            return (
                                <button
                                    key={vinil}
                                    onClick={() => handleVinilChange(vinil)}
                                    className={`
                                        px-5 py-2.5 text-xs font-semibold tracking-wide
                                        border transition-all duration-200
                                        ${isSelected
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-gray-200 text-gray-600 bg-white hover:border-gray-900 hover:text-gray-900"
                                        }
                                    `}
                                >
                                    {vinil}
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
