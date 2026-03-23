import SectionHero from "@/components/SectionHero";
import Link from "next/link";
import Image from "next/image";
import { getWixServerClient } from "@/lib/wixClientServer";
import { getWixImageUrl } from "@/lib/wixImageUrl";
import ProyectosGrid from "./ProyectosGrid";

export const revalidate = 60;

const defaultProjects = [
    {
        id: 1,
        name: "La Terraza Gourmet",
        location: "Ciudad de México",
        category: "restaurante",
        categoryLabel: "RESTAURANTE FINE DINING",
        image: "/images/projects/project-07.png",
        tags: ["Mesas de roble", "Sillas tapizadas", "Barra central"],
        featured: true,
        className: "md:col-span-2 md:row-span-2"
    },
    {
        id: 2,
        name: "Café Central",
        location: "Monterrey",
        category: "cafeteria",
        categoryLabel: "CAFETERÍA BOUTIQUE",
        image: "/images/projects/project-13.png",
        tags: ["Mesas bistró", "Bancos altos", "Estantería"],
        className: "md:col-span-1 md:row-span-1"
    },
    {
        id: 3,
        name: "Taquería Premium",
        location: "Guadalajara",
        category: "restaurante",
        categoryLabel: "RESTAURANTE CASUAL",
        image: "/images/projects/project-12.png",
        tags: ["Bancos centrales", "Mesas altas", "Barra de bar"],
        className: "md:col-span-1 md:row-span-1"
    },
    {
        id: 4,
        name: "Hotel Riviera",
        location: "Cancún",
        category: "hotel",
        categoryLabel: "HOTEL BOUTIQUE",
        image: "/images/projects/project-09.png",
        tags: ["Lobby lounge", "Terraza exterior", "Sillas de playa"],
        featured: true,
        className: "md:col-span-1 md:row-span-2"
    },
    {
        id: 5,
        name: "Bistro Ámbar",
        location: "Puebla",
        category: "restaurante",
        categoryLabel: "RESTAURANTE FINE DINING",
        image: "/images/projects/project-01.png",
        tags: ["Sillas windsor", "Mesas madera", "Estación host"],
        className: "md:col-span-2 md:row-span-1"
    },
    {
        id: 6,
        name: "Tech Hub Office",
        location: "Querétaro",
        category: "corporativo",
        categoryLabel: "OFICINAS CORPORATIVAS",
        image: "/images/projects/project-14.png",
        tags: ["Escritorios", "Sillas ergonómicas", "Salas juntas"],
        className: "md:col-span-1 md:row-span-1"
    },
    {
        id: 7,
        name: "Restaurante Mar y Tierra",
        location: "Veracruz",
        category: "restaurante",
        categoryLabel: "MARISQUERÍA DE LUJO",
        image: "/images/projects/project-03.png",
        tags: ["Mesas exteriores", "Sillas textilene", "Parasoles"],
        featured: true,
        className: "md:col-span-1 md:row-span-1"
    },
    {
        id: 8,
        name: "Lounge 45",
        location: "San Pedro",
        category: "bar",
        categoryLabel: "BAR & LOUNGE",
        image: "/images/projects/project-15.png",
        tags: ["Sofás modulares", "Mesas bajas", "Iluminación"],
        className: "md:col-span-2 md:row-span-2"
    },
    {
        id: 9,
        name: "Hotel Casa Azul",
        location: "Mérida",
        category: "hotel",
        categoryLabel: "HACIENDA BOUTIQUE",
        image: "/images/projects/project-04.png",
        tags: ["Sillas rattan", "Mesas piedra", "Camastros"],
        className: "md:col-span-1 md:row-span-1"
    },
    {
        id: 10,
        name: "Firma Legal SC",
        location: "Santa Fe",
        category: "corporativo",
        categoryLabel: "CORPORATIVO LEGAL",
        image: "/images/projects/project-06.png",
        tags: ["Mesa conferencias", "Sillas piel", "Recepción"],
        className: "md:col-span-1 md:row-span-1"
    },
    {
        id: 11,
        name: "Panadería La Masa",
        location: "Roma Norte",
        category: "cafeteria",
        categoryLabel: "PANADERÍA ARTESANAL",
        image: "/images/projects/project-11.png",
        tags: ["Bancos madera", "Mesas comunales", "Vitrinas"],
        className: "md:col-span-1 md:row-span-2"
    },
    {
        id: 12,
        name: "Cantina La No. 20",
        location: "Polanco",
        category: "restaurante",
        categoryLabel: "CANTINA MODERNA",
        image: "/images/projects/project-02.png",
        tags: ["Sillas tradicionales", "Gabinetes", "Barra mármol"],
        featured: true,
        className: "md:col-span-2 md:row-span-1"
    },
];

