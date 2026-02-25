"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCataloguePopup } from "@/context/cataloguePopupContext";

const CataloguePopup = () => {
    const { isOpen, closePopup } = useCataloguePopup();
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const modalRef = useRef<HTMLDivElement>(null);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") closePopup();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [closePopup]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Ingresa tu nombre";
        if (!formData.email.trim()) {
            newErrors.email = "Ingresa tu email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email inválido";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Ingresa tu teléfono";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        try {
            // TODO: Save lead to Wix CMS or Supabase
            // For now, we simulate a delay and trigger the download
            await new Promise((resolve) => setTimeout(resolve, 1200));

            // Trigger PDF download
            // Replace with real catalogue PDF URL when available
            const pdfUrl = "/catalogo-restomueble.pdf";
            const link = document.createElement("a");
            link.href = pdfUrl;
            link.download = "Catalogo-Restomueble-2025.pdf";
            link.click();

            setIsSuccess(true);
            setTimeout(() => {
                closePopup();
                setIsSuccess(false);
                setFormData({ name: "", email: "", phone: "" });
            }, 3000);
        } catch (error) {
            console.error("Error submitting catalogue form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closePopup}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Modal */}
                    <motion.div
                        ref={modalRef}
                        className="relative w-full max-w-lg overflow-hidden rounded-2xl"
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                        }}
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(250,250,245,0.98) 100%)",
                            backdropFilter: "blur(20px)",
                            boxShadow:
                                "0 32px 64px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2) inset",
                        }}
                    >
                        {/* Decorative accent bar */}
                        <div
                            className="h-1 w-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, var(--accent) 0%, var(--brand-navy) 100%)",
                            }}
                        />

                        {/* Close button */}
                        <button
                            onClick={closePopup}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300 z-10"
                            aria-label="Cerrar"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        <div className="p-8 md:p-10">
                            {!isSuccess ? (
                                <>
                                    {/* Header */}
                                    <div className="mb-8 text-center">
                                        {/* Catalogue icon */}
                                        <div
                                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, var(--accent-light) 0%, var(--accent) 100%)",
                                            }}
                                        >
                                            <svg
                                                width="28"
                                                height="28"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="var(--brand-navy)"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                                <line x1="12" y1="18" x2="12" y2="12" />
                                                <line x1="9" y1="15" x2="15" y2="15" />
                                            </svg>
                                        </div>

                                        <h2
                                            className="text-2xl md:text-3xl mb-3"
                                            style={{
                                                fontFamily: "var(--font-heading)",
                                                color: "var(--text-primary)",
                                                fontWeight: 400,
                                            }}
                                        >
                                            Descargá nuestro catálogo
                                        </h2>
                                        <p
                                            className="text-sm md:text-base"
                                            style={{
                                                color: "var(--text-secondary)",
                                                fontWeight: 300,
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            Conocé nuestra colección completa de mobiliario para
                                            hospitalidad. Dejanos tus datos y
                                            descargá el PDF al instante.
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Name */}
                                        <div>
                                            <label
                                                htmlFor="popup-name"
                                                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                                                style={{ color: "var(--text-secondary)" }}
                                            >
                                                Nombre completo
                                            </label>
                                            <input
                                                id="popup-name"
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    handleChange("name", e.target.value)
                                                }
                                                placeholder="Ej: María López"
                                                className={`w-full px-4 py-3 rounded-lg border text-sm transition-all duration-300 outline-none ${errors.name
                                                        ? "border-red-400 bg-red-50/50"
                                                        : "border-gray-200 bg-white hover:border-gray-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]"
                                                    }`}
                                                style={{
                                                    fontFamily: "var(--font-body)",
                                                }}
                                            />
                                            {errors.name && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label
                                                htmlFor="popup-email"
                                                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                                                style={{ color: "var(--text-secondary)" }}
                                            >
                                                Email
                                            </label>
                                            <input
                                                id="popup-email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    handleChange("email", e.target.value)
                                                }
                                                placeholder="tu@email.com"
                                                className={`w-full px-4 py-3 rounded-lg border text-sm transition-all duration-300 outline-none ${errors.email
                                                        ? "border-red-400 bg-red-50/50"
                                                        : "border-gray-200 bg-white hover:border-gray-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]"
                                                    }`}
                                                style={{
                                                    fontFamily: "var(--font-body)",
                                                }}
                                            />
                                            {errors.email && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label
                                                htmlFor="popup-phone"
                                                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                                                style={{ color: "var(--text-secondary)" }}
                                            >
                                                Teléfono / WhatsApp
                                            </label>
                                            <input
                                                id="popup-phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    handleChange("phone", e.target.value)
                                                }
                                                placeholder="+52 55 1234 5678"
                                                className={`w-full px-4 py-3 rounded-lg border text-sm transition-all duration-300 outline-none ${errors.phone
                                                        ? "border-red-400 bg-red-50/50"
                                                        : "border-gray-200 bg-white hover:border-gray-300 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-light)]"
                                                    }`}
                                                style={{
                                                    fontFamily: "var(--font-body)",
                                                }}
                                            />
                                            {errors.phone && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 rounded-lg text-sm font-semibold uppercase tracking-widest transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                            style={{
                                                background: isSubmitting
                                                    ? "var(--text-secondary)"
                                                    : "linear-gradient(135deg, var(--brand-navy) 0%, var(--brand-navy-deep) 100%)",
                                                color: "white",
                                                fontFamily: "var(--font-body)",
                                                letterSpacing: "0.12em",
                                            }}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg
                                                        className="animate-spin h-4 w-4"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            fill="none"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                        />
                                                    </svg>
                                                    Preparando catálogo...
                                                </span>
                                            ) : (
                                                "Descargar Catálogo Gratis"
                                            )}
                                        </button>
                                    </form>

                                    {/* Trust note */}
                                    <p
                                        className="text-center mt-5 text-xs"
                                        style={{
                                            color: "var(--text-light)",
                                            fontWeight: 300,
                                        }}
                                    >
                                        🔒 Tus datos están seguros. No compartimos tu información
                                        con terceros.
                                    </p>
                                </>
                            ) : (
                                /* Success State */
                                <motion.div
                                    className="text-center py-8"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        damping: 15,
                                        stiffness: 200,
                                    }}
                                >
                                    <div
                                        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #2E5940 0%, #3a7350 100%)",
                                        }}
                                    >
                                        <svg
                                            width="36"
                                            height="36"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <h3
                                        className="text-2xl mb-3"
                                        style={{
                                            fontFamily: "var(--font-heading)",
                                            color: "var(--text-primary)",
                                            fontWeight: 400,
                                        }}
                                    >
                                        ¡Descarga iniciada!
                                    </h3>
                                    <p
                                        className="text-sm"
                                        style={{
                                            color: "var(--text-secondary)",
                                            fontWeight: 300,
                                        }}
                                    >
                                        Gracias por tu interés. El catálogo se descargará
                                        automáticamente.
                                        <br />
                                        También te lo enviaremos a tu email.
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CataloguePopup;
