"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHero from "@/components/SectionHero";
import Image from "next/image";
import { submitContact } from "@/lib/wixFormActions";

const contactInfo = [
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
        ),
        label: "Showroom Central",
        value: "Av. Prado Norte 450, Lomas de Chapultepec, CDMX",
        desc: "Visitas bajo previa cita para atención personalizada."
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
        ),
        label: "Email Corporativo",
        value: "hola@restomueble.mx",
        href: "mailto:hola@restomueble.mx",
        desc: "Cotizaciones y propuestas comerciales."
    },
    {
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
        ),
        label: "Línea Directa",
        value: "+52 55 8902 4431",
        href: "tel:+525589024431",
        desc: "Atención inmediata Lun - Vie 9:00 - 18:00."
    }
];

export default function ContactoPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        servicio: "residencial",
        mensaje: "",
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);
        const result = await submitContact(formData);
        setIsLoading(false);
        if (result.success) {
            setIsSubmitted(true);
        } else {
            setErrorMsg(result.error || "Error al enviar. Intenta de nuevo.");
        }
    };

    return (
        <main className="bg-white min-h-screen">
            {/* Hero Refinado */}
            <SectionHero
                overline="Contacto"
                title={<>Hablemos de tu <em className="text-[var(--accent)] not-italic">visión</em></>}
                subtitle="Cuéntanos sobre tu espacio y te ayudamos a encontrar el mobiliario perfecto. Respuesta artesanal en menos de 24 horas."
                backgroundImage="/images/contact-hero.jpg"
            />

            <section className="py-24 md:py-32 px-6">
                <div className="container mx-auto">
                    <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">

                        {/* Column 1: Info & Brand */}
                        <div className="lg:col-span-5 space-y-12">
                            <div>
                                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--accent)] mb-4 block">Get in Touch</span>
                                <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 leading-tight">Presencia en toda la <em className="italic">República</em></h2>
                                <p className="text-gray-500 font-light text-lg leading-relaxed">
                                    Con sede en la Ciudad de México y una logística optimizada, entregamos y montamos proyectos en los 32 estados del país.
                                </p>
                            </div>

                            <div className="grid gap-8">
                                {contactInfo.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex gap-6 group p-6 rounded-3xl hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[var(--brand-navy)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-bold tracking-widest text-gray-300 uppercase mb-2">{item.label}</h4>
                                            {item.href ? (
                                                <a href={item.href} className="text-xl font-serif text-gray-900 hover:text-[var(--accent)] transition-colors block mb-1">
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <span className="text-xl font-serif text-gray-900 block mb-1">{item.value}</span>
                                            )}
                                            <p className="text-sm text-gray-400 font-light">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Decorative Brand Element */}
                            <div className="relative pt-12">
                                <div className="absolute top-0 left-0 w-12 h-px bg-gray-100" />
                                <div className="flex items-center gap-12 opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 cursor-default">
                                    <span className="font-serif text-4xl text-gray-900">RESTO</span>
                                    <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                                    <span className="font-serif text-4xl text-gray-900">MUEBLE</span>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: The Form */}
                        <div className="lg:col-span-7">
                            <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onSubmit={handleSubmit}
                                        className="bg-[#FAFAF8] rounded-[2.5rem] p-8 md:p-16 shadow-box border border-white"
                                    >
                                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Nombre Completo</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-all shadow-sm"
                                                    placeholder="Ej. Roberto Sánchez"
                                                    value={formData.nombre}
                                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Correo Electrónico</label>
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-all shadow-sm"
                                                    placeholder="roberto@empresa.com"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Teléfono de Contacto</label>
                                                <input
                                                    type="tel"
                                                    className="w-full bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-all shadow-sm"
                                                    placeholder="+52 55 ..."
                                                    value={formData.telefono}
                                                    onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Tipo de Proyecto</label>
                                                <select
                                                    className="w-full bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[var(--accent)] focus:bg-white appearance-none cursor-pointer transition-all shadow-sm"
                                                    value={formData.servicio}
                                                    onChange={e => setFormData({ ...formData, servicio: e.target.value })}
                                                >
                                                    <option value="restaurante">Restaurante / Bar</option>
                                                    <option value="hotel">Hotelería</option>
                                                    <option value="cafeteria">Cafetería Boutique</option>
                                                    <option value="corporativo">Corporativo / Oficina</option>
                                                    <option value="residencial">Venta Residencial</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-10">
                                            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Cuéntanos sobre tu espacio</label>
                                            <textarea
                                                rows={5}
                                                required
                                                className="w-full bg-white/50 backdrop-blur-sm border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[var(--accent)] focus:bg-white transition-all resize-none shadow-sm"
                                                placeholder="Ej. Necesito 20 mesas y 80 sillas para un restaurante en la Condesa, CDMX..."
                                                value={formData.mensaje}
                                                onChange={e => setFormData({ ...formData, mensaje: e.target.value })}
                                            />
                                        </div>

                                        {errorMsg && (
                                            <p className="text-red-500 text-xs font-medium mb-4 text-center">{errorMsg}</p>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-5 bg-[var(--brand-navy)] text-white text-[10px] font-bold tracking-[0.3em] uppercase rounded-full hover:bg-[var(--accent)] transition-all shadow-xl shadow-[var(--brand-navy)]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? "Enviando..." : "Solicitar Cotización"}
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-[var(--brand-navy)] rounded-[2.5rem] p-16 md:p-24 text-center relative overflow-hidden"
                                    >
                                        <div className="relative z-10">
                                            <div className="w-20 h-20 rounded-full bg-[var(--accent)] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-[var(--accent)]/40">
                                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            </div>
                                            <h3 className="text-4xl md:text-5xl font-serif text-white mb-6">¡Propuesta en camino!</h3>
                                            <p className="text-white/60 text-lg font-light leading-relaxed mb-12">
                                                Gracias por confiar en Restomueble. Un asesor especializado revisará los detalles de tu proyecto y te contactará en las próximas 24 horas hábiles.
                                            </p>
                                            <button
                                                onClick={() => setIsSubmitted(false)}
                                                className="text-[10px] font-bold tracking-widest text-white uppercase border-b border-[var(--accent)] pb-1 transition-colors hover:text-[var(--accent)]"
                                            >
                                                Enviar otro mensaje
                                            </button>
                                        </div>
                                        {/* Decorative Blur */}
                                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[var(--accent)] opacity-10 rounded-full blur-[100px]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Placeholder / Brand Reach */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="aspect-[21/9] relative rounded-[3rem] overflow-hidden grayscale opacity-50 contrast-125 border border-gray-200">
                        <Image
                            src="/images/map-texture.jpg"
                            alt="Mapa de cobertura"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center px-6">
                                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-900 mb-4 block">Logística Garantizada</span>
                                <p className="text-4xl md:text-6xl font-serif text-gray-900 opacity-20">COBERTURA NACIONAL</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
