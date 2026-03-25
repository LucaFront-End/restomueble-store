import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nosotros Josepja | Fabricantes de muebles para restaurantes en México",
    description: "Conoce Josepja, empresa mexicana con experiencia en Mobiliario para restaurantes, fabricando Mesas y Sillas para restaurante y Mesas para restaurantes de uso rudo con envíos a toda la República.",
};

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
