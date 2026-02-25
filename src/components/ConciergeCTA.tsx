"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CONCEPTO: "THE DESIGN CONCIERGE" - VERSIÓN WIZARD
 * 
 * Un formulario de contacto interactivo paso a paso.
 * Cada pregunta aparece una a la vez con animaciones premium.
 * Incluye:
 * - Barra de progreso visual
 * - Transiciones suaves entre pasos
 * - Indicadores de paso
 * - Detalles de lujo (líneas, tipografía, espaciado)
 */

// Tipos de proyecto disponibles
const projectTypes = [
    { value: "restaurante", label: "Restaurante", icon: "🍽️" },
    { value: "hotel", label: "Hotel", icon: "🏨" },
    { value: "cafe", label: "Bar / Café", icon: "☕" },
    { value: "oficina", label: "Oficina Corporativa", icon: "🏢" },
    { value: "evento", label: "Evento Especial", icon: "✨" },
    { value: "otro", label: "Otro Proyecto", icon: "🎯" },
];

// Rangos de cantidad de piezas
const quantityRanges = [
    { value: "1-10", label: "1 - 10 piezas" },
    { value: "11-50", label: "11 - 50 piezas" },
    { value: "51-100", label: "51 - 100 piezas" },
    { value: "100+", label: "Más de 100 piezas" },
];

interface ConciergeCTAProps {
    content?: {
        concierge_heading?: string;
        concierge_subtitle?: string;
    };
}