// Layout pattern for CMS projects
const layoutPattern = [
    "md:col-span-2 md:row-span-2",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-2",
    "md:col-span-2 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-2 md:row-span-2",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-1",
    "md:col-span-1 md:row-span-2",
    "md:col-span-2 md:row-span-1",
];

export default async function ProyectosPage() {
    let projects = defaultProjects;

    // Fetch from existing Wix CMS collection "NegociosClientes"
    try {
        const wixClient = getWixServerClient();
        const result = await wixClient.items.query("NegociosClientes").limit(50).find();
        if (result.items.length > 0) {
            // Map basic fields first
            const rawProjects = result.items.map((item: any, i: number) => {
                const d = item.data || item;
                const nombre = d.title_fld || d.title || `Negocio ${i + 1}`;
                const ciudad = d.ciudad || "";
                const tipo = d.tipoDeRestaurante || "";
                const imagen = d.imagenDePortada || "";
                const galeria = d.galerIaDeFotosDelNegocio || d.galeriaDeFotosDelNegocio || null;
                const excerpt = d.excerptDelNegocioProyecto || "";
                const principal = d.principalEnLaPGina || d.principalEnLaPagina || false;
                const whatsapp = d.urlDeWhatsappPersonalizado || "";

                return {
                    _cmsId: d._id,
                    id: i + 1,
                    name: nombre.trim(),
                    location: ciudad,
                    category: tipo.toLowerCase().replace(/\s+/g, "-") || "restaurante",
                    categoryLabel: tipo.toUpperCase() || "NEGOCIO",
                    image: getWixImageUrl(imagen) || "/images/projects/project-01.png",
                    tags: tipo ? [tipo] : [],
                    featured: principal,
                    className: layoutPattern[i % layoutPattern.length],
                    excerpt,
                    gallery: galeria,
                    whatsapp,
                    linkedProducts: [] as { name: string; id: string }[],
                };
            });

            // Fetch multi-reference "multireference" for each project in parallel
            await Promise.allSettled(
                rawProjects.map(async (proj) => {
                    try {
                        const refs = await (wixClient.items as any).queryReferenced(
                            "NegociosClientes",
                            proj._cmsId,
                            "multireference"
                        );
                        if (refs?.items?.length > 0) {
                            proj.linkedProducts = refs.items.map((r: any) => ({
                                name: r.title_fld || r.title || "",
                                id: r._id || "",
                            })).filter((p: any) => p.name);
                        }
                    } catch {
                        // No references for this item — skip
                    }
                })
            );

            projects = rawProjects;
        }
    } catch (err) {
        console.error("[Proyectos] CMS fetch error:", err);
    }

    return (
        <main className="bg-white min-h-screen pb-20">
            <SectionHero
                overline="Portfolio"
                title={<>Espacios que <em className="text-[var(--accent)] not-italic">transformamos</em></>}
                subtitle="Más de 500 proyectos completados en restaurantes, hoteles y cafeterías de todo México. Cada espacio es una historia de diseño y calidad."
                backgroundImage="/images/projects-hero.jpg"
            />
            <ProyectosGrid projects={projects} />
        </main>
    );
}

