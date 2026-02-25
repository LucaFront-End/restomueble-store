import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllLandings, getLandingBySlug } from "@/lib/wixCmsLandings";
import { getAllStoreLandings, getStoreLandingBySlug } from "@/lib/wixCmsStoreLandings";
import landingsDataFallback from "@/data/landings.json";
import Link from "next/link";
import { getWixServerClient } from "@/lib/wixClientServer";
import Image from "next/image";
import { products } from "@wix/stores";
import * as motion from "framer-motion/client";
import TestimonialMarquee from "@/components/TestimonialMarquee";
import { CatalogueHero } from "@/components/catalogue/CatalogueHero";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { COLLECTIONS } from "@/lib/wixCollections";

export const revalidate = 3600;

// Generar rutas estáticas para AMBOS tipos de páginas
export async function generateStaticParams() {
    const [cmsLandings, storeLandings] = await Promise.all([
        getAllLandings(),
        getAllStoreLandings(),
    ]);

    const landingSlugs = cmsLandings.length > 0
        ? cmsLandings.map((l) => ({ landing: l.slug }))
        : landingsDataFallback.map((l) => ({ landing: l.slug }));

    const storeSlugs = storeLandings.map((s) => ({ landing: s.slug }));

    return [...landingSlugs, ...storeSlugs];
}

// Metadata dinámica para SEO
export async function generateMetadata({ params }: { params: Promise<{ landing: string }> }): Promise<Metadata> {
    const { landing: slug } = await params;

    // 1. Check TiendasSEO first
    const tienda = await getStoreLandingBySlug(slug);
    if (tienda) {
        return {
            title: `${tienda.titulo} | Josepja`,
            description: tienda.descripcion,
            openGraph: { title: tienda.titulo, description: tienda.descripcion, locale: "es_MX" },
        };
    }

    // 2. Then LandingsSEO
    let landing = await getLandingBySlug(slug);
    if (!landing) {
        const fallback = landingsDataFallback.find((l) => l.slug === slug);
        if (fallback) {
            landing = { _id: "", ...fallback, keywords: fallback.keywords.join(", ") };
        }
    }
    if (!landing) return { title: "Página no encontrada" };
    return {
        title: `${landing.titulo} | Josepja`,
        description: landing.descripcion,
        keywords: landing.keywords,
        openGraph: { title: landing.titulo, description: landing.descripcion, locale: "es_MX" },
    };
}

async function getAllProducts(): Promise<products.Product[]> {
    const wixClient = getWixServerClient();
    try {
        const result = await wixClient.products.queryProducts().limit(100).find();
        return result.items;
    } catch {
        return [];
    }
}

async function getProductsForLanding(): Promise<products.Product[]> {
    const wixClient = getWixServerClient();
    try {
        const result = await wixClient.products.queryProducts().limit(4).find();
        return result.items;
    } catch {
        return [];
    }
}

interface LandingDataDisplay {
    slug: string;
    titulo: string;
    subtitulo: string;
    descripcion: string;
    ciudad: string;
    estado: string;
}

// Iconos SVG inline para beneficios
const IconTruck = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
);

const IconShield = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
);

const IconClock = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const IconWrench = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
);

