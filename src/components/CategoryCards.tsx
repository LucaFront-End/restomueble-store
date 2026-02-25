"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
    {
        id: "sillas",
        title: "Sillas para Restaurante",
        image: "/category-sillas.png",
        href: "/productos?category=sillas",
    },
    {
        id: "mesas",
        title: "Mesas y Bases",
        image: "/category-mesas.png",
        href: "/productos?category=mesas",
    },
    {
        id: "bancos",
        title: "Bancos Altos",
        image: "/category-bancos.png",
        href: "/productos?category=bancos",
    },
];

const CategoryCards = () => {
    return (
        <section className="section">
            <div className="container">
                <div className="text-center mb-4">
                    <h2 className="section-title">Nuestras Líneas de Producto</h2>
                    <p className="section-subtitle mx-auto">
                        Mobiliario diseñado específicamente para el uso intensivo en restaurantes
                    </p>
                </div>

                <div className="grid-3">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={category.href}
                            className="card group"
                        >
                            <div className="relative h-80 overflow-hidden">
                                <Image
                                    src={category.image}
                                    alt={category.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                                <span className="text-blue-500 font-semibold flex items-center justify-center gap-2">
                                    Ver productos
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryCards;
