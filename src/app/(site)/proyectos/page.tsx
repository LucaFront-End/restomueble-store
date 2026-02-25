"use client";

import SectionHero from "@/components/SectionHero";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";



const allProjects = [
    {
        id: 1,
        name: "La Terraza Gourmet",
        location: "Ciudad de México",
        category: "restaurante",
        categoryLabel: "RESTAURANTE FINE DINING",
        image: "/images/projects/project-07.png",
        tags: ["Mesas de roble", "Sillas tapizadas", "Barra central"],
        featured: true,
        className: "md:col-span-2 md:row-span-2"
    },
    {
        id: 2,
        name: "Café Central",
        location: "Monterrey",
        category: "cafeteria",
        categoryLabel: "CAFETERÍA BOUTIQUE",
        image: "/images/projects/project-13.png",
        tags: ["Mesas bistró", "Bancos altos", "Estantería"],
        className: "md:col-span-1 md:row-span-1"
    },
    {
        id: 3,
        name: "Taquería Premium",
        location: "Guadalajara",
        category: "restaurante",
        categoryLabel: "RESTAURANTE CASUAL",
        image: "/images/projects/project-12.png",
        tags: ["Bancos centrales", "Mesas altas", "Barra de bar"],
        className: "md:col-span-1 md:row-span-1"
    },
    {
        id: 4,
        name: "Hotel Riviera",
        location: "Cancún",
        category: "hotel",
        categoryLabel: "HOTEL BOUTIQUE",
        image: "/images/projects/project-09.png",
        tags: ["Lobby lounge", "Terraza exterior", "Sillas de playa"],
        featured: true,
        className: "md:col-span-1 md:row-span-2"
    },
    {
        id: 5,
        name: "Bistro Ámbar",
        location: "Puebla",
        category: "restaurante",
        categoryLabel: "RESTAURANTE FINE DINING",
        image: "/images/projects/project-01.png",
        tags: ["Sillas windsor", "Mesas madera", "Estación host"],
        className: "md:col-span-2 md:row-span-1"
    },
    {
        id: 6,
        name: "Tech Hub Office",
        location: "Querétaro",
        category: "corporativo",
        categoryLabel: "OFICINAS CORPORATIVAS",
        image: "/images/projects/project-14.png",
        tags: ["Escritorios", "Sillas ergonómicas", "Salas juntas"],
        className: "md:col-span-1 md:row-span-1"
    },
    {
        id: 7,
        name: "Restaurante Mar y Tierra",
        location: "Veracruz",
        category: "restaurante",
        categoryLabel: "MARISQUERÍA DE LUJO",
        image: "/images/projects/project-03.png",
        tags: ["Mesas exteriores", "Sillas textilene", "Parasoles"],
        featured: true,
        className: "md:col-span-1 md:row-span-1"
    },
    {
        id: 8,
        name: "Lounge 45",
        location: "San Pedro",
        category: "bar",
        categoryLabel: "BAR & LOUNGE",
        image: "/images/projects/project-15.png",
        tags: ["Sofás modulares", "Mesas bajas", "Iluminación"],
        className: "md:col-span-2 md:row-span-2"
    },
    {
        id: 9,
        name: "Hotel Casa Azul",
        location: "Mérida",
        category: "hotel",
        categoryLabel: "HACIENDA BOUTIQUE",
        image: "/images/projects/project-04.png",
        tags: ["Sillas rattan", "Mesas piedra", "Camastros"],
        className: "md:col-span-1 md:row-span-1"
    },
    {
        id: 10,
        name: "Firma Legal SC",
        location: "Santa Fe",
        category: "corporativo",
        categoryLabel: "CORPORATIVO LEGAL",
        image: "/images/projects/project-06.png",
        tags: ["Mesa conferencias", "Sillas piel", "Recepción"],
        className: "md:col-span-1 md:row-span-1"
    },
    {
        id: 11,
        name: "Panadería La Masa",
        location: "Roma Norte",
        category: "cafeteria",
        categoryLabel: "PANADERÍA ARTESANAL",
        image: "/images/projects/project-11.png",
        tags: ["Bancos madera", "Mesas comunales", "Vitrinas"],
        className: "md:col-span-1 md:row-span-2"
    },
    {
        id: 12,
        name: "Cantina La No. 20",
        location: "Polanco",
        category: "restaurante",
        categoryLabel: "CANTINA MODERNA",
        image: "/images/projects/project-02.png",
        tags: ["Sillas tradicionales", "Gabinetes", "Barra mármol"],
        featured: true,
        className: "md:col-span-2 md:row-span-1"
    },
];

export default function ProyectosPage() {

    return (
        <main className="bg-white min-h-screen pb-20">
            {/* Hero Refinado con Nueva Imagen */}
            <SectionHero
                overline="Portfolio"
                title={<>Espacios que <em className="text-[var(--accent)] not-italic">transformamos</em></>}
                subtitle="Más de 500 proyectos completados en restaurantes, hoteles y cafeterías de todo México. Cada espacio es una historia de diseño y calidad."
                backgroundImage="/images/projects-hero.jpg"
            />

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
                        {allProjects.map((project, idx) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.05 }}
                                viewport={{ once: true }}
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
                                            <div className="flex items-center gap-2 text-[var(--accent)] text-xs md:text-sm mb-4 font-medium">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {project.location}
                                            </div>
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
                                    src="/images/projects/cafe.jpg" // Placeholder reused (assuming duplicate was done)
                                    alt="Servicio Restomueble"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                            </div>
                            {/* Decorative element */}
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
        </main>
    );
}
