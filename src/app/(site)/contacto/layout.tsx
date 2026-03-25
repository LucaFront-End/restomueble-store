import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contacto Josepja | Cotiza muebles para restaurantes en CDMX",
    description: "Contacta a Josepja y cotiza Muebles para restaurantes en CDMX, Mesas y Sillas para restaurante y Mesas para restaurantes de uso rudo. Envíos a toda la República.",
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
