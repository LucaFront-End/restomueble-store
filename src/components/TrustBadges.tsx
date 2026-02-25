const features = [
    {
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: "Garantía de 5 años",
        description: "Respaldo total en estructura y acabados"
    },
    {
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        title: "Entrega rápida",
        description: "Envíos a todo México en tiempo récord"
    },
    {
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        title: "Fabricación nacional",
        description: "100% hecho en México con calidad certificada"
    },
    {
        icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
            </svg>
        ),
        title: "Asesoría personalizada",
        description: "Te ayudamos a elegir lo mejor para tu proyecto"
    }
];

const TrustBadges = () => {
    return (
        <section className="section section-gray">
            <div className="container">
                <div className="grid-4">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="flex justify-center mb-4 text-blue-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p style={{ color: "var(--gray-600)" }}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustBadges;
