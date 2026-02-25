"use client";

import { useEffect, useState, useCallback } from "react";
import { useWixClient } from "@/hooks/useWixClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { cart } from "@wix/ecom";
import { getWixImageUrl } from "@/lib/wixImageUrl";

export default function CartPage() {
    const { wixClient, isReady } = useWixClient();
    const [cartData, setCartData] = useState<cart.Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!isReady) return;
        try {
            const currentCart = await wixClient.currentCart.getCurrentCart();
            console.log("[Cart Page] getCurrentCart response:", JSON.stringify({
                cartId: currentCart?._id,
                lineItems: currentCart?.lineItems?.map(i => ({
                    id: i._id,
                    name: i.productName?.original,
                    qty: i.quantity,
                })),
            }, null, 2));
            setCartData(currentCart);
        } catch (error: any) {
            console.error("[Cart Page] Error fetching cart:", error?.message ?? error);
            // If the cart simply doesn't exist yet, treat it as empty
            if (error?.details?.applicationError?.code === "OWNED_CART_NOT_FOUND" ||
                error?.message?.includes("not found")) {
                setCartData(null);
            } else {
                setCartData(null);
            }
        } finally {
            setIsLoading(false);
        }
    }, [wixClient, isReady]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleRemoveItem = async (lineItemId: string) => {
        try {
            await wixClient.currentCart.removeLineItemsFromCurrentCart([lineItemId]);
            fetchCart();
            window.dispatchEvent(new Event("cart-updated")); // sync Navbar counter
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        try {
            const checkout = await wixClient.currentCart.createCheckoutFromCurrentCart({
                channelType: cart.ChannelType.WEB,
            });

            const { redirectSession } = await wixClient.redirects.createRedirectSession({
                ecomCheckout: { checkoutId: checkout.checkoutId },
                callbacks: {
                    postFlowUrl: window.location.origin + "/gracias",
                    thankYouPageUrl: window.location.origin + "/gracias",
                },
            });

            if (redirectSession?.fullUrl) {
                window.location.href = redirectSession.fullUrl;
            }
        } catch (error) {
            console.error("Error creating checkout:", error);
            alert("Error al procesar. Intenta de nuevo.");
            setIsCheckingOut(false);
        }
    };

    if (isLoading) {
        return (
            <main className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-xl text-gray-500">Cargando carrito...</p>
                </div>
                <Footer />
            </main>
        );
    }

    const lineItems = cartData?.lineItems || [];
    const isEmpty = lineItems.length === 0;

    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-10">Tu Carrito</h1>

                {isEmpty ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-400 mb-6">Tu carrito está vacío.</p>
                        <Link
                            href="/tienda"
                            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Explorar Productos
                        </Link>
                    </div>
                ) : (
                    <>
                        <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                            {lineItems.map((item) => (
                                <li key={item._id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                                        {getWixImageUrl(item.image) ? (
                                            <Image
                                                src={getWixImageUrl(item.image)!}
                                                alt={item.productName?.original || "Producto"}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-gray-100" />
                                        )}
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3>{item.productName?.original}</h3>
                                                <p className="ml-4">{item.price?.formattedConvertedAmount}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-1 items-end justify-between text-sm">
                                            <p className="text-gray-500">Cantidad: {item.quantity}</p>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(item._id!)}
                                                className="font-medium text-red-600 hover:text-red-500"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10 border-t border-gray-200 pt-8">
                            <div className="flex justify-between text-base font-medium text-gray-900 mb-6">
                                <p>Subtotal</p>
                                <p>
                                    {lineItems.reduce((acc, item) => {
                                        const price = item.price?.amount ? parseFloat(item.price.amount) : 0;
                                        return acc + price * (item.quantity || 1);
                                    }, 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}
                                </p>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
                            >
                                {isCheckingOut ? "Procesando..." : "Finalizar Compra"}
                            </button>
                            <p className="mt-4 text-center text-sm text-gray-500">
                                Serás redirigido a una página segura para completar el pago.
                            </p>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </main>
    );
}
