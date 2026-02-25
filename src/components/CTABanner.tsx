"use client";

import Link from "next/link";

interface CTABannerProps {
    content?: {
        titulo?: string;
        subtitulo?: string;
        telefono?: string;
        whatsapp?: string;
    };
}

const CTABanner = ({ content = {} }: CTABannerProps) => {
    const titulo = content.titulo || "¿Listo para transformar tu espacio?";
    const subtitulo = content.subtitulo || "Solicita una cotización personalizada para tu restaurante o proyecto corporativo. Descuentos por volumen.";
    const telefono = content.telefono || "+52 55 1234 5678";
    const whatsapp = content.whatsapp || "5215512345678";

    return (
        <section className="section bg-[var(--accent-light)] relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[var(--accent)] opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-[var(--accent)] opacity-10 blur-3xl"></div>

            <div className="container relative z-10">
                <div className="bg-white rounded-[var(--radius-xl)] shadow-xl p-8 md:p-12 lg:p-16 text-center border border-[var(--border)] max-w-4xl mx-auto">
                    <span className="label block mb-4">Atención Personalizada</span>

                    <h2 className="heading-lg mb-6 leading-tight">
                        {titulo}
                    </h2>

                    <p className="text-body mb-10 max-w-2xl mx-auto">
                        {subtitulo}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={`https://wa.me/${whatsapp}?text=Hola, me interesa una cotización.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-lg shadow-lg shadow-[var(--accent)]/20"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Cotizar por WhatsApp
                        </a>
                        <a href={`tel:${telefono.replace(/\s/g, "")}`} className="btn btn-outline btn-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                            </svg>
                            Llamar ahora
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTABanner;
