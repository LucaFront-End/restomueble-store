"use client";

import { useState, useMemo, useEffect } from "react";
import type { ColorCombination } from "@/lib/wixCmsColores";
import { getDistinctValues, findImageForCombination } from "@/lib/wixCmsColores";

interface ColorSelectorProps {
    colorData: ColorCombination[];
    onImageChange: (imageUrl: string) => void;
    /** Emit mapped variant options for Wix pricing (e.g. { "Tamaño": "Mesa de 60x60cm", "Estilo": "Negro" }) */
    onVariantOptionsChange?: (options: Record<string, string>) => void;
}

/**
 * Color/material selector driven by Wix CMS "CMS Colores" data.
 *
 * Cascading selectors:
 *   1. Tipo de Mesa (only shown if data has tipoDeMesa values)
 *   2. Terminado/Medidas (filtered by tipoDeMesa if present)
 *   3. Estilo (filtered by terminado)
 *   4. Color del Vinil (filtered by estilo)
 *
 * When the user selects a combination, the product image updates
 * to match that specific variant photo from the CMS.
 */
export default function ColorSelector({ colorData, onImageChange, onVariantOptionsChange }: ColorSelectorProps) {
    // Don't render if no data
    if (colorData.length === 0) return null;

    return <ColorSelectorInner colorData={colorData} onImageChange={onImageChange} onVariantOptionsChange={onVariantOptionsChange} />;
}

function ColorSelectorInner({ colorData, onImageChange, onVariantOptionsChange }: ColorSelectorProps) {
    // === Level 0: Tipo de Mesa (only for mesas — shown if ANY row has tipoDeMesa) ===
    const allTiposMesa = useMemo(() => getDistinctValues(colorData, "tipoDeMesa"), [colorData]);
    const hasTipoDeMesa = allTiposMesa.length > 0;

    const [selectedTipoDeMesa, setSelectedTipoDeMesa] = useState<string | null>(null);

    // Auto-select first tipo de mesa on load
    useEffect(() => {
        if (hasTipoDeMesa && !selectedTipoDeMesa) {
            setSelectedTipoDeMesa(allTiposMesa[0]);
        }
    }, [allTiposMesa, hasTipoDeMesa, selectedTipoDeMesa]);

    // Filter by tipo de mesa
    const filteredByTipoDeMesa = useMemo(() => {
        if (!hasTipoDeMesa || !selectedTipoDeMesa) return colorData;
        return colorData.filter(item =>
            item.tipoDeMesa.toLowerCase() === selectedTipoDeMesa.toLowerCase()
        );
    }, [colorData, hasTipoDeMesa, selectedTipoDeMesa]);

    // === Level 1: Terminado / Medidas ===
    const allMedidas = useMemo(() => getDistinctValues(filteredByTipoDeMesa, "medidas"), [filteredByTipoDeMesa]);

    const [selectedMedidas, setSelectedMedidas] = useState<string | null>(null);

    // Auto-select first medida when options change
    useEffect(() => {
        if (allMedidas.length > 0) {
            setSelectedMedidas(allMedidas[0]);
        } else {
            setSelectedMedidas(null);
        }
    }, [allMedidas]);

    // === Level 2: Estilo (filtered by selected Medidas) ===
    const filteredByMedidas = useMemo(() => {
        if (!selectedMedidas) return filteredByTipoDeMesa;
        return filteredByTipoDeMesa.filter(item =>
            item.medidas.toLowerCase() === selectedMedidas.toLowerCase()
        );
    }, [filteredByTipoDeMesa, selectedMedidas]);

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

    // === Level 3: Color del Vinil (filtered by Medidas + Estilo) ===
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

    // === Image Update + Variant Mapping ===
    useEffect(() => {
        if (selectedMedidas || selectedEstilo || selectedVinil || selectedTipoDeMesa) {
            const imageUrl = findImageForCombination(
                colorData,
                selectedMedidas,
                selectedEstilo,
                selectedVinil,
                hasTipoDeMesa ? selectedTipoDeMesa : null,
            );
            if (imageUrl) onImageChange(imageUrl);

            // Map CMS Colores selections → Wix variant option names
            // CMS "terminado" maps to Wix "Tamaño"
            // CMS "estilo" maps to Wix "Estilo"
            if (onVariantOptionsChange) {
                const mapped: Record<string, string> = {};
                if (selectedMedidas) mapped["Tamaño"] = selectedMedidas;
                if (selectedEstilo) mapped["Estilo"] = selectedEstilo;
                onVariantOptionsChange(mapped);
            }
        }
    }, [selectedMedidas, selectedEstilo, selectedVinil, selectedTipoDeMesa, colorData, hasTipoDeMesa, onImageChange, onVariantOptionsChange]);

    return (
        <div className="space-y-5 pt-2 pb-2">
            {/* Section header */}
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
                    Personalización visual
                </span>
                <span className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Tipo de Mesa selector (only for mesa products) */}
            {hasTipoDeMesa && (
                <SelectorRow
                    label="Tipo de Mesa"
                    options={allTiposMesa}
                    selected={selectedTipoDeMesa}
                    onSelect={setSelectedTipoDeMesa}
                />
            )}

            {/* Terminado / Medidas selector */}
            {allMedidas.length > 0 && (
                <SelectorRow
                    label="Terminado"
                    options={allMedidas}
                    selected={selectedMedidas}
                    onSelect={setSelectedMedidas}
                />
            )}

            {/* Estilo selector */}
            {estilos.length > 0 && (
                <SelectorRow
                    label="Estilo"
                    options={estilos}
                    selected={selectedEstilo}
                    onSelect={setSelectedEstilo}
                />
            )}

            {/* Color del Vinil selector */}
            {vinilos.length > 0 && (
                <SelectorRow
                    label="Color de asientos"
                    options={vinilos}
                    selected={selectedVinil}
                    onSelect={setSelectedVinil}
                />
            )}

            <div className="border-t border-gray-100" />
        </div>
    );
}

// ─── Reusable Selector Row ─────────────────────────────────────────────────────

function SelectorRow({
    label,
    options,
    selected,
    onSelect,
}: {
    label: string;
    options: string[];
    selected: string | null;
    onSelect: (value: string) => void;
}) {
    return (
        <div>
            <div className="flex items-baseline gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                    {label}:
                </span>
                <span className="text-[11px] text-gray-900 font-medium">
                    — {selected || "Seleccioná"}
                </span>
            </div>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => {
                    const isSelected = selected === opt;
                    return (
                        <button
                            key={opt}
                            onClick={() => onSelect(opt)}
                            className={`
                                px-5 py-2.5 text-xs font-semibold tracking-wide
                                border transition-all duration-200
                                ${isSelected
                                    ? "border-gray-900 bg-gray-900 text-white"
                                    : "border-gray-200 text-gray-600 bg-white hover:border-gray-900 hover:text-gray-900"
                                }
                            `}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
