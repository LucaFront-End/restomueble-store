import { Metadata } from "next";
import { getWixServerClient } from "@/lib/wixClientServer";
import NosotrosClient from "./NosotrosClient";

export const metadata: Metadata = {
    title: "Nosotros | Josepja Muebles | Mobiliario para Restaurantes",
    description: "Más de 30 años fabricando mobiliario industrial para restaurantes, hoteles y cafeterías en México. Conoce nuestra historia, valores y compromiso con la calidad.",
};

export const revalidate = 60;

export default async function NosotrosPage() {
    // Fetch client brands from CMS — same as home page
    let marcasCms: { nombre: string; fila: number; orden: number }[] = [];

    try {
        const wixClient = getWixServerClient();
        const negociosResult = await wixClient.items
            .query("NegociosClientes")
            .limit(50)
            .find();

        if (negociosResult.items.length > 0) {
            const allNames = negociosResult.items
                .map((item: any) => {
                    const d = item.data || item;
                    return d.title_fld || d.title || "";
                })
                .filter((n: string) => n.trim() !== "");

            const half = Math.ceil(allNames.length / 2);
            marcasCms = allNames.map((nombre: string, i: number) => ({
                nombre,
                fila: i < half ? 1 : 2,
                orden: i,
            }));
        }
    } catch {
        // CMS unavailable — LogoCarousel will use hardcoded defaults
    }

    return <NosotrosClient marcas={marcasCms} />;
}
