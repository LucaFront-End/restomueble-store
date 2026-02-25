"use client";

import { Metadata } from "next";
import SectionHero from "@/components/SectionHero";
import AboutSticky from "@/components/AboutSticky";
import LogoCarousel from "@/components/LogoCarousel";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const valores = [
    {
        title: "Excelencia Artesanal",
        desc: "Cada pieza es terminada a mano por maestros carpinteros con décadas de oficio.",
        icon: "✨"
    },
    {
        title: "Durabilidad Extrema",
        desc: "Diseñamos para el uso rudo de la industria restaurantera sin sacrificar estética.",
        icon: "🛡️"
    },
    {
        title: "Compromiso Local",
        desc: "Fabricación 100% mexicana, apoyando el talento y la economía de nuestro país.",
        icon: "🇲🇽"
    },
    {
        title: "Innovación Funcional",
        desc: "Constantemente refinamos nuestros diseños para mejorar la ergonomía y operación.",
        icon: "📐"
    }
];

const hitos = [
    { year: "1994", event: "Fundación de Restomueble como taller artesanal en la CDMX." },
    { year: "2005", event: "Primera línea industrializada para cadenas de restaurantes." },
    { year: "2012", event: "Expansión a nivel nacional equipando hoteles premium en Cancún." },
    { year: "2024", event: "Lanzamiento de nuestra división de diseño digital y catálogo interactivo." }
];

