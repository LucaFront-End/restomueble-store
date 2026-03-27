"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Review {
    name: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
}

const SAMPLE_REVIEWS: Review[] = [
    {
        name: "Carlos M.",
        rating: 5,
        date: "Hace 2 semanas",
        comment: "Excelente calidad. Las sillas son muy resistentes y el acabado es increíble. Perfectas para nuestro restaurante.",
        verified: true,
    },
    {
        name: "María L.",
        rating: 5,
        date: "Hace 1 mes",
        comment: "Compramos un conjunto completo para nuestro café y quedó espectacular. El servicio de entrega fue puntual.",
        verified: true,
    },
    {
        name: "Roberto G.",
        rating: 4,
        date: "Hace 1 mes",
        comment: "Muy buena relación calidad-precio. Los muebles son sólidos y elegantes. Recomiendo el acabado rústico brillante.",
        verified: true,
    },
    {
        name: "Ana P.",
        rating: 5,
        date: "Hace 2 meses",
        comment: "Pedimos 20 sillas para nuestro hotel y todas llegaron perfectas. El equipo de ventas fue muy atento con la cotización mayoreo.",
        verified: true,
    },
    {
        name: "Fernando S.",
        rating: 5,
        date: "Hace 3 meses",
        comment: "Segunda compra que hago. El modelo Italia en cromo es simplemente hermoso. Muy recomendable.",
        verified: true,
    },
    {
        name: "Laura D.",
        rating: 4,
        date: "Hace 3 meses",
        comment: "Buenos muebles, resistentes y bonitos. El envío tardó un poco más de lo esperado pero valió la pena.",
        verified: true,
    },
];

const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-4 h-4 ${star <= rating ? "text-amber-400" : "text-gray-200"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

interface RatingBarProps {
    stars: number;
    count: number;
    total: number;
}

const RatingBar = ({ stars, count, total }: RatingBarProps) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="flex items-center gap-3 text-sm">
            <span className="w-3 text-gray-500 font-medium text-right">{stars}</span>
            <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-amber-400 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                />
            </div>
            <span className="w-6 text-xs text-gray-400 text-right">{count}</span>
        </div>
    );
};

interface ReviewsSectionProps {
    productName: string;
}

export const ReviewsSection = ({ productName }: ReviewsSectionProps) => {
    const [showAll, setShowAll] = useState(false);
    const reviews = SAMPLE_REVIEWS;
    const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

    const totalReviews = reviews.length;
    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);

    // Calculate distribution
    const distribution = [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        count: reviews.filter((r) => r.rating === stars).length,
    }));

    return (
        <section className="border-t border-gray-100 py-20">
            <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                        Reseñas de Clientes
                    </h2>
                    <p className="text-gray-500">
                        Lo que opinan nuestros clientes sobre este producto.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-[300px_1fr] gap-12 lg:gap-16">
                    {/* Left: Rating Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="text-center lg:text-left">
                            <div className="text-6xl font-bold text-gray-900 mb-2">{avgRating}</div>
                            <RatingStars rating={Math.round(parseFloat(avgRating))} />
                            <p className="text-sm text-gray-400 mt-2">
                                Basado en {totalReviews} reseñas
                            </p>
                        </div>

                        <div className="space-y-2">
                            {distribution.map(({ stars, count }) => (
                                <RatingBar
                                    key={stars}
                                    stars={stars}
                                    count={count}
                                    total={totalReviews}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Review Cards */}
                    <div className="space-y-6">
                        {displayedReviews.map((review, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="border border-gray-100 rounded-xl p-6 hover:border-gray-200 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-900 text-sm">
                                                    {review.name}
                                                </span>
                                                {review.verified && (
                                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                                        Verificado
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400">{review.date}</span>
                                        </div>
                                    </div>
                                    <RatingStars rating={review.rating} />
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {review.comment}
                                </p>
                            </motion.div>
                        ))}

                        {/* Show More / Less */}
                        {reviews.length > 3 && (
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="w-full py-3 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:border-gray-900 hover:text-gray-900 transition-all"
                            >
                                {showAll
                                    ? "Ver menos reseñas"
                                    : `Ver todas las reseñas (${reviews.length})`}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
