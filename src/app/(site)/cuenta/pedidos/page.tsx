"use client";

import { useEffect, useState } from "react";
import { useWixClient } from "@/hooks/useWixClient";
import Link from "next/link";
import { motion } from "framer-motion";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    PENDING: { label: "Pendiente", color: "bg-yellow-100 text-yellow-700" },
    APPROVED: { label: "Aprobado", color: "bg-blue-100 text-blue-700" },
    CANCELED: { label: "Cancelado", color: "bg-red-100 text-red-600" },
    FULFILLED: { label: "Enviado", color: "bg-green-100 text-green-700" },
    PARTIALLY_FULFILLED: { label: "En proceso", color: "bg-purple-100 text-purple-700" },
    NOT_FULFILLED: { label: "Preparando", color: "bg-gray-100 text-gray-600" },
};

export default function PedidosPage() {
    const { wixClient, isReady } = useWixClient();
    const [ordersList, setOrdersList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isReady) return;
        const fetchOrders = async () => {
            try {
                const res = await wixClient.orders.searchOrders({
                    cursorQuery: {
                        paging: { limit: 20 },
                    },
                } as any);
                setOrdersList(res.orders || []);
            } catch (err) {
                console.error("[Orders] Failed to fetch:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [wixClient, isReady]);

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (ordersList.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                </div>
                <h3 className="text-lg font-[var(--font-heading)] text-[var(--text-primary)] mb-2">Sin pedidos aún</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                    Cuando realices un pedido aparecerá aquí.
                </p>
                <Link
                    href="/tienda"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-navy)] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[var(--accent)] transition-all"
                >
                    Explorar Tienda
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-secondary)] mb-6">
                    Mis Pedidos ({ordersList.length})
                </h2>
                <div className="flex flex-col gap-4">
                    {ordersList.map((order, i) => {
                        const statusKey = order.fulfillmentStatus || order.paymentStatus || "PENDING";
                        const badge = STATUS_LABELS[statusKey] || { label: statusKey, color: "bg-gray-100 text-gray-600" };
                        const total = order.priceSummary?.total;
                        const date = order._createdDate
                            ? new Date(order._createdDate).toLocaleDateString("es-MX", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })
                            : "—";

                        return (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link
                                    href={`/cuenta/pedidos/${order._id}`}
                                    className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-[var(--accent)] hover:shadow-sm transition-all group"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-[var(--text-secondary)] font-mono">
                                            #{order.number || order._id?.slice(-8).toUpperCase()}
                                        </span>
                                        <span className="text-sm font-medium text-[var(--text-primary)]">{date}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${badge.color}`}>
                                            {badge.label}
                                        </span>
                                        {total && (
                                            <span className="text-sm font-bold text-[var(--text-primary)]">
                                                {total.formattedAmount || `$${total.amount}`}
                                            </span>
                                        )}
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-[var(--accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
