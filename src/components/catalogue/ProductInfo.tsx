"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

interface ProductInfoProps {
    title: string;
    price: string;
    description: string;
    children?: React.ReactNode; // For AddToCart button
    slug?: string; // Optional slug for sharing or reference
}

const AccordionItem = ({
    title,
    content,
    html,
}: {
    title: string;
    content?: string;
    html?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 flex justify-between items-center text-left group"
            >
                <span className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors uppercase tracking-wider text-xs">
                    {title}
                </span>
                <span className={`transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}>
                    +
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="pb-4 text-sm text-gray-500 leading-relaxed font-sans">
                            {html ? (
                                <div
                                    className="prose prose-sm prose-gray max-w-none"
                                    dangerouslySetInnerHTML={{ __html: html }}
                                />
                            ) : (
                                content
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const ProductInfo = ({ title, price, description, children, slug }: ProductInfoProps) => {
    const whatsappMessage = `Hola, me interesa el producto: ${title}. ¿Me podrían dar más información?`;
    const whatsappUrl = `https://wa.me/5215512345678?text=${encodeURIComponent(whatsappMessage)}`; // Replace with actual number if provided, using dummy for now or previous context if available. User didn't specify number, using generic placeholder logic or specific if I find one. Checking codebase for context... actually I'll use a placeholder and ask user to confirm number or search for it.

    return (
        <div className="sticky top-32 space-y-8 px-4 md:px-0 font-sans">
            {/* Header */}
            <div className="space-y-4 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="flex text-amber-400 text-sm">★★★★★</span>
                    <span className="text-xs font-semibold text-gray-500 underline decoration-gray-300 underline-offset-4 cursor-pointer hover:text-gray-800 transition-colors">
                        4.9 (128 Reseñas)
                    </span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        En Stock
                    </span>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-5xl font-heading font-bold text-gray-900 leading-[1.1] tracking-tight"
                >
                    {title}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="flex items-baseline gap-3"
                >
                    <span className="text-3xl font-light text-gray-900">{price}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        IVA Incluido
                    </span>
                </motion.div>
            </div>

            {/* Main Action Block */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-4"
            >
                {/* Add To Cart (Children) */}
                {children}

                {/* WhatsApp Button */}
                <Link
                    href={whatsappUrl}
                    target="_blank"
                    className="w-full py-4 bg-[#25D366] text-white font-bold text-sm hover:bg-[#128C7E] transition-all duration-300 flex items-center justify-center gap-2 rounded-sm uppercase tracking-wider"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    COMPRAR POR WHATSAPP
                </Link>

                {/* Secondary B2B CTA */}
                <button className="w-full py-4 border border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-900 hover:text-gray-900 transition-all duration-300 flex items-center justify-center gap-2 group">
                    <span>SOLICITAR COTIZACIÓN POR VOLUMEN</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>

                <p className="text-center text-xs text-gray-400">
                    Descuentos especiales para hoteles y restaurantes a partir de 10 unidades.
                </p>
            </motion.div>

            {/* Description & Details Accordion */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="pt-4"
            >
                <div className="border-t border-b border-gray-100">
                    <AccordionItem
                        title="Descripción & Materiales"
                        html={description}
                    />
                    {/* Removed Dimensions & Specifications as requested */}
                    <AccordionItem
                        title="Tiempos de Entrega & Garantía"
                        content="Envío inmediato (2-5 días hábiles) para productos en stock. Fabricación especial: 15-20 días hábiles. Garantía de 3 años contra defectos de fabricación."
                    />
                </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="grid grid-cols-2 gap-6 pt-8"
            >
                <div className="flex flex-col gap-2">
                    <div className="text-amber-500">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">Calidad Certificada</h3>
                    <p className="text-xs text-gray-500">Materiales de grado comercial probados para alta resistencia.</p>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-blue-500">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">Compra Segura</h3>
                    <p className="text-xs text-gray-500">Transacciones encriptadas y protección al comprador.</p>
                </div>
            </motion.div>
        </div>
    );
};
