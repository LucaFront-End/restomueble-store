import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Proyectos Josepja | Muebles para restaurantes en CDMX | Mesas y sillas para negocios",
    description: "Descubre proyectos de Josepja en Mobiliario para restaurantes, con Mesas para restaurantes, mesas para cafetería y Mesas y sillas para negocios instaladas en CDMX y toda la República.",
};

export default function ProyectosLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
