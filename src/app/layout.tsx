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
  title: "Josepja | Muebles para restaurantes en CDMX | Mesas y sillas para restaurante",
  description: "En Josepja fabricamos Muebles para restaurantes en CDMX, incluyendo Mesas para restaurantes, mesas para cafetería y Mesas y Sillas para restaurante de uso rudo. Envíos a toda la República.",
  keywords: ["muebles restaurante", "sillas restaurante", "mesas restaurante", "mesas cafetería", "mobiliario", "fabricación México", "Josepja"],
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
