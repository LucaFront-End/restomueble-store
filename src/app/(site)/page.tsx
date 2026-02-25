import { getWixServerClient } from "@/lib/wixClientServer";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryBento from "@/components/CategoryBento";
import ProductDiscovery from "@/components/ProductDiscovery";
import BentoBenefits from "@/components/BentoBenefits";
import LogoCarousel from "@/components/LogoCarousel";
import ProjectShowcase from "@/components/ProjectShowcase";
import AboutSticky from "@/components/AboutSticky";
import ConciergeCTA from "@/components/ConciergeCTA";
import { products } from "@wix/stores";

export const revalidate = 60; // Revalidar cada 60 segundos para reflejar cambios del CMS rápidamente

export default async function Home() {
    const wixClient = getWixServerClient();
    let initialProducts: products.Product[] = [];
    let cmsContent: any = {};

    // Fetch products
    try {
        const result = await wixClient.products.queryProducts().limit(50).find();
        initialProducts = result.items;
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

    return (
        <main className="bg-white min-h-screen">
            {/* Hero Section */}
            <HeroCarousel />

            {/* Líneas de Producto - Bento Grid */}
            <CategoryBento content={cmsContent} />

            {/* Product Discovery - Masonry Grid con filtros */}
            <ProductDiscovery initialProducts={initialProducts} content={cmsContent} />

            {/* Beneficios - Pills */}
            <BentoBenefits content={cmsContent} />

            {/* Logo Carousel - Clientes */}
            <LogoCarousel content={cmsContent} />

            {/* Project Showcase - Espacios que transformamos */}
            <ProjectShowcase content={cmsContent} />

            {/* About Sticky - Historia/Misión/Valores */}
            <AboutSticky content={cmsContent} />

            {/* CTA - Design Concierge */}
            <ConciergeCTA content={cmsContent} />
        </main>
    );
}