export default function NosotrosPage() {
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <main className="bg-white min-h-screen">
            {/* Hero Refinado */}
            <SectionHero
                overline="Nuestra Historia"
                title={<>Más de <em className="text-[var(--accent)] not-italic">30 años</em> creando espacios memorables</>}
                subtitle="Desde nuestros inicios, hemos dedicado cada jornada a fabricar mobiliario que resiste al paso del tiempo y define la personalidad de los mejores restaurantes de México."
                backgroundImage="/images/about-hero-new.png" // Updated to New Image
            />

            {/* Misión & Visión Editorial */}
            <section className="py-24 md:py-40 px-6 overflow-hidden bg-white">
                <div className="container mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            style={{ y: y2 }}
                            className="relative"
                        >
                            <div className="aspect-[3/4] relative rounded-lg overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/about-craft-new.png" // Updated to New Image
                                    alt="Artesanía Restomueble"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-[1.5s]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                            </div>
                            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-3xl -z-10" />
                        </motion.div>

                        <div className="space-y-12">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="text-xs font-bold tracking-[0.3em] text-[var(--brand-navy)] uppercase block mb-6">El Propósito</span>
                                <h2 className="text-4xl md:text-6xl font-serif text-gray-900 leading-[1.1] mb-8">
                                    Elevar la <em className="italic text-[var(--accent)]">experiencia</em> gastronómica a través del diseño.
                                </h2>
                                <p className="text-xl text-gray-500 font-light leading-relaxed mb-12">
                                    Entendemos que un mueble no es solo un objeto funcional; es el soporte de momentos inolvidables. Trabajamos para que cada silla, mesa y barra cuente una leyenda de calidad y confort.
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-gray-100">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="text-5xl font-serif text-[var(--brand-navy)] mb-2">500+</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Negocios Equipados</div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="text-5xl font-serif text-[var(--brand-navy)] mb-2">32</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estados del País</div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Historia / AboutSticky */}
            <AboutSticky />

            {/* Nuestros Valores - Dark Mode High Contrast */}
            <section className="py-32 bg-[var(--brand-navy-deep)] text-white relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mb-24">
                        <span className="text-xs font-bold tracking-[0.3em] text-[var(--accent)] uppercase mb-6 block">Nuestra Filosofía</span>
                        <h2 className="text-5xl md:text-7xl font-serif mb-8 !text-white">Valores que <br /><em className="italic !text-white/80">trascienden.</em></h2>
                        <p className="text-xl !text-white/60 font-light max-w-2xl leading-relaxed">
                            Nuestra cultura de trabajo se basa en el respeto al oficio y la obsesión por el detalle. No hacemos muebles desechables; creamos patrimonio.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden">
                        {valores.map((v, i) => (
                            <div key={i} className="p-10 bg-[var(--brand-navy-deep)] hover:bg-white/5 transition-colors group relative overflow-hidden">
                                <div className="text-4xl mb-8 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                                    {v.icon === "🇲🇽" ? (
                                        <svg className="w-12 h-12 shadow-lg rounded-md" viewBox="0 0 64 64" fill="none">
                                            <rect width="64" height="64" rx="4" fill="#F5F5F5" />
                                            <path d="M0 0H21.3V64H0V0Z" fill="#006847" />
                                            <path d="M42.6 0H64V64H42.6V0Z" fill="#CE1126" />
                                            <path d="M32 36C34.2091 36 36 34.2091 36 32C36 29.7909 34.2091 28 32 28C29.7909 28 28 29.7909 28 32C28 34.2091 29.7909 36 32 36Z" fill="#5F4B35" />
                                            <path d="M32 20L34 26H30L32 20Z" fill="#5F4B35" />
                                        </svg>
                                    ) : v.icon}
                                </div>
                                <h3 className="text-2xl font-serif mb-4 !text-white group-hover:text-[var(--accent)] transition-colors relative z-10">{v.title}</h3>
                                <p className="text-sm !text-white/60 leading-relaxed font-light relative z-10">{v.desc}</p>
                                {v.icon === "🇲🇽" && (
                                    <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-500 rotate-12">
                                        <svg viewBox="0 0 64 64" fill="none">
                                            <path d="M32 64C49.6731 64 64 49.6731 64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64Z" fill="#CE1126" fillOpacity="0.2" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Background Noise/Texture effect could go here */}
            </section>

            {/* Trayectoria / Timeline */}
            <section className="py-32 px-6 bg-[#F8F6F3]">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-24">
                        <span className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase mb-4 block">Evolución</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Treinta años de <em className="italic text-[var(--brand-navy)]">historia</em></h2>
                    </div>

                    <div className="relative border-l border-gray-200 ml-6 md:ml-auto md:border-l-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:bottom-0 md:before:w-px md:before:bg-gray-200">
                        {hitos.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ margin: "-100px" }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className={`relative pl-12 pb-16 md:pb-24 md:pl-0 md:flex md:items-center md:justify-between ${i % 2 === 0 ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Dot */}
                                <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-[var(--brand-navy)] z-10 md:left-1/2 md:top-1/2 md:-translate-y-1/2 shadow-md" />

                                {/* Content */}
                                <div className={`md:w-[calc(50%-3rem)] ${i % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                                    <span className="text-6xl font-serif text-[var(--accent)] font-bold absolute -top-8 -left-4 -z-10 md:static md:block md:mb-2 md:text-8xl opacity-10 md:opacity-100 md:text-[var(--accent)]/30">{h.year}</span>
                                    <div className="relative pt-4 md:pt-0">
                                        <time className="text-2xl font-serif text-[var(--brand-navy)] font-bold mb-2 block md:hidden">{h.year}</time>
                                        <p className="text-lg text-gray-600 font-light leading-relaxed">{h.event}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block md:w-[calc(50%-3rem)]" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Clientes / Logos */}
            <div className="bg-white py-24 border-t border-gray-100">
                <LogoCarousel />
            </div>

            {/* CTA Final Refinado - Parallax */}
            <section className="min-h-[60vh] relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/about-workshop-new.png" // Updated to New Image
                        alt="Taller Restomueble"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[var(--brand-navy-deep)]/90" />
                </div>

                <div className="container px-6 mx-auto max-w-4xl text-center relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif mb-8 !text-white leading-tight"
                    >
                        Construyamos el <em className="text-[var(--accent)] not-italic">futuro</em>.
                    </motion.h2>
                    <p className="text-white/70 text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-light">
                        Nuestro equipo de diseño y fabricación está listo para materializar tu visión.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            href="/contacto"
                            className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-[var(--accent)] text-white text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-white hover:text-[var(--brand-navy)] shadow-2xl shadow-[var(--accent)]/20 rounded-full"
                        >
                            Cotizar Proyecto
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
