import { getAllLandings } from "@/lib/wixCmsLandings";
import { getAllStoreLandings } from "@/lib/wixCmsStoreLandings";
import landingsDataFallback from "@/data/landings.json";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Zonas de Servicio | Josepja — Mobiliario para Restaurantes",
    description:
        "Encuentra mobiliario para restaurantes en tu zona. Josepja ofrece mesas, sillas, conjuntos y booths con envío a toda la República Mexicana.",
    robots: { index: true, follow: true },
};

/* ── SVG Icons ── */
const MapPinIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const ArrowIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.33 0-4.502-.753-6.258-2.032l-.438-.328-3.205 1.074 1.074-3.205-.328-.438A9.935 9.935 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
    </svg>
);

const StoreIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

export default async function ZonasPage() {
    // Fetch both CMS collections
    const [cmsLandings, storeLandings] = await Promise.all([
        getAllLandings(),
        getAllStoreLandings(),
    ]);

    const landings = cmsLandings.length > 0 ? cmsLandings : landingsDataFallback.map((l) => ({
        ...l,
        _id: l.slug,
        keywords: "",
        whatsapp: "",
        faqs: "",
        tituloSeo: "",
        tituloMetadescripcion: "",
    }));

    const defaultWhatsapp = "https://wa.me/525610174742?text=Hola,%20me%20interesa%20cotizar%20mobiliario";

    return (
        <main className="min-h-screen bg-gray-50">

            {/* ═══ HERO ═══ */}
            <section className="relative bg-gray-900 text-white py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
                />
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-amber-400 bg-amber-400/10 border border-amber-400/20 px-5 py-1.5 rounded-full mb-6">
                        Cobertura Nacional
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
                        Mobiliario para restaurantes en{" "}
                        <span className="text-amber-400">tu zona</span>
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                        Josepja ofrece mesas, sillas, conjuntos y booths para restaurantes con envíos a toda la República.
                        Encuentra tu zona y cotiza sin compromiso.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">

                {/* ═══ REPEATER 1: LANDINGS SEO (Inicio) ═══ */}
                <section>
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                <MapPinIcon />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Mobiliario por Ciudad
                            </h2>
                        </div>
                        <p className="text-gray-500 ml-[52px]">
                            <strong className="text-amber-600">{landings.length}</strong> ciudades con cobertura directa
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {landings.map((landing) => {
                            const waLink = landing.whatsapp?.startsWith("http")
                                ? landing.whatsapp
                                : defaultWhatsapp;

                            return (
                                <div
                                    key={landing._id || landing.slug}
                                    className="group relative bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-gray-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
                                >
                                    {/* Gold accent line on hover */}
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Header */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center shrink-0">
                                            <MapPinIcon />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-lg leading-snug truncate">
                                                {landing.ciudad || landing.titulo}
                                            </h3>
                                            <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                                                {landing.estado}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Excerpt */}
                                    {landing.descripcion && (
                                        <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-3">
                                            {landing.descripcion}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/${landing.slug}`}
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 hover:-translate-y-0.5"
                                        >
                                            <ArrowIcon />
                                            Ver zona
                                        </Link>
                                        <a
                                            href={waLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider bg-[#25d366] text-white rounded-xl hover:bg-[#1fb855] transition-all duration-200 hover:-translate-y-0.5"
                                        >
                                            <WhatsAppIcon />
                                            WhatsApp
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ═══ REPEATER 2: TIENDAS SEO ═══ */}
                {storeLandings.length > 0 && (
                    <section>
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <StoreIcon />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Tiendas por Estado
                                </h2>
                            </div>
                            <p className="text-gray-500 ml-[52px]">
                                <strong className="text-blue-600">{storeLandings.length}</strong> tiendas con catálogo completo
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {storeLandings.map((store) => {
                                const waLink = store.urlDeWhatsapp?.startsWith("http")
                                    ? store.urlDeWhatsapp
                                    : defaultWhatsapp;

                                return (
                                    <div
                                        key={store._id || store.slug}
                                        className="group relative bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:border-gray-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
                                    >
                                        {/* Blue accent line on hover */}
                                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Header */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-500 flex items-center justify-center shrink-0">
                                                <StoreIcon />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-900 text-lg leading-snug truncate">
                                                    {store.titulo}
                                                </h3>
                                                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                                                    {store.slug}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Excerpt */}
                                        {store.descripcion && (
                                            <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-3">
                                                {store.descripcion}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/${store.slug}`}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 hover:-translate-y-0.5"
                                            >
                                                <ArrowIcon />
                                                Ver tienda
                                            </Link>
                                            <a
                                                href={waLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider bg-[#25d366] text-white rounded-xl hover:bg-[#1fb855] transition-all duration-200 hover:-translate-y-0.5"
                                            >
                                                <WhatsAppIcon />
                                                WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
