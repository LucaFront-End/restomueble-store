import { Suspense } from "react";
import { getAllProducts } from "@/lib/wixProducts";
import { getStorePageContent } from "@/lib/wixCmsStore";
import { CatalogueHero } from "@/components/catalogue/CatalogueHero";
import TiendaProductGrid from "@/components/catalogue/TiendaProductGrid";
import { Metadata } from "next";

export const revalidate = 60;

async function getProducts() {
    try {
        return await getAllProducts();
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        return [];
    }
}

export const metadata: Metadata = {
    title: "Tienda Josepja | Mesas y sillas para restaurante en CDMX | Mobiliario para restaurantes",
    description: "Compra en Josepja Mobiliario para restaurantes: Mesas para restaurantes, mesas para cafetería y Mesas y Sillas para restaurante de alta resistencia en CDMX. Envíos a toda la República.",
};

export default async function TiendaPage() {
    const [products, content] = await Promise.all([
        getProducts(),
        getStorePageContent(),
    ]);

    return (
        <main className="bg-white min-h-screen">
            {/* 1. Hero — título y descripción vienen del CMS */}
            <CatalogueHero
                title={content.titulo}
                subtitle={content.descripcion}
                productCount={products.length}
            />

            {/* 2. Category Navigation + Search + Product Grid */}
            <Suspense fallback={null}>
                <TiendaProductGrid products={products} />
            </Suspense>
        </main>
    );
}
