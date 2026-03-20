"use client";

import { useState, useMemo } from "react";
import type { ColorCombination } from "@/lib/wixCmsColores";
import { getDistinctValues, findImageForCombination } from "@/lib/wixCmsColores";

interface ColorSelectorProps {
    colorData: ColorCombination[];
    onImageChange: (imageUrl: string) => void;
}

/**
 * Color/material selector driven by Wix CMS "CMS Colores" data.
 *
 * Shows selectors for Fórmica and Color del Vinil.
 * These ONLY change the product image — they do NOT affect the price.
 * Renders nothing if there's no color data for this product.
 */
export default function ColorSelector({ colorData, onImageChange }: ColorSelectorProps) {
    const formicas = useMemo(() => getDistinctValues(colorData, "formica"), [colorData]);
    const vinilos = useMemo(() => getDistinctValues(colorData, "colorVinil"), [colorData]);

    const [selectedFormica, setSelectedFormica] = useState<string | null>(
        formicas.length > 0 ? formicas[0] : null
    );
    const [selectedVinil, setSelectedVinil] = useState<string | null>(
        vinilos.length > 0 ? vinilos[0] : null
    );

    // Don't render anything if there's no color data
    if (colorData.length === 0) return null;
    if (formicas.length === 0 && vinilos.length === 0) return null;

    const handleFormicaChange = (value: string) => {
        setSelectedFormica(value);
        const imageUrl = findImageForCombination(colorData, value, selectedVinil);
        if (imageUrl) onImageChange(imageUrl);
    };

    const handleVinilChange = (value: string) => {
        setSelectedVinil(value);
        const imageUrl = findImageForCombination(colorData, selectedFormica, value);
        if (imageUrl) onImageChange(imageUrl);
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
