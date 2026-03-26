"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWixClient } from "@/hooks/useWixClient";
import { isMemberSession, setMemberFlag } from "@/context/wixContext";
import Link from "next/link";
import SectionHero from "@/components/SectionHero";

type Tab = "pedidos" | "perfil";

export default function CuentaPage() {
    const { wixClient, isReady } = useWixClient();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [memberEmail, setMemberEmail] = useState("");
    const [memberName, setMemberName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("pedidos");
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    // Auth state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    const [authError, setAuthError] = useState("");
    const [authLoading, setAuthLoading] = useState(false);

    // Read cached profile from localStorage immediately on client mount
    // (runs before the async checkAuth so email/name appear instantly on re-navigation)
    useEffect(() => {
        try {
            const cachedEmail = localStorage.getItem("josepja_member_email");
            const cachedName = localStorage.getItem("josepja_member_name");
            if (cachedEmail) setMemberEmail(cachedEmail);
            if (cachedName) setMemberName(cachedName);
        } catch {}
    }, []);


    // Check if user is already logged in and fetch their data
    useEffect(() => {
        if (!isReady) return;

        const checkAuth = async () => {
            try {
                const hasMemberSession = isMemberSession();
                setIsLoggedIn(hasMemberSession);

                if (hasMemberSession) {
                    // Extract memberId from JWT access token
                    let memberId = "";
                    try {
                        const stored = localStorage.getItem("wix_session");
                        if (stored) {
                            const parsed = JSON.parse(stored);
                            const accessToken = parsed?.accessToken?.value || "";
                            if (accessToken) {
                                const parts = accessToken.split(".");
                                if (parts.length >= 2) {
                                    const payload = JSON.parse(atob(parts[1]));
                                    const data = typeof payload.data === "string" ? JSON.parse(payload.data) : payload.data;
                                    memberId = data?.id || data?.memberId || "";
                                }
                            }
                        }
                    } catch {}

                    // Fetch profile + orders from server (uses API key, no 403)
                    if (memberId) {
                        setOrdersLoading(true);
                        try {
                            const res = await fetch("/api/member-data", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ memberId }),
                            });
                            const data = await res.json();
                            if (data.profile) {
                                const email = data.profile.email || "";
                                const fullName = [data.profile.name, data.profile.lastName].filter(Boolean).join(" ");
                                const name = fullName || email;
                                setMemberEmail(email);
                                setMemberName(name);
                                // Cache so next navigation shows it instantly
                                try {
                                    localStorage.setItem("josepja_member_email", email);
                                    localStorage.setItem("josepja_member_name", name);
                                } catch {}
                            }
                            if (data.orders) {
                                setOrders(data.orders);
                            }
                        } catch (err) {
                            console.warn("[Cuenta] Error fetching member data:", err);
                        }
                        setOrdersLoading(false);
                    }
                }
                // Note: do NOT clear cache here if not logged in —
                // isMemberSession() can return false transiently while Wix
                // restores the session. Cache is only cleared on explicit logout.
            } catch {
                setIsLoggedIn(false);
            }
            setIsLoading(false);
        };
        checkAuth();
    }, [wixClient, isReady]);


    // Handle login
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setAuthError("");
        setAuthLoading(true);

        try {
            const response = await wixClient.auth.login({
                email: loginEmail,
                password: loginPassword,
            });

            if (response.loginState === "SUCCESS" && response.data) {
                const sessionToken = (response.data as any).sessionToken;
                const memberTokens = await wixClient.auth.getMemberTokensForDirectLogin(sessionToken);
                setMemberFlag(true);
                wixClient.auth.setTokens(memberTokens);
                setIsLoggedIn(true);
                setMemberEmail(loginEmail);
                // Cache email so it persists across F5
                try {
                    localStorage.setItem("josepja_member_email", loginEmail);
                    localStorage.setItem("josepja_member_name", loginEmail);
                } catch {}
            } else if (response.loginState === "FAILURE") {
                const errorCode = (response as any).errorCode;
                if (errorCode === "invalidEmail" || errorCode === "invalidPassword") {
                    setAuthError("Email o contraseña incorrectos.");
                } else if (errorCode === "emailAlreadyExists") {
                    setAuthError("Este email ya está registrado. Intenta iniciar sesión.");
                } else if (errorCode === "resetPassword") {
                    setAuthError("Debes restablecer tu contraseña. Revisa tu correo.");
                } else {
                    setAuthError("Error al iniciar sesión. Verifica tus datos.");
                }
            } else if (response.loginState === "EMAIL_VERIFICATION_REQUIRED") {
                setAuthError("Revisa tu correo para verificar tu cuenta.");
            } else {
                setAuthError("Error al iniciar sesión.");
            }
        } catch (err: any) {
            console.error("[Cuenta] Login error:", err);
            setAuthError("Error al iniciar sesión. Verifica tus datos.");
        }
        setAuthLoading(false);
    };

    // Handle register
    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setAuthError("");
        setAuthLoading(true);

        try {
            const response = await wixClient.auth.register({
                email: loginEmail,
                password: loginPassword,
            });

            if (response.loginState === "SUCCESS" && response.data) {
                const sessionToken = (response.data as any).sessionToken;
                const memberTokens = await wixClient.auth.getMemberTokensForDirectLogin(sessionToken);
                setMemberFlag(true);
                wixClient.auth.setTokens(memberTokens);
                setIsLoggedIn(true);
                setMemberEmail(loginEmail);
                setMemberName(loginEmail);
                // Cache email so it persists across F5
                try {
                    localStorage.setItem("josepja_member_email", loginEmail);
                    localStorage.setItem("josepja_member_name", loginEmail);
                } catch {}
            } else if (response.loginState === "FAILURE") {
                const errorCode = (response as any).errorCode;
                if (errorCode === "emailAlreadyExists") {
                    setAuthError("Este email ya está registrado. Intenta iniciar sesión.");
                } else {
                    setAuthError("Error al registrar. Intenta de nuevo.");
                }
            } else if (response.loginState === "EMAIL_VERIFICATION_REQUIRED") {
                setAuthError("Te enviamos un email de verificación. Revisa tu correo.");
            } else {
                setAuthError("Registro iniciado. Revisa tu correo.");
            }
        } catch (err: any) {
            console.error("[Cuenta] Register error:", err);
            setAuthError("Error al registrar. Intenta de nuevo.");
        }
        setAuthLoading(false);
    };

    // Handle logout
    const handleLogout = async () => {
        // 1. Clear local state immediately so UI reflects logged-out
        setIsLoggedIn(false);
        setMemberEmail("");
        setMemberName("");
        setOrders([]);
        // 2. Clear stored session and profile cache
        setMemberFlag(false);
        try {
            localStorage.removeItem("wix_session");
            localStorage.removeItem("josepja_member_email");
            localStorage.removeItem("josepja_member_name");
        } catch {}
        // 3. Attempt Wix server-side logout (may redirect, ignore errors)
        try {
            await wixClient.auth.logout(window.location.origin + "/cuenta");
        } catch {
            // If logout doesn't redirect, reload manually
            window.location.href = "/cuenta";
        }
    };

    if (isLoading || !isReady) {
        return (
            <main className="bg-white min-h-screen flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="w-32 h-4 rounded bg-gray-200" />
                </div>
            </main>
        );
    }

    return (
        <main className="bg-white min-h-screen">
            <SectionHero
                overline="Mi Cuenta"
                title={isLoggedIn
                    ? <><em className="text-[var(--accent)] not-italic">Bienvenido</em> de vuelta</>
                    : <>Accede a tu <em className="text-[var(--accent)] not-italic">cuenta</em></>
                }
                subtitle={isLoggedIn
                    ? "Administra tus pedidos y perfil desde aquí."
                    : "Inicia sesión o regístrate para gestionar tus pedidos y acceder a beneficios exclusivos."
                }
                backgroundImage="/images/contact-hero.jpg"
            />

            <section className="py-24 md:py-32 px-6">
                <div className="container mx-auto max-w-4xl">
                    <AnimatePresence mode="wait">
                        {!isLoggedIn ? (
                            /* ──── LOGIN / REGISTER FORM ──── */
                            <motion.div
                                key="auth"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-[#FAFAF8] rounded-[2.5rem] p-8 md:p-16 shadow-box border border-white max-w-lg mx-auto"
                            >
                                {/* Toggle tabs */}
                                <div className="flex mb-10 bg-white rounded-full p-1 shadow-sm">
                                    <button
                                        onClick={() => { setAuthMode("login"); setAuthError(""); }}
                                        className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase rounded-full transition-all ${authMode === "login"
                                            ? "bg-[var(--brand-navy)] text-white shadow-md"
                                            : "text-gray-400 hover:text-gray-600"
                                            }`}
                                    >
                                        Iniciar Sesión
                                    </button>
                                    <button
                                        onClick={() => { setAuthMode("register"); setAuthError(""); }}
                                        className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase rounded-full transition-all ${authMode === "register"
                                            ? "bg-[var(--brand-navy)] text-white shadow-md"
                                            : "text-gray-400 hover:text-gray-600"
                                            }`}
                                    >
                                        Registrarse
                                    </button>
                                </div>

                                <form onSubmit={authMode === "login" ? handleLogin : handleRegister} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-all shadow-sm"
                                            placeholder="tu@email.com"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Contraseña</label>
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            className="w-full bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-all shadow-sm"
                                            placeholder="••••••••"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                        />
                                    </div>

                                    {authError && (
                                        <p className="text-red-500 text-xs font-medium text-center">{authError}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={authLoading}
                                        className="w-full py-5 bg-[var(--brand-navy)] text-white text-[10px] font-bold tracking-[0.3em] uppercase rounded-full hover:bg-[var(--accent)] transition-all shadow-xl shadow-[var(--brand-navy)]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {authLoading
                                            ? "Procesando..."
                                            : authMode === "login"
                                                ? "Iniciar Sesión"
                                                : "Crear Cuenta"
                                        }
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            /* ──── DASHBOARD ──── */
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                {/* Tab Navigation */}
                                <div className="flex justify-between items-center mb-12">
                                    <div className="flex gap-1 bg-gray-50 rounded-full p-1">
                                        {([
                                            { id: "pedidos" as Tab, label: "Mis Pedidos" },
                                            { id: "perfil" as Tab, label: "Perfil" },
                                        ]).map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`px-6 py-3 text-xs font-bold tracking-widest uppercase rounded-full transition-all ${activeTab === tab.id
                                                    ? "bg-white text-[var(--brand-navy)] shadow-sm"
                                                    : "text-gray-400 hover:text-gray-600"
                                                    }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors tracking-wider uppercase"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <AnimatePresence mode="wait">
                                    {activeTab === "pedidos" && (
                                        <motion.div
                                            key="pedidos"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            {ordersLoading ? (
                                                <div className="text-center py-20 text-gray-400 text-sm">
                                                    Cargando pedidos...
                                                </div>
                                            ) : orders.length === 0 ? (
                                                <div className="text-center py-20 bg-[#FAFAF8] rounded-[2.5rem] border border-white shadow-box">
                                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-8">
                                                        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-2xl font-serif text-gray-900 mb-3">Aún no tienes pedidos</h3>
                                                    <p className="text-gray-400 text-sm mb-8">Explora nuestro catálogo y encuentra el mobiliario perfecto para tu espacio.</p>
                                                    <Link
                                                        href="/tienda"
                                                        className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--brand-navy)] text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-[var(--accent)] transition-all"
                                                    >
                                                        Ir a la Tienda
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    {orders.map((order: any, idx: number) => (
                                                        <div
                                                            key={order._id || idx}
                                                            className="bg-[#FAFAF8] rounded-2xl p-6 md:p-8 border border-white shadow-sm hover:shadow-md transition-shadow"
                                                        >
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div>
                                                                    <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase block mb-1">
                                                                        Pedido #{order.number || idx + 1}
                                                                    </span>
                                                                    <span className="text-sm text-gray-600">
                                                                        {order._createdDate
                                                                            ? new Date(order._createdDate).toLocaleDateString("es-MX", {
                                                                                year: "numeric",
                                                                                month: "long",
                                                                                day: "numeric",
                                                                            })
                                                                            : ""}
                                                                    </span>
                                                                </div>
                                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === "FULFILLED"
                                                                    ? "bg-green-50 text-green-600"
                                                                    : order.status === "CANCELED"
                                                                        ? "bg-red-50 text-red-500"
                                                                        : "bg-amber-50 text-amber-600"
                                                                    }`}>
                                                                    {order.status === "FULFILLED" ? "Entregado"
                                                                        : order.status === "CANCELED" ? "Cancelado"
                                                                            : order.status === "APPROVED" ? "Aprobado"
                                                                                : "En Proceso"}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-end">
                                                                <span className="text-gray-400 text-xs">
                                                                    {order.lineItems?.length || 0} productos
                                                                </span>
                                                                <span className="text-xl font-serif text-[var(--brand-navy)]">
                                                                    {order.priceSummary?.total?.formattedAmount || "$0"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {activeTab === "perfil" && (
                                        <motion.div
                                            key="perfil"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-[#FAFAF8] rounded-[2.5rem] p-8 md:p-16 shadow-box border border-white"
                                        >
                                            <div className="flex items-center gap-6 mb-10">
                                                <div className="w-16 h-16 rounded-full bg-[var(--brand-navy)] flex items-center justify-center text-white text-2xl font-serif">
                                                    {memberName ? memberName[0].toUpperCase() : "U"}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-serif text-gray-900">{memberName || "Usuario"}</h3>
                                                    <span className="text-[10px] font-bold tracking-widest text-[var(--accent)] uppercase">Cliente Josepja</span>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                                                    <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase block mb-2">Correo</span>
                                                    <p className="text-gray-900">{memberEmail || "—"}</p>
                                                </div>

                                                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                                                    <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase block mb-2">Soporte</span>
                                                    <p className="text-gray-500 text-sm mb-3">¿Necesitas ayuda con tu cuenta o un pedido?</p>
                                                    <Link
                                                        href="/contacto"
                                                        className="text-xs font-bold tracking-widest text-[var(--accent)] uppercase hover:text-[var(--brand-navy)] transition-colors"
                                                    >
                                                        Contactar Soporte →
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </main>
    );
}
