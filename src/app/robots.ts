import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://josepja.com";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/carrito", "/gracias", "/cuenta", "/api/", "/debug-collections"],
        },
        sitemap: [
            `${baseUrl}/sitemap.xml`,
            `${baseUrl}/sitemap-products`,
            `${baseUrl}/sitemap-landings`,
            `${baseUrl}/sitemap-tiendas`,
        ],
    };
}
