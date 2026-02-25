"use client";

import { useState, useMemo } from "react";
import { useWixClient } from "@/hooks/useWixClient";
import { motion } from "framer-motion";
import type { products } from "@wix/stores";

// Normalized types — strict, safe to use as indices
interface NormalizedChoice {
    value: string;
}
interface NormalizedOption {
    name: string;
    choices: NormalizedChoice[];
}
interface NormalizedVariant {
    id: string;
    choices: Record<string, string>;
    inStock: boolean;
}

/** Convert Wix SDK (all-optional) types to normalized strict types */
function normalizeOptions(raw: products.ProductOption[]): NormalizedOption[] {
    return raw
        .filter(o => o.name)
        .map(o => ({
            name: o.name!,
            choices: (o.choices || [])
                .filter(c => c.value)
                .map(c => ({ value: c.value! })),
        }))
        .filter(o => o.choices.length > 0);
}

function normalizeVariants(raw: products.Variant[]): NormalizedVariant[] {
    return raw
        .filter(v => v._id && v.choices)
        .map(v => ({
            id: v._id!,
            choices: (v.choices as Record<string, string>) ?? {},
            inStock: v.stock?.inStock !== false,
        }));
}

interface AddToCartProps {
    productId: string;
    productName: string;
    productOptions?: products.ProductOption[];
    variants?: products.Variant[];
}

export default function AddToCart({
    productId,
    productOptions = [],
    variants = [],
}: AddToCartProps) {
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { wixClient, isReady } = useWixClient();

    const normalizedOptions = useMemo(() => normalizeOptions(productOptions), [productOptions]);
    const normalizedVariants = useMemo(() => normalizeVariants(variants), [variants]);

    const hasOptions = normalizedOptions.length > 0;

    // Track selected option values: { "Color": "Rojo", "Tela": "Cuero" }
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
        const defaults: Record<string, string> = {};
        normalizeOptions(productOptions).forEach(opt => {
            if (opt.choices.length > 0) {
                defaults[opt.name] = opt.choices[0].value;
            }
        });
        return defaults;
    });

    const allOptionsSelected = hasOptions
        ? normalizedOptions.every(opt => !!selectedOptions[opt.name])
        : true;

    // Find the variant that matches current selections
    const matchedVariant = useMemo<NormalizedVariant | null>(() => {
        if (!hasOptions || normalizedVariants.length === 0) return null;
        return normalizedVariants.find(v =>
            normalizedOptions.every(opt => v.choices[opt.name] === selectedOptions[opt.name])
        ) ?? null;
    }, [selectedOptions, normalizedVariants, normalizedOptions, hasOptions]);

    const variantInStock = hasOptions
        ? (matchedVariant ? matchedVariant.inStock : true)
        : true;

    const handleAddToCart = async () => {
        if (!isReady || !allOptionsSelected || !variantInStock) return;

        setIsLoading(true);
        setError(null);

        try {
            // Build options for the cart line item
            const catalogOptions: Record<string, unknown> = {};
            if (hasOptions && matchedVariant) {
                catalogOptions.variantId = matchedVariant.id;
            } else if (hasOptions) {
                catalogOptions.options = { ...selectedOptions };
            }

            const cartResponse = await wixClient.currentCart.addToCurrentCart({
                lineItems: [
                    {
                        catalogReference: {
                            catalogItemId: productId,
                            appId: "1380b703-ce81-ff05-f115-39571d94dfcd",
                            ...(Object.keys(catalogOptions).length > 0 && { options: catalogOptions }),
                        },
                        quantity,
                    },
                ],
            });

            console.log("[AddToCart] ✅ Cart:", {
                cartId: cartResponse.cart?._id,
                items: cartResponse.cart?.lineItems?.length,
            });

            setIsSuccess(true);
            window.dispatchEvent(new Event("cart-updated"));
            setTimeout(() => setIsSuccess(false), 3000);

        } catch (err: any) {
            const msg =
                err?.details?.applicationError?.description ??
                err?.message ??
                "Error desconocido";
            console.error("[AddToCart] ❌ Error:", err);
            setError(`Error: ${msg}`);
            setTimeout(() => setError(null), 8000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Option Selectors — shown above quantity when product has variants */}
            {normalizedOptions.length > 0 && (
                <div className="space-y-5 pb-2">
                    {normalizedOptions.map(option => (
                        <div key={option.name}>
                            {/* Label row */}
                            <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
                                    {option.name}
                                </span>
                                <span className="text-[11px] text-gray-900 font-medium">
                                    — {selectedOptions[option.name] || "Seleccioná"}
                                </span>
                            </div>

                            {/* Choice buttons */}
                            <div className="flex flex-wrap gap-2">
                                {option.choices.map(choice => {
                                    const isSelected = selectedOptions[option.name] === choice.value;
                                    const testSelections = { ...selectedOptions, [option.name]: choice.value };
                                    const hasStock = normalizedVariants.length === 0 || normalizedVariants.some(v =>
                                        normalizedOptions.every(o =>
                                            !testSelections[o.name] || v.choices[o.name] === testSelections[o.name]
                                        ) && v.inStock
                                    );

                                    return (
                                        <button
                                            key={choice.value}
                                            onClick={() => setSelectedOptions(prev => ({
                                                ...prev,
                                                [option.name]: choice.value,
                                            }))}
                                            disabled={!hasStock}
                                            className={`
                                                relative px-5 py-2.5 text-xs font-semibold tracking-wide
                                                border transition-all duration-200
                                                ${isSelected
                                                    ? "border-gray-900 bg-gray-900 text-white"
                                                    : hasStock
                                                        ? "border-gray-200 text-gray-600 bg-white hover:border-gray-900 hover:text-gray-900"
                                                        : "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"
                                                }
                                            `}
                                        >
                                            {choice.value}
                                            {!hasStock && (
                                                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <span className="w-full h-px bg-gray-300 absolute rotate-[-12deg]" />
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    <div className="border-t border-gray-100" />
                </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-900">Cantidad:</span>
                <div className="flex items-center border border-gray-200 rounded-sm">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                        disabled={quantity <= 1}
                    >
                        −
                    </button>
                    <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Add to Cart Button */}
            <button
                onClick={handleAddToCart}
                disabled={isLoading || isSuccess || !isReady || !allOptionsSelected || !variantInStock}
                className={`
                    relative w-full py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 overflow-hidden
                    ${isSuccess
                        ? "bg-green-600 text-white cursor-default"
                        : "bg-gray-900 text-white hover:bg-black"
                    }
                    disabled:opacity-80
                `}
            >
                <div className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                        <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>AGREGANDO...</span>
                        </>
                    ) : isSuccess ? (
                        <>
                            <motion.svg
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="3"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </motion.svg>
                            <span>AGREGADO AL CARRITO</span>
                        </>
                    ) : !variantInStock ? (
                        <span>SIN STOCK</span>
                    ) : (
                        <span>AGREGAR AL CARRITO</span>
                    )}
                </div>

                {isSuccess && (
                    <motion.div
                        className="absolute inset-0 bg-green-600 z-0"
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 0.3 }}
                    />
                )}
            </button>
        </div>
    );
}