export default function ConciergeCTA({ content = {} }: ConciergeCTAProps) {
    // Estado del wizard
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: "",
        projectType: "",
        quantity: "",
        email: "",
        phone: "",
        message: "",
    });

    // Estado de envío
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    /**
     * DEFINICIÓN DE PASOS:
     * Cada paso tiene un título, descripción y el contenido a mostrar.
     */
    const steps = [
        {
            id: "name",
            question: "¿Cuál es tu nombre?",
            subtitle: "Queremos conocerte personalmente",
        },
        {
            id: "project",
            question: "¿Qué tipo de proyecto tienes en mente?",
            subtitle: "Selecciona la categoría que mejor describe tu espacio",
        },
        {
            id: "quantity",
            question: "¿Cuántas piezas necesitas aproximadamente?",
            subtitle: "Esto nos ayuda a preparar la mejor propuesta",
        },
        {
            id: "contact",
            question: "¿Cómo podemos contactarte?",
            subtitle: "Te responderemos en menos de 24 horas",
        },
    ];

    const totalSteps = steps.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    /**
     * NAVEGACIÓN ENTRE PASOS
     */
    const nextStep = () => {
        if (currentStep < totalSteps - 1) {
            setDirection(1);
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep((prev) => prev - 1);
        }
    };

    /**
     * VALIDACIÓN DE PASO ACTUAL
     */
    const canProceed = () => {
        switch (currentStep) {
            case 0:
                return formData.name.trim().length >= 2;
            case 1:
                return formData.projectType !== "";
            case 2:
                return formData.quantity !== "";
            case 3:
                return formData.email.trim().length >= 5 && formData.email.includes("@");
            default:
                return false;
        }
    };

    /**
     * ENVÍO DEL FORMULARIO
     */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!canProceed()) return;

        setIsSubmitting(true);

        // TODO: Conectar con API real (Wix Forms, SendGrid, etc.)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Form Data:", formData);
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    /**
     * VARIANTES DE ANIMACIÓN PARA LOS PASOS
     */
    const stepVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0,
        }),
    };

    return (
        <section id="concierge" className="py-20 md:py-32 lg:py-40 bg-gradient-to-b from-[var(--bg-tertiary)] via-[var(--brand-navy-light)] to-white border-t border-gray-100 overflow-hidden">
            <div className="container max-w-3xl mx-auto px-4 md:px-6">

                {!isSubmitted ? (
                    <>
                        {/* WIX CMS HEADERS */}
                        {(content.concierge_heading || content.concierge_subtitle) && (
                            <div className="text-center mb-12 md:mb-20">
                                {content.concierge_heading && (
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-gray-900 leading-tight">
                                        {content.concierge_heading}
                                    </h2>
                                )}
                                {content.concierge_subtitle && (
                                    <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                        {content.concierge_subtitle}
                                    </p>
                                )}
                                <div className="mt-8 flex justify-center">
                                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-40"></div>
                                </div>
                            </div>
                        )}

                        {/* BARRA DE PROGRESO PREMIUM */}
                        <div className="mb-10 md:mb-16">
                            {/* Indicadores de paso */}
                            <div className="flex justify-between items-center mb-4">
                                {steps.map((step, index) => (
                                    <div
                                        key={step.id}
                                        className={`
                                            flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full
                                            text-xs md:text-sm font-semibold transition-all duration-500
                                            ${index < currentStep
                                                ? "bg-[var(--accent)] text-white"
                                                : index === currentStep
                                                    ? "bg-[var(--brand-navy)] text-white scale-110 shadow-lg"
                                                    : "bg-gray-100 text-gray-400"
                                            }
                                        `}
                                    >
                                        {index < currentStep ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Barra de progreso animada */}
                            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[var(--brand-navy)] to-[var(--accent)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>

                        {/* CONTENIDO DEL PASO ACTUAL */}
                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentStep}
                                    custom={direction}
                                    variants={stepVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                    className="min-h-[300px] md:min-h-[400px] flex flex-col"
                                >
                                    {/* Pregunta y subtítulo */}
                                    <div className="text-center mb-8 md:mb-12">
                                        <motion.span
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="inline-block w-16 h-0.5 bg-[var(--accent)] mb-8 opacity-60"
                                        />
                                        <motion.h2
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="font-[var(--font-heading)] text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[var(--text-primary)] mb-3 md:mb-4"
                                        >
                                            {steps[currentStep].question}
                                        </motion.h2>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-[var(--text-secondary)] text-base md:text-lg"
                                        >
                                            {steps[currentStep].subtitle}
                                        </motion.p>
                                    </div>

                                    {/* PASO 1: NOMBRE */}
                                    {currentStep === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="flex-1 flex items-center justify-center"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Escribe tu nombre..."
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                onKeyDown={(e) => e.key === "Enter" && canProceed() && nextStep()}
                                                className="
                                                    w-full max-w-md text-center
                                                    text-2xl md:text-3xl lg:text-4xl font-[var(--font-heading)] italic
                                                    bg-transparent border-b-2 border-gray-200
                                                    text-[var(--text-primary)] placeholder:text-gray-200
                                                    focus:outline-none focus:border-[var(--accent)]
                                                    transition-colors duration-300 pb-3 md:pb-4
                                                    min-h-[48px]
                                                "
                                            />
                                        </motion.div>
                                    )}

                                    {/* PASO 2: TIPO DE PROYECTO */}
                                    {currentStep === 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4"
                                        >
                                            {projectTypes.map((type) => (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, projectType: type.value });
                                                        // Auto-avanzar después de seleccionar
                                                        setTimeout(() => nextStep(), 300);
                                                    }}
                                                    className={`
                                                        group p-5 md:p-6 rounded-xl md:rounded-2xl border-2 text-left
                                                        transition-all duration-300 touch-manipulation min-h-[88px]
                                                        ${formData.projectType === type.value
                                                            ? "border-[var(--accent)] bg-[var(--accent)]/5 scale-[1.02]"
                                                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                                        }
                                                    `}
                                                >
                                                    <span className="text-2xl md:text-3xl mb-2 md:mb-3 block">{type.icon}</span>
                                                    <span className={`
                                                        text-base md:text-lg font-medium block leading-tight
                                                        ${formData.projectType === type.value
                                                            ? "text-[var(--accent-dark)]"
                                                            : "text-[var(--text-primary)]"
                                                        }
                                                    `}>
                                                        {type.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}

                                    {/* PASO 3: CANTIDAD */}
                                    {currentStep === 2 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="flex-1 flex flex-col items-center justify-center gap-4"
                                        >
                                            {quantityRanges.map((range) => (
                                                <button
                                                    key={range.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, quantity: range.value });
                                                        setTimeout(() => nextStep(), 300);
                                                    }}
                                                    className={`
                                                        w-full max-w-sm py-5 px-8 rounded-full border-2
                                                        text-lg font-medium text-center
                                                        transition-all duration-300
                                                        ${formData.quantity === range.value
                                                            ? "border-[var(--accent)] bg-[var(--accent)] text-white scale-105"
                                                            : "border-gray-200 text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5"
                                                        }
                                                    `}
                                                >
                                                    {range.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}

                                    {/* PASO 4: CONTACTO */}
                                    {currentStep === 3 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="flex-1 flex flex-col items-center justify-center gap-6"
                                        >
                                            <input
                                                type="email"
                                                autoFocus
                                                placeholder="tu@email.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="
                                                    w-full max-w-md text-center
                                                    text-lg md:text-xl lg:text-2xl
                                                    bg-white border-2 border-gray-200 rounded-xl
                                                    text-[var(--text-primary)] placeholder:text-gray-300
                                                    focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10
                                                    transition-all duration-300 py-4 md:py-5 px-5 md:px-6
                                                    min-h-[56px]
                                                "
                                            />
                                            <span className="text-gray-300 text-sm">o</span>
                                            <input
                                                type="tel"
                                                placeholder="(55) 1234-5678 (opcional)"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="
                                                    w-full max-w-md text-center
                                                    text-lg md:text-2xl
                                                    bg-white border-2 border-gray-200 rounded-xl
                                                    text-[var(--text-primary)] placeholder:text-gray-300
                                                    focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10
                                                    transition-all duration-300 py-4 md:py-5 px-5 md:px-6
                                                    min-h-[56px]
                                                "
                                            />
                                        </motion.div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* NAVEGACIÓN */}
                            <div className="flex justify-between items-center mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-100">
                                {/* Botón Anterior */}
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className={`
                                        flex items-center gap-2 px-6 py-3
                                        text-[var(--text-secondary)] font-medium
                                        transition-all duration-300
                                        ${currentStep === 0 ? "opacity-0 pointer-events-none" : "hover:text-[var(--text-primary)]"}
                                    `}
                                >
                                    <span>←</span>
                                    Anterior
                                </button>

                                {/* Botón Siguiente / Enviar */}
                                {currentStep < totalSteps - 1 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!canProceed()}
                                        className={`
                                            flex items-center gap-2 px-8 py-4
                                            rounded-full font-semibold
                                            transition-all duration-300
                                            ${canProceed()
                                                ? "bg-[var(--brand-navy)] text-white hover:scale-105 hover:shadow-xl"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }
                                        `}
                                    >
                                        Continuar
                                        <span>→</span>
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={!canProceed() || isSubmitting}
                                        className={`
                                            flex items-center gap-3 px-10 py-4
                                            rounded-full font-semibold text-white
                                            transition-all duration-500
                                            ${canProceed() && !isSubmitting
                                                ? "bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-navy-deep)] hover:scale-105 hover:shadow-2xl"
                                                : "bg-gray-300 cursor-not-allowed"
                                            }
                                        `}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                Enviar Solicitud
                                                <span>✓</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </>
                ) : (
                    /* ESTADO DE ÉXITO */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        className="text-center py-20"
                    >
                        {/* Animación de confeti/éxito */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-24 h-24 mx-auto mb-10 rounded-full bg-gradient-to-br from-[var(--success)] to-green-600 flex items-center justify-center shadow-2xl"
                        >
                            <motion.svg
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="w-12 h-12 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </motion.svg>
                        </motion.div>

                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="font-[var(--font-heading)] text-4xl md:text-5xl text-[var(--text-primary)] mb-6"
                        >
                            ¡Gracias, {formData.name}!
                        </motion.h3>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-[var(--text-secondary)] text-xl max-w-lg mx-auto mb-8"
                        >
                            Hemos recibido tu solicitud para mobiliario de {projectTypes.find(p => p.value === formData.projectType)?.label.toLowerCase()}.
                            Nuestro equipo te contactará muy pronto.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="inline-flex items-center gap-2 text-[var(--accent)] font-medium"
                        >
                            <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
                            Respuesta estimada: menos de 24 horas
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
