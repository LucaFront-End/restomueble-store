import { getWixServerClient } from "@/lib/wixClientServer";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://restomueble.mx";

    // Páginas estáticas
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/productos`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/nosotros`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contacto`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // Páginas dinámicas de productos
    let productPages: MetadataRoute.Sitemap = [];

    try {
        const wixClient = getWixServerClient();
        const result = await wixClient.products.queryProducts().limit(100).find();

        productPages = result.items.map((product) => ({
            url: `${baseUrl}/producto/${product.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.error("Error generating product sitemap:", error);
    }

    return [...staticPages, ...productPages];
}
