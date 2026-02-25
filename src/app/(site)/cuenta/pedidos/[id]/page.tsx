"use client";

import { useEffect, useState } from "react";
import { useWixClient } from "@/hooks/useWixClient";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Pendiente de pago", color: "bg-yellow-100 text-yellow-700" },
    APPROVED: { label: "Pago confirmado", color: "bg-blue-100 text-blue-700" },
    CANCELED: { label: "Cancelado", color: "bg-red-100 text-red-600" },
    FULFILLED: { label: "Enviado", color: "bg-green-100 text-green-700" },
    PARTIALLY_FULFILLED: { label: "Parcialmente enviado", color: "bg-purple-100 text-purple-700" },
    NOT_FULFILLED: { label: "Preparando pedido", color: "bg-gray-100 text-gray-600" },
};

export default function OrderDetailPage() {
    const { wixClient, isReady } = useWixClient();
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isReady || !params.id) return;
        const fetchOrder = async () => {
            try {
                const res = await wixClient.orders.getOrder(params.id as string);
                setOrder(res);
            } catch (err) {
                console.error("[Order Detail] Failed:", err);
                router.replace("/cuenta/pedidos");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [wixClient, isReady, params.id, router]);

    if (loading || !order) {
        return (
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const statusKey = order.fulfillmentStatus || order.paymentStatus || "PENDING";
    const badge = STATUS_LABELS[statusKey] || { label: statusKey, color: "bg-gray-100 text-gray-600" };
    const date = order._createdDate
        ? new Date(order._createdDate).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "—";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <Link
                            href="/cuenta/pedidos"
                            className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center gap-1 mb-3 transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Mis Pedidos
                        </Link>
                        <h1 className="text-xl font-[var(--font-heading)] text-[var(--text-primary)]">
                            Pedido #{order.number || order._id?.slice(-8).toUpperCase()}
                        </h1>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">{date}</p>
                    </div>
                    <span className={`text-xs font-bold px-4 py-2 rounded-full flex-shrink-0 ${badge.color}`}>
                        {badge.label}
                    </span>
                </div>

                {/* Items */}
                <div className="space-y-4">
                    {(order.lineItems || []).map((item: any, i: number) => {
                        const imgUrl = item.image?.url || item.catalogReference?.options?.mediaUrl;
                        return (
                            <motion.div
                                key={item._id || i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50"
                            >
                                {imgUrl ? (
                                    <Image
                                        src={imgUrl}
                                        alt={item.productName?.original || "Producto"}
                                        width={64}
                                        height={64}
                                        className="rounded-xl object-cover w-16 h-16 flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                )}
                                <div className="flex-grow min-w-0">
                                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                        {item.productName?.translated || item.productName?.original || "Producto"}
                                    </p>
                                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                        Cantidad: {item.quantity}
                                    </p>
                                </div>
                                <span className="text-sm font-bold text-[var(--text-primary)] flex-shrink-0">
                                    {item.price?.formattedAmount || `$${item.price?.amount}`}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-secondary)] mb-6">
                    Resumen de Pago
                </h2>
                <div className="space-y-3">
                    {[
                        { label: "Subtotal", value: order.priceSummary?.subtotal },
                        { label: "Envío", value: order.priceSummary?.shipping },
                        { label: "Impuestos", value: order.priceSummary?.tax },
                    ].map(({ label, value }) =>
                        value ? (
                            <div key={label} className="flex justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">{label}</span>
                                <span className="text-[var(--text-primary)]">
                                    {value.formattedAmount || `$${value.amount}`}
                                </span>
                            </div>
                        ) : null
                    )}
                    <div className="pt-3 border-t border-gray-100 flex justify-between">
                        <span className="font-bold text-[var(--text-primary)]">Total</span>
                        <span className="font-bold text-[var(--text-primary)]">
                            {order.priceSummary?.total?.formattedAmount || `$${order.priceSummary?.total?.amount}`}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
