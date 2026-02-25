import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { WixContextProvider } from "@/context/wixContext";
import { CataloguePopupProvider } from "@/context/cataloguePopupContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CataloguePopup from "@/components/CataloguePopup";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Restomueble | Fabricación de Mobiliario para Restaurantes",
  description: "Diseño y fabricación de mobiliario a medida para restaurantes, hoteles y oficinas. Más de 15 años de experiencia. Garantía de calidad.",
  keywords: ["muebles restaurante", "sillas restaurante", "mesas", "mobiliario", "fabricación México"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className={poppins.className} style={{ paddingTop: "80px" }}>
        <WixContextProvider>
          <CataloguePopupProvider>
            <Navbar />
            {children}
            <Footer />
            <WhatsAppFloat />
            <CataloguePopup />
          </CataloguePopupProvider>
        </WixContextProvider>
      </body>
    </html>
  );
}
