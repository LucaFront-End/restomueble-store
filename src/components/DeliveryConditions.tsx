"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Collapsible delivery & warranty conditions panel.
 * Shown on every product page below the shipping calculator.
 */
export default function DeliveryConditions() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-2 group"
            >
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-secondary)] flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    Condiciones de entrega y garantía
                </span>
                <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 pb-2 space-y-4 text-xs text-[var(--text-secondary)] leading-relaxed">
                            {/* Entregas */}
                            <div>
                                <p className="font-semibold text-[var(--text-primary)] mb-1.5 uppercase tracking-wide text-[10px]">
                                    Entregas
                                </p>
                                <p>
                                    Las entregas a domicilio se programan con anticipación y se realizan
                                    en la fecha acordada, dentro de horario abierto, a pie de camión.
                                </p>
                            </div>

                            {/* Cambios */}
                            <div>
                                <p className="font-semibold text-[var(--text-primary)] mb-1.5 uppercase tracking-wide text-[10px]">
                                    Cambios y cancelaciones
                                </p>
                                <ul className="space-y-1.5 list-none">
                                    <li className="flex gap-2">
                                        <span className="text-gray-300 shrink-0">•</span>
                                        Una vez generada la nota, el cliente cuenta con <strong className="text-[var(--text-primary)]">2 días naturales</strong> para
                                        solicitar cambios sin costo. Después de este periodo, cualquier
                                        modificación generará un cargo adicional.
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-gray-300 shrink-0">•</span>
                                        En caso de cancelación, se aplicará una penalización del <strong className="text-[var(--text-primary)]">20%</strong> del
                                        total del pedido.
                                    </li>
                                </ul>
                            </div>

                            {/* Garantía */}
                            <div>
                                <p className="font-semibold text-[var(--text-primary)] mb-1.5 uppercase tracking-wide text-[10px]">
                                    Garantía
                                </p>
                                <p className="mb-1.5">
                                    Se otorga una garantía de <strong className="text-[var(--text-primary)]">12 meses</strong>, válida
                                    únicamente por defectos de fabricación en estructura, soldadura y ensambles.
                                </p>
                                <p className="text-[10px] text-gray-400">
                                    La garantía no aplica por daños ocasionados por mal uso, sobrecarga de peso,
                                    exposición a humedad o condiciones inadecuadas, golpes, desgaste natural
                                    o modificaciones realizadas por terceros.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
