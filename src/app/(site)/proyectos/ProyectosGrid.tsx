"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectData {
    id: number;
    name: string;
    location: string;
    category: string;
    categoryLabel: string;
    image: string;
    tags: string[];
    featured?: boolean;
    className: string;
    // Extra CMS fields
    _cmsId?: string;
    excerpt?: string;
    gallery?: any;
    whatsapp?: string;
    linkedProducts?: { name: string; id: string }[];
}

export default function ProyectosGrid({ projects }: { projects: ProjectData[] }) {
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

    return (
        <>
            {/* Grid de Proyectos - Bento Grid Layout */}
            <section className="py-20 px-6">
                <div className="max-w-[1400px] mx-auto">
                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 gap-8 mb-20 border-b border-gray-100 pb-12">
                        {[
                            { value: "+500", label: "Proyectos" },
                            { value: "32", label: "Estados" },
                            { value: "30+", label: "Años" },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl md:text-6xl font-serif text-[var(--brand-navy)] mb-2">{stat.value}</div>
                                <div className="text-[10px] md:text-xs text-gray-400 tracking-widest uppercase font-bold">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[300px] gap-6">
                        {projects.map((project, idx) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                onClick={() => setSelectedProject(project)}
                                className={`relative group rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ${project.className}`}
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={project.image}
                                        alt={project.name}
                                        fill
                                        className="object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                                    {/* Overlay Content */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <span className="px-3 py-1 bg-black/30 backdrop-blur-md border border-white/10 rounded-full text-white text-[9px] font-bold tracking-[0.2em] uppercase">
                                                {project.categoryLabel}
                                            </span>
                                        </div>

                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                            <h3 className={`font-serif text-white mb-2 drop-shadow-lg leading-tight ${project.className?.includes('col-span-2') ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                                                {project.name}
                                            </h3>
                                            {project.location && (
                                                <div className="flex items-center gap-2 text-[var(--accent)] text-xs md:text-sm mb-4 font-medium">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {project.location}
                                                </div>
                                            )}
                                            <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                                                {project.tags.map((tag, tIdx) => (
                                                    <span key={tIdx} className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white/90 text-[8px] font-medium uppercase tracking-wider">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── PROJECT DETAIL POPUP ──── */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
                        onClick={() => setSelectedProject(null)}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-white rounded-[2rem] overflow-hidden max-w-3xl w-full max-h-[90vh] shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Hero Image */}
                            <div className="relative h-64 md:h-80 w-full">
                                <Image
                                    src={selectedProject.image}
                                    alt={selectedProject.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-6 left-8 right-8">
                                    <span className="px-3 py-1 bg-[var(--accent)] rounded-full text-white text-[9px] font-bold tracking-[0.2em] uppercase mb-3 inline-block">
                                        {selectedProject.categoryLabel}
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-serif text-white drop-shadow-lg">
                                        {selectedProject.name}
                                    </h2>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 md:p-10 overflow-y-auto max-h-[calc(90vh-20rem)]">
                                {/* Location & Category */}
                                <div className="flex flex-wrap gap-4 mb-6">
                                    {selectedProject.location && (
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {selectedProject.location}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        {selectedProject.categoryLabel}
                                    </div>
                                </div>

                                {/* Excerpt */}
                                {selectedProject.excerpt && (
                                    <p className="text-gray-600 leading-relaxed mb-8">{selectedProject.excerpt}</p>
                                )}

                                {/* Gallery (when available from CMS) */}
                                {selectedProject.gallery && Array.isArray(selectedProject.gallery) && selectedProject.gallery.length > 0 && (
                                    <div className="mb-8">
                                        <h4 className="text-[10px] font-bold tracking-widest text-gray-300 uppercase mb-4">Galería</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {selectedProject.gallery.map((img: any, gIdx: number) => {
                                                const src = typeof img === "string" ? img : img?.src || img?.url || "";
                                                if (!src) return null;
                                                return (
                                                    <div key={gIdx} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                                                        <Image
                                                            src={src}
                                                            alt={`${selectedProject.name} - foto ${gIdx + 1}`}
                                                            fill
                                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Linked Products (multi-reference) */}
                                {selectedProject.linkedProducts && selectedProject.linkedProducts.length > 0 && (
                                    <div className="mb-8">
                                        <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Mobiliario utilizado</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {selectedProject.linkedProducts.map((product, pIdx) => (
                                                <Link
                                                    key={pIdx}
                                                    href="/productos"
                                                    className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all group"
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 group-hover:border-[var(--accent)] transition-colors">
                                                        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 group-hover:text-[var(--brand-navy)] transition-colors">{product.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {selectedProject.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {selectedProject.tags.map((tag, tIdx) => (
                                            <span key={tIdx} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-gray-600 text-[10px] font-bold tracking-wider uppercase">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* WhatsApp CTA */}
                                <div className="flex gap-4">
                                    {selectedProject.whatsapp && (
                                        <a
                                            href={selectedProject.whatsapp}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-green-600 transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
                                            WhatsApp
                                        </a>
                                    )}
                                    <Link
                                        href="/contacto"
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--brand-navy)] text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-[var(--accent)] transition-all"
                                    >
                                        Cotizar Proyecto Similar
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Servicios para Proyectos */}
            <section className="py-32 bg-[#F8F6F3] overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="order-2 lg:order-1"
                        >
                            <span className="text-xs font-bold tracking-[0.3em] text-[var(--accent)] uppercase mb-6 block">Soluciones B2B</span>
                            <h2 className="text-4xl md:text-6xl font-serif text-gray-900 mb-8 leading-[1.1]">
                                Servicios especializados para la industria <em className="italic text-[var(--brand-navy)]">Contract</em>
                            </h2>
                            <div className="space-y-10">
                                {[
                                    { title: "Asesoría Técnica", desc: "Selección de materiales y acabados de alto tráfico según normativas." },
                                    { title: "Planificación de Espacios", desc: "Optimización de layouts para maximizar el aforo y flujo operativo." },
                                    { title: "Fabricación a Medida", desc: "Desarrollo de prototipos exclusivos para tu marca o proyecto." },
                                    { title: "Logística Nacional", desc: "Entrega e instalación garantizada en cualquier punto de la República." }
                                ].map((serv, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[var(--brand-navy)] shadow-sm group-hover:bg-[var(--accent)] group-hover:text-white group-hover:border-[var(--accent)] transition-all duration-300 shrink-0">
                                            <span className="font-serif text-xl">{i + 1}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif text-gray-900 mb-2 group-hover:text-[var(--brand-navy)] transition-colors">{serv.title}</h3>
                                            <p className="text-gray-500 font-light text-sm leading-relaxed">{serv.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="order-1 lg:order-2 relative"
                        >
                            <div className="aspect-[4/5] relative rounded-[2rem] overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/projects/cafe.jpg"
                                    alt="Servicio Josepja"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                            </div>
                            <div className="absolute -top-10 -left-10 w-full h-full border border-[var(--accent)]/30 rounded-[2rem] -z-10 hidden md:block" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-white text-center">
                <div className="container px-6 mx-auto max-w-4xl">
                    <h2 className="text-5xl md:text-8xl font-serif mb-8 text-gray-900 leading-[1.1]">
                        ¿Tu visión, nuestra <em className="text-[var(--accent)] not-italic">misión</em>?
                    </h2>
                    <p className="text-gray-500 text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-light">
                        Agendamos una consultoría gratuita para analizar tus necesidades de mobiliario y espacio.
                    </p>
                    <Link
                        href="/contacto"
                        className="group inline-flex items-center justify-center gap-4 px-12 py-5 bg-[var(--brand-navy)] text-white text-xs font-bold tracking-[0.3em] uppercase transition-all duration-500 hover:bg-[var(--accent)] hover:shadow-2xl hover:shadow-[var(--accent)]/40 rounded-full"
                    >
                        Iniciar Proyecto
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </>
    );
}
