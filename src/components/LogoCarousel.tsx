"use client";

interface LogoCarouselProps {
  content?: {
    logo_names_row_1?: string;
    logo_names_row_2?: string;
  };
}

export default function LogoCarousel({ content = {} }: LogoCarouselProps) {
  const defaultClientsRow1 = [
    "Hilton Resorts",
    "Hyatt Regency",
    "St. Regis",
    "Fiesta Americana",
    "Marriott Hotels",
    "Live Aqua",
    "Grand Velas",
    "Rosewood",
  ];

  const defaultClientsRow2 = [
    "Grupo Anderson's",
    "Nobu",
    "Grupo Carolo",
    "Fisher's",
    "Porfirio's",
    "Sonora Grill",
    "Tori Tori",
    "Entremar",
  ];

  // Parse CMS comma-separated strings
  const clients = content.logo_names_row_1
    ? content.logo_names_row_1.split(",").map(s => s.trim())
    : defaultClientsRow1;

  const clients2 = content.logo_names_row_2
    ? content.logo_names_row_2.split(",").map(s => s.trim())
    : defaultClientsRow2;

  return (
    <section className="py-10 md:py-16 bg-white overflow-hidden">
      {/* Divider Line */}
      <div className="flex justify-center mb-8">
        <div className="w-12 h-[2px] bg-[#C8A882]" />
      </div>

      <h2 className="text-center text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.35em] text-gray-400 font-medium mb-8 md:mb-12 uppercase px-4">
        Clientes que confían en nosotros
      </h2>

      <div className="space-y-6 relative">
        {/* Blur edges - left */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-32 z-10 bg-gradient-to-r from-white to-transparent" />
        {/* Blur edges - right */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-32 z-10 bg-gradient-to-l from-white to-transparent" />

        {/* First Row */}
        <div className="relative overflow-hidden">
          <div className="flex logo-scroll-right">
            {[...clients, ...clients, ...clients].map((client, idx) => (
              <span
                key={idx}
                className="flex-shrink-0 px-6 md:px-10 text-xl md:text-3xl font-serif text-gray-200 whitespace-nowrap select-none"
              >
                {client}
              </span>
            ))}
          </div>
        </div>

        {/* Second Row */}
        <div className="relative overflow-hidden">
          <div className="flex logo-scroll-left">
            {[...clients2, ...clients2, ...clients2].map((client, idx) => (
              <span
                key={idx}
                className="flex-shrink-0 px-6 md:px-10 text-xl md:text-3xl font-serif text-gray-200 whitespace-nowrap select-none"
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
                @keyframes logo-right {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                @keyframes logo-left {
                    0% { transform: translateX(-33.333%); }
                    100% { transform: translateX(0); }
                }
                .logo-scroll-right {
                    animation: logo-right 35s linear infinite;
                }
                .logo-scroll-left {
                    animation: logo-left 35s linear infinite;
                }
            `}</style>
    </section>
  );
}
