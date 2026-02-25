"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useWixClient } from "@/hooks/useWixClient";
import { useCataloguePopup } from "@/context/cataloguePopupContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const { wixClient, isReady } = useWixClient();
    const { openPopup } = useCataloguePopup();

    // Scroll Effect Logic
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Cart Count Logic
    useEffect(() => {
        if (!isReady) return;

        const getCartCount = async () => {
            try {
                const cart = await wixClient.currentCart.getCurrentCart();
                const count = cart?.lineItems?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;
                setCartCount(count);
            } catch (error) {
                setCartCount(0);
            }
        };

        getCartCount();

        window.addEventListener("cart-updated", getCartCount);
        return () => window.removeEventListener("cart-updated", getCartCount);
    }, [wixClient, isReady]);



    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`
                    fixed top-0 left-0 right-0 z-50 transition-all duration-500
                    ${isScrolled || isMobileMenuOpen
                        ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 pt-3 pb-4"
                        : "bg-transparent pt-4 pb-5"
                    }
                `}
            >
                <div className="container h-full flex items-center justify-between">
                    {/* Brand */}
                    <Link href="/" className="relative z-50 group flex items-center">
                        <img
                            src="/logo-header.png"
                            alt="Josepja"
                            style={{
                                width: '200px',
                                height: '50px',
                                objectFit: 'cover',
                                objectPosition: 'center center',
                            }}
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        {[
                            { label: "Tienda", href: "/tienda" },
                            { label: "Nosotros", href: "/nosotros" },
                            { label: "Proyectos", href: "/proyectos" },
                            { label: "Blog", href: "/blog" },
                            { label: "Contacto", href: "/contacto" }
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="relative group text-sm font-medium tracking-wide text-[var(--text-primary)]"
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 md:gap-5 relative z-50">
                        {/* Cart */}
                        <Link href="/carrito" className="relative group">
                            <span className="p-2 rounded-full hover:bg-gray-100 transition-colors block">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                                </svg>
                            </span>
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-[var(--accent)] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </Link>

                        {/* Catalogue Download - Desktop Only */}
                        <button
                            onClick={openPopup}
                            className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 bg-[var(--accent)] text-[var(--brand-navy)] hover:bg-[var(--accent-dark)] hover:text-white shadow-sm hover:shadow-md"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Catálogo
                        </button>

                        {/* CTA Button - Desktop Only */}
                        <Link
                            href="/contacto"
                            className={`hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm hover:shadow-md ${isScrolled
                                ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)]"
                                : "bg-white text-[var(--brand-navy)] hover:bg-[var(--accent)] hover:text-white"
                                }`}
                        >
                            Cotizar
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Full Screen Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
                        animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
                        exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed inset-0 z-40 bg-white flex items-center justify-center md:hidden"
                    >
                        <div className="flex flex-col items-center gap-8">
                            {[
                                { label: "Tienda", href: "/tienda" },
                                { label: "Nosotros", href: "/nosotros" },
                                { label: "Proyectos", href: "/proyectos" },
                                { label: "Blog", href: "/blog" },
                                { label: "Contacto", href: "/contacto" }
                            ].map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (index * 0.1) }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-4xl font-[var(--font-heading)] text-[var(--brand-navy)] hover:text-[var(--accent)] transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}


                            {/* Catalogue PDF Download - Mobile */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setTimeout(openPopup, 300);
                                    }}
                                    className="flex items-center gap-3 px-6 py-3 rounded-full border-2 border-[var(--accent)] text-[var(--accent)] text-sm font-bold uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all duration-300"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Descargar Catálogo
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;

