import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://restomueble.mx";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/carrito", "/gracias", "/api/"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
