"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * FOOTER PREMIUM - "THE EDITORIAL STATEMENT"
 * 
 * Un diseño de pie de página inspirado en revistas de arquitectura y diseño de lujo.
 * Combina tipografía masiva con espacios en blanco (o negro) generosos y detalles 
 * minimalistas que refuerzan la identidad de Restomueble.
 */

const Footer = () => {
    const currentYear = new Date().getFullYear();

    // Enlaces de navegación organizados
    const navLinks = [
        { name: "Tienda", href: "/tienda" },
        { name: "Proyectos", href: "/proyectos" },
        { name: "Nosotros", href: "/nosotros" },
        { name: "Blog", href: "/blog" },
        { name: "Contacto", href: "/contacto" },
    ];

    const collections = [
        { name: "Sillas de Diseño", href: "/tienda/sillas" },
        { name: "Mesas para Restaurante", href: "/tienda/mesas" },
        { name: "Conjuntos", href: "/tienda/conjuntos" },
    ];

    return (
        <footer className="bg-[var(--brand-navy-deep)] text-white pt-16 md:pt-32 pb-8 md:pb-12 border-t border-white/5 font-[var(--font-body)]">
            <div className="container px-6 mx-auto">

                {/* BRAND STATEMENT: El cierre visual fuerte de la web */}
                <div className="mb-12 md:mb-24 border-b border-white/10 pb-12 md:pb-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-4 md:mb-6"
                            >
                                <img
                                    src="/logo-footer.png"
                                    alt="Josepja"
                                    className="h-36 md:h-48 w-auto object-contain"
                                />
                            </motion.div>
                            <p className="text-base md:text-xl text-gray-400 font-light leading-relaxed italic font-[var(--font-heading)]">
                                "Definiendo el carácter de los mejores espacios gastronómicos de México."
                            </p>
                        </div>

                        {/* Newsletter minimalista y elegante */}
                        <div className="w-full md:w-80">
                            <p className="text-xs uppercase tracking-[0.3em] mb-4 md:mb-6 font-bold" style={{ color: '#FFFFFF' }}>Newsletter</p>
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="Tu correo"
                                    className="w-full bg-transparent border-b border-white/20 py-3 md:py-4 pr-0 md:pr-28 focus:outline-none focus:border-[var(--accent)] transition-all duration-500 placeholder:text-gray-700 text-sm md:text-base min-h-[44px]"
                                />
                                <button className="mt-3 md:mt-0 md:absolute md:right-0 md:bottom-4 text-xs md:text-sm text-gray-400 group-hover:text-white transition-colors tracking-wider font-medium min-h-[44px] md:min-h-0">
                                    SUSCRIBIRSE →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GRID DE INFORMACIÓN PRINCIPAL */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-y-16 gap-x-8 mb-12 md:mb-24">

                    {/* Columna: Contacto Rápido */}
                    <div className="col-span-1 md:col-span-4 space-y-6 md:space-y-8">
                        <div>
                            <h4 className="text-xs uppercase tracking-[0.3em] mb-8 font-bold" style={{ color: '#FFFFFF' }}>Showroom México</h4>
                            <div className="space-y-4 text-gray-400 text-sm">
                                <p className="leading-relaxed hover:text-white transition-colors cursor-default">
                                    Av. Prado Norte 450, Lomas de Chapultepec,<br />
                                    CDMX, CP 11000
                                </p>
                                <p className="pt-2">
                                    <a href="mailto:hola@restomueble.mx" className="text-white hover:text-[var(--accent)] transition-colors border-b border-white/10 italic">
                                        hola@restomueble.mx
                                    </a>
                                </p>
                                <p className="font-mono text-[13px]">+52 55 8902 4431</p>
                            </div>
                        </div>

                        {/* Redes Sociales - Glassmorphism discreto */}
                        <div className="flex gap-4 pt-4">
                            {["IG", "LI", "FB", "PI"].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-11 h-11 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-[10px] font-bold hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all duration-500"
                                >
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Columna: Navegación */}
                    <div className="col-span-1 md:col-span-3 md:col-start-6 mt-4 md:mt-0">
                        <h4 className="text-xs uppercase tracking-[0.3em] mb-10 font-bold underline underline-offset-[12px] decoration-white/10" style={{ color: '#FFFFFF' }}>Navegación</h4>
                        <ul className="space-y-5">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex items-center gap-3">
                                        <span className="w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 group-hover:w-4" />
                                        <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                                            {link.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna: Colecciones */}
                    <div className="col-span-1 md:col-span-3">
                        <h4 className="text-xs uppercase tracking-[0.3em] mb-10 font-bold underline underline-offset-[12px] decoration-white/10" style={{ color: '#FFFFFF' }}>Colecciones</h4>
                        <ul className="space-y-5">
                            {collections.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex items-center gap-3">
                                        <span className="w-0 h-0.5 bg-[var(--accent)] transition-all duration-300 group-hover:w-4" />
                                        <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                                            {link.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* FOOTER BAR: El detalle final */}
                <div className="pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
                    <div className="flex items-center gap-10">
                        <p className="text-[10px] uppercase tracking-widest text-gray-600">
                            © {currentYear} Restomueble Group.
                        </p>
                        <div className="hidden md:flex gap-6">
                            <Link href="/privacidad" className="text-[10px] uppercase tracking-widest text-gray-600 hover:text-white transition-colors">Privacy</Link>
                            <Link href="/terminos" className="text-[10px] uppercase tracking-widest text-gray-600 hover:text-white transition-colors">Terms</Link>
                        </div>
                    </div>

                    {/* Badge de México mejorado */}
                    <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-white/5 bg-white/[0.02] grayscale hover:grayscale-0 transition-all duration-700">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">Hecho en México</span>
                        <div className="flex gap-0.5">
                            <div className="w-2.5 h-4 bg-[#006341]" />
                            <div className="w-2.5 h-4 bg-[#FFFFFF]" />
                            <div className="w-2.5 h-4 bg-[#C8102E]" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
