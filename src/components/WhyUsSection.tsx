import { FaShieldAlt, FaPencilRuler, FaHistory } from "react-icons/fa";

const reasons = [
    {
        icon: FaShieldAlt,
        title: "Durabilidad Probada",
        description:
            "Nuestros muebles están diseñados para soportar alto tráfico, limpieza constante y el movimiento diario de un restaurante activo. Sin fragilidades.",
        accent: "var(--color-accent)",
    },
    {
        icon: FaPencilRuler,
        title: "Personalización Real",
        description:
            "Adaptamos medidas, acabados y materiales a las necesidades específicas de tu espacio. Desde taquerías hasta hoteles de lujo.",
        accent: "var(--color-primary)",
    },
    {
        icon: FaHistory,
        title: "30 Años de Oficio",
        description:
            "Tres décadas de experiencia familiar fabricando mobiliario que ha equipado cientos de restaurantes en todo México.",
        accent: "var(--color-accent)",
    },
];

const WhyUsSection = () => {
    return (
        <section className="section-lg bg-[var(--color-gray-50)]">
            <div className="container-main">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="badge badge-primary mb-4">Por qué elegirnos</span>
                    <h2 className="heading-lg mb-4">
                        Mobiliario que <span className="text-[var(--color-accent)]">trabaja contigo</span>
                    </h2>
                    <p className="text-[var(--color-gray-600)] max-w-2xl mx-auto">
                        No vendemos muebles bonitos. Vendemos muebles que funcionan para negocios
                        que abren todos los días y no se pueden dar el lujo de fallar.
                    </p>
                </div>

                {/* Grid de razones */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reasons.map((reason, index) => (
                        <div
                            key={index}
                            className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-[var(--color-gray-100)]"
                        >
                            {/* Icono */}
                            <div
                                className="w-14 h-14 flex items-center justify-center rounded-xl mb-6 text-white"
                                style={{ backgroundColor: reason.accent }}
                            >
                                <reason.icon size={26} />
                            </div>

                            {/* Contenido */}
                            <h3 className="heading-sm mb-4">{reason.title}</h3>
                            <p className="text-[var(--color-gray-600)] leading-relaxed">
                                {reason.description}
                            </p>

                            {/* Número decorativo */}
                            <div className="absolute top-6 right-6 text-6xl font-black text-[var(--color-gray-100)]">
                                0{index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyUsSection;
