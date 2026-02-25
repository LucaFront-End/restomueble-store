"use client";

import { useState } from "react";
import { useWixClient } from "@/hooks/useWixClient";

interface AddToCartButtonProps {
    productId: string;
}

const AddToCartButton = ({ productId }: AddToCartButtonProps) => {
    const { wixClient, isReady } = useWixClient();
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const handleAddToCart = async () => {
        if (!isReady) return;
        setIsLoading(true);
        try {
            await wixClient.currentCart.addToCurrentCart({
                lineItems: [
                    {
                        catalogReference: {
                            catalogItemId: productId,
                            appId: "1380b703-ce81-ff05-f115-39571d94dfcd", // App ID de Wix Stores
                        },
                        quantity: quantity,
                    },
                ],
            });
            setAdded(true);
            window.dispatchEvent(new Event("cart-updated"));
            setTimeout(() => setAdded(false), 2000);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Error al añadir al carrito. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Cantidad
                </label>
                <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="rounded-md border-gray-300 py-1.5 text-base leading-6 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className={`w-full flex items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white transition-colors ${added
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-black hover:bg-gray-800"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {isLoading ? "Añadiendo..." : added ? "¡Añadido!" : "Añadir al Carrito"}
            </button>
        </div>
    );
};

export default AddToCartButton;