export default async function LandingPage({ params }: { params: Promise<{ landing: string }> }) {
    const { landing: slug } = await params;

    // ─── TIENDA LANDING ─────────────────────────────────────────────────────────
    // If the slug exists in TiendasSEO, render the full product catalog
    const tiendaData = await getStoreLandingBySlug(slug);
    if (tiendaData) {
        const allProducts = await getAllProducts();
        return (
            <main className="bg-white min-h-screen">
                <CatalogueHero
                    title={tiendaData.titulo}
                    subtitle={tiendaData.descripcion}
                    productCount={allProducts.length}
                />
                {/* Category navigation */}
                <div className="sticky top-[80px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
                    <div className="container mx-auto max-w-7xl px-6">
                        <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
                            <span className="shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[var(--brand-navy)] text-white">
                                Todos
                            </span>
                            {COLLECTIONS.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/tienda/${cat.slug}`}
                                    className="shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Product grid */}
                <section className="py-16 md:py-24 px-6 bg-white">
                    <div className="container mx-auto max-w-7xl">
                        <div className="mb-12 flex justify-between items-center">
                            <span className="text-xs font-medium uppercase tracking-widest text-gray-400">Todas las colecciones</span>
                            <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
                                {allProducts.length} {allProducts.length === 1 ? "Pieza" : "Piezas"}
                            </span>
                        </div>
                        {allProducts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-20">
                                {allProducts.map((product, index) => (
                                    <ProductCard key={product._id} product={product} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-gray-50 rounded-2xl">
                                <p className="text-xl text-gray-400 font-light">No se encontraron productos.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        );
    }

    // ─── MARKETING LANDING ──────────────────────────────────────────────────────
    let landing: LandingDataDisplay | null = await getLandingBySlug(slug);

    if (!landing) {
        const fallback = landingsDataFallback.find((l) => l.slug === slug);
        if (fallback) {
            landing = {
                slug: fallback.slug,
                titulo: fallback.titulo,
                subtitulo: fallback.subtitulo,
                descripcion: fallback.descripcion,
                ciudad: fallback.ciudad,
                estado: fallback.estado,
            };
        }
    }

    if (!landing) {
        notFound();
    }

    const fetchedProducts = await getProductsForLanding();

    return (
        <main className="min-h-screen bg-white">

            {/* ============================================
                HERO - Impactante con imagen de fondo
                ============================================ */}
            <section className="relative min-h-[85vh] flex items-center bg-gray-900 overflow-hidden">
                {/* Imagen de fondo */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-restaurant.png"
                        alt={`Mobiliario para restaurantes en ${landing.ciudad}`}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
                </div>

                <div className="container relative z-10 py-32">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20"
                        >
                            <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
                            <span className="text-white text-sm font-medium tracking-wide">
                                Envío disponible a {landing.ciudad}, {landing.estado}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold !text-white mb-6 leading-[1.1] drop-shadow-lg"
                        >
                            {landing.titulo}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl !text-gray-200 mb-10 max-w-2xl leading-relaxed drop-shadow-md"
                        >
                            {landing.subtitulo}. Más de <strong className="!text-white">30 años</strong> equipando restaurantes, cafeterías y hoteles en todo México.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            {/* Buttons... */}
                            <Link
                                href="/productos"
                                className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white px-8 py-4 font-semibold transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
                            >
                                Ver Catálogo Completo
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <a
                                href="https://wa.me/525512345678?text=Hola,%20me%20interesa%20cotizar%20mobiliario"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white border border-white/40 px-8 py-4 font-semibold transition-all shadow-lg text-shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                Cotizar por WhatsApp
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ============================================
                BENEFICIOS - Barra de confianza
                ============================================ */}
            <section className="py-16 bg-gray-50 border-b border-gray-100">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: <IconTruck />, title: "Envío a Todo México", desc: `Llegamos a ${landing.estado}` },
                            { icon: <IconShield />, title: "Garantía 5 Años", desc: "Uso rudo garantizado" },
                            { icon: <IconClock />, title: "+30 Años", desc: "Experiencia comprobada" },
                            { icon: <IconWrench />, title: "Personalización", desc: "Medidas y acabados" },
                        ].map((benefit, i) => (
                            <div key={i} className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md text-[var(--accent)] mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                                <p className="text-sm text-gray-500">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
                CONTENIDO SEO - Descripción detallada
                ============================================ */}
            <section className="py-24 bg-white">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <span className="text-[var(--accent)] font-semibold text-sm tracking-wider uppercase mb-4 block">
                                ¿Por qué Restomueble?
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                Fabricación Especializada para {landing.ciudad}
                            </h2>
                            <div className="prose prose-lg text-gray-600 mb-8">
                                <p>{landing.descripcion}</p>
                                <p>
                                    Entendemos las necesidades del sector restaurantero en <strong>{landing.estado}</strong>.
                                    Por eso fabricamos mobiliario que combina <strong>diseño atractivo</strong> con
                                    <strong> durabilidad industrial</strong>, pensado para soportar el ritmo
                                    de un servicio intenso sin perder estética.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { num: "01", title: "Materiales Premium", desc: "Acero calibre 16, maderas de pino y encino, acabados resistentes a manchas." },
                                    { num: "02", title: "Diseño Funcional", desc: "Sillas apilables, mesas con bases reforzadas, bancos de altura ergonómica." },
                                    { num: "03", title: "Instalación Incluida", desc: `En pedidos mayores, incluimos instalación en ${landing.ciudad} sin costo adicional.` },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <span className="text-[var(--accent)] font-bold text-xl">{item.num}</span>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                            <p className="text-sm text-gray-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="relative">
                                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/hero-luxury.png"
                                        alt="Mobiliario de calidad"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                {/* Badge flotante */}
                                <div className="absolute -bottom-6 -left-6 bg-[var(--accent)] text-white p-6 rounded-xl shadow-xl">
                                    <div className="text-4xl font-bold">30+</div>
                                    <div className="text-sm opacity-90">Años de experiencia</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                PRODUCTOS DESTACADOS
                ============================================ */}
            {fetchedProducts.length > 0 && (
                <section className="py-24 bg-gray-50">
                    <div className="container">
                        <div className="text-center mb-16">
                            <span className="text-[var(--accent)] font-semibold text-sm tracking-wider uppercase mb-4 block">
                                Catálogo Destacado
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Lo más popular en {landing.ciudad}
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Explora nuestra selección de muebles más solicitados por restaurantes y cafeterías de {landing.estado}.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {fetchedProducts.map((product: products.Product) => (
                                <Link
                                    key={product._id}
                                    href="/productos"
                                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                        <Image
                                            src={product.media?.mainMedia?.image?.url || "/hero-product.png"}
                                            alt={product.name || "Producto"}
                                            fill
                                            className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[var(--accent)] transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-lg font-semibold text-[var(--accent)]">
                                            {product.priceData?.formatted?.price || "Consultar precio"}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href="/productos"
                                className="inline-flex items-center gap-2 text-[var(--accent)] font-semibold hover:gap-4 transition-all"
                            >
                                Ver catálogo completo
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ============================================
                TESTIMONIOS / SOCIAL PROOF (Marquee Infinito)
                ============================================ */}
            <section className="py-24 bg-gray-50 overflow-hidden">
                <div className="container mb-8">
                    <div className="text-center">
                        <span className="text-[var(--accent)] font-semibold text-sm tracking-wider uppercase mb-4 block">
                            Clientes Satisfechos
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Confían en Nosotros
                        </h2>
                    </div>
                </div>

                <TestimonialMarquee />
            </section>

            {/* ============================================
                CTA FINAL
                ============================================ */}
            <section className="py-24 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="/hero-luxury.png"
                        alt=""
                        fill
                        className="object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="container relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold !text-white mb-6 drop-shadow-lg p-2">
                        ¿Listo para equipar tu restaurante en {landing.ciudad}?
                    </h2>
                    <p className="text-xl !text-gray-300 mb-10 max-w-2xl mx-auto drop-shadow-md">
                        Solicita una cotización sin compromiso. Envío e instalación disponible en todo {landing.estado}.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/productos"
                            className="inline-flex items-center justify-center bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white px-10 py-5 font-bold text-lg transition-all hover:scale-105 shadow-xl"
                        >
                            Explorar Catálogo
                        </Link>
                        <a
                            href="https://wa.me/525512345678?text=Hola,%20me%20interesa%20cotizar%20mobiliario%20para%20mi%20restaurante"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-10 py-5 font-bold text-lg transition-all hover:scale-105 shadow-xl"
                        >
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            WhatsApp Directo
                        </a>
                    </div>
                </div>
            </section>

            {/* ============================================
                FAQ - Preguntas Frecuentes SEO
                ============================================ */}
            <section className="py-24 bg-gray-50">
                <div className="container max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Preguntas Frecuentes
                        </h2>
                        <p className="text-gray-600">
                            Resolvemos tus dudas sobre mobiliario para restaurantes en {landing.ciudad}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: `¿Hacen envíos a ${landing.ciudad}?`,
                                a: `Sí, realizamos envíos a ${landing.ciudad} y todo ${landing.estado}. El tiempo de entrega aproximado es de 5-10 días hábiles dependiendo del volumen del pedido.`
                            },
                            {
                                q: "¿Qué garantía tienen los muebles?",
                                a: "Todos nuestros muebles tienen garantía de 5 años contra defectos de fabricación. Utilizamos materiales de primera calidad: acero calibre 16, soldadura MIG y acabados resistentes a la corrosión."
                            },
                            {
                                q: "¿Puedo personalizar los muebles?",
                                a: "Absolutamente. Ofrecemos personalización de colores, medidas y acabados. Contáctanos para discutir tu proyecto y te enviaremos un presupuesto detallado."
                            },
                            {
                                q: "¿Cuál es el pedido mínimo?",
                                a: "No tenemos pedido mínimo para compras de catálogo. Para proyectos personalizados, el mínimo depende del tipo de producto (generalmente 10 piezas)."
                            }
                        ].map((faq, i) => (
                            <details key={i} className="group bg-white rounded-xl shadow-sm">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <h3 className="font-semibold text-gray-900 pr-4">{faq.q}</h3>
                                    <span className="text-[var(--accent)] group-open:rotate-45 transition-transform">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </span>
                                </summary>
                                <div className="px-6 pb-6 text-gray-600">
                                    <p>{faq.a}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
