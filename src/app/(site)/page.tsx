import { getWixServerClient } from "@/lib/wixClientServer";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryBento from "@/components/CategoryBento";
import ProductDiscovery from "@/components/ProductDiscovery";
import BentoBenefits from "@/components/BentoBenefits";
import LogoCarousel from "@/components/LogoCarousel";
import ProjectShowcase from "@/components/ProjectShowcase";
import AboutSticky from "@/components/AboutSticky";
import ConciergeCTA from "@/components/ConciergeCTA";
import { getAllProducts } from "@/lib/wixProducts";
import { products } from "@wix/stores";


export const revalidate = 60; // Revalidar cada 60 segundos para reflejar cambios del CMS rápidamente

export default async function Home() {
    const wixClient = getWixServerClient();
    let initialProducts: products.Product[] = [];
    let cmsContent: any = {};
    let espaciosCms: any[] = [];
    let marcasCms: any[] = [];

    // Fetch ALL products (paginated — store has 150+ products)
    try {
        initialProducts = await getAllProducts();
    } catch (e) {
        console.error("[Home] Failed to fetch products", e);
    }

    // Fetch homepage CMS content (optional — falls back to empty if collection doesn't exist)
    try {
        const cmsResult = await wixClient.items.query("Homepage").find();
        if (cmsResult.items.length > 0) {
            const item = cmsResult.items[0] as any;
            cmsContent = (item.data && Object.keys(item.data).length > 0) ? item.data : item;
        }
    } catch {
        // Collection doesn't exist yet in Wix CMS — components use their default content
    }

    // Fetch Espacios from CMS (filtered by principal = true, sorted by orden, limit 4)
    try {
        const espaciosResult = await wixClient.items
            .query("Espacios")
            .eq("principal", true)
            .ascending("orden")
            .limit(4)
            .find();
        espaciosCms = espaciosResult.items.map((item: any) => {
            const d = item.data || item;
            return {
                titulo: d.titulo || "",
                subtitulo: d.subtitulo || "",
                imagen: d.imagen || "",
                enlace: d.enlace || "",
                orden: d.orden || 0,
            };
        });
    } catch {
        // Collection doesn't exist yet — CategoryBento uses hardcoded defaults
    }

    // Fetch client names from existing "Negocios ( Clientes)" CMS for the logo/brand carousel
    try {
        const negociosResult = await wixClient.items
            .query("NegociosClientes")
            .limit(50)
            .find();
        if (negociosResult.items.length > 0) {
            const allNames = negociosResult.items.map((item: any) => {
                const d = item.data || item;
                return d.title_fld || d.title || "";
            }).filter((n: string) => n.trim() !== "");

            // Split into two rows automatically
            const half = Math.ceil(allNames.length / 2);
            marcasCms = allNames.map((nombre: string, i: number) => ({
                nombre,
                fila: i < half ? 1 : 2,
                orden: i,
            }));
        }
    } catch {
        // Collection doesn't exist yet — LogoCarousel uses hardcoded defaults
    }

    return (
        <main className="bg-white min-h-screen">
            {/* Hero Section */}
            <HeroCarousel />

            {/* Líneas de Producto - Bento Grid */}
            <CategoryBento content={cmsContent} espacios={espaciosCms} />

            {/* Product Discovery - Masonry Grid con filtros */}
            <ProductDiscovery initialProducts={initialProducts} content={cmsContent} />

            {/* Beneficios - Pills */}
            <BentoBenefits content={cmsContent} />

            {/* Logo Carousel - Clientes */}
            <LogoCarousel content={cmsContent} marcas={marcasCms} />

            {/* Project Showcase - Espacios que transformamos (hidden temporarily) */}
            {/* <ProjectShowcase content={cmsContent} /> */}

            {/* About Sticky - Historia/Misión/Valores */}
            <AboutSticky content={cmsContent} />

            {/* CTA - Design Concierge */}
            <ConciergeCTA content={cmsContent} />
        </main>
    );
}

