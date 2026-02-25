"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWixClient } from "@/hooks/useWixClient";
import Link from "next/link";
import { motion } from "framer-motion";

const navItems = [
    {
        href: "/cuenta",
        label: "Mi Perfil",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
    },
    {
        href: "/cuenta/pedidos",
        label: "Mis Pedidos",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
        ),
    },
];

export default function CuentaLayout({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isReady, logout } = useWixClient();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isReady && !isLoggedIn) {
            router.replace("/?login_required=1");
        }
    }, [isReady, isLoggedIn, router]);

    if (!isReady || !isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-subtle,#f8f7f5)] pt-28 pb-24">
            <div className="container max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row gap-8"
                >
                    {/* Sidebar */}
                    <aside className="md:w-56 flex-shrink-0">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-secondary)] mb-5 px-2">
                                Mi Cuenta
                            </p>
                            <nav className="flex flex-col gap-1">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${isActive
                                                    ? "bg-[var(--brand-navy)] text-white"
                                                    : "text-[var(--text-secondary)] hover:bg-gray-50 hover:text-[var(--text-primary)]"
                                                }`}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                    </svg>
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="flex-grow">{children}</main>
                </motion.div>
            </div>
        </div>
    );
}
