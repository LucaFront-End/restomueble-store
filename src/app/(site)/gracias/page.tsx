import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ThankYouPage() {
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="mb-6 text-6xl">🎉</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Gracias por tu compra!</h1>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Tu pedido ha sido procesado. Recibirás un email de confirmación con los detalles de tu compra.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Volver al Inicio
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    );
}
