"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const testimonials = [
    {
        quote: "Excelente calidad y el envío llegó antes de lo esperado. Las sillas aguantan todo el ritmo del servicio.",
        author: "Carlos M.",
        role: "Restaurante La Terraza",
        location: "CDMX"
    },
    {
        quote: "Personalizaron las mesas exactamente como las necesitábamos. El servicio postventa es increíble.",
        author: "María L.",
        role: "Café Aromático",
        location: "Monterrey"
    },
    {
        quote: "Ya es nuestro tercer pedido. La durabilidad de los muebles justifica cada peso invertido.",
        author: "Roberto S.",
        role: "Hotel Boutique",
        location: "Guadalajara"
    },
    {
        quote: "El acabado de las maderas es superior a lo que habíamos visto en otros proveedores locales.",
        author: "Ana P.",
        role: "Bistró Central",
        location: "Puebla"
    },
    {
        quote: "Muy resistentes. Llevamos 2 años con ellas y siguen como nuevas a pesar del uso rudo.",
        author: "Javier R.",
        role: "Taquería El Pastor",
        location: "Querétaro"
    }
];

export default function TestimonialMarquee() {
    const [duplicatedTestimonials, setDuplicatedTestimonials] = useState(testimonials);

    useEffect(() => {
        // Duplicamos los testimonios suficientes veces para asegurar el loop infinito sin saltos
        setDuplicatedTestimonials([...testimonials, ...testimonials, ...testimonials]);
    }, []);

    return (
        <div className="relative w-full overflow-hidden py-12 bg-gray-50">
            {/* Blur Gradients */}
            <div className="absolute top-0 left-0 z-10 w-24 h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 z-10 w-24 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />

            <div className="flex">
                <motion.div
                    className="flex gap-8"
                    animate={{
                        x: ["0%", "-33.33%"], // Movemos solo un tercio porque tenemos 3 sets
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 40, // Velocidad ajustable
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedTestimonials.map((testimonial, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-[400px] bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                        >
                            <div className="flex gap-1 text-[var(--accent)] mb-4">
                                {[...Array(5)].map((_, j) => (
                                    <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 mb-6 italic text-lg leading-relaxed">
                                &ldquo;{testimonial.quote}&rdquo;
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                                    {testimonial.author.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">{testimonial.author}</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
