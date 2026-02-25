"use client";

import { LuShieldCheck, LuTruck, LuPackage, LuMessageSquare } from "react-icons/lu";

const MexicanFlagIcon = () => (
    <div className="flex items-center gap-[1px] w-6 h-4 rounded-[1px] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="w-1/3 h-full bg-[#006847]"></div>
        <div className="w-1/3 h-full bg-[#FFFFFF] flex items-center justify-center relative">
            <div className="w-[3px] h-[3px] bg-[#7D6330] rounded-full"></div>
        </div>
        <div className="w-1/3 h-full bg-[#CE1126]"></div>
    </div>
);

interface BentoBenefitsProps {
    content?: {
        benefit_1_title?: string;
        benefit_2_title?: string;
        benefit_3_title?: string;
        benefit_4_title?: string;
    };
}

const BentoBenefits = ({ content = {} }: BentoBenefitsProps) => {
    const benefits = [
        {
            id: "garantia",
            icon: <LuShieldCheck strokeWidth={1} />,
            title: content.benefit_1_title || "5 Años de Garantía",
        },
        {
            id: "envio",
            icon: <LuTruck strokeWidth={1} />,
            title: content.benefit_2_title || "Envío Rápido",
        },
        {
            id: "mexico",
            icon: <MexicanFlagIcon />,
            title: content.benefit_3_title || "Hecho en México",
            special: true,
        },
        {
            id: "asesoria",
            icon: <LuMessageSquare strokeWidth={1} />,
            title: content.benefit_4_title || "Asesoría Experta",
        },
    ];

    return (
        <section className="bg-white py-12 md:py-24 lg:py-32 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap justify-center gap-3 md:gap-4 lg:gap-6">
                    {benefits.map((benefit) => (
                        <div
                            key={benefit.id}
                            className={`
                flex items-center justify-center md:justify-start gap-3 md:gap-4 px-6 md:px-8 py-4 md:py-5 rounded-full 
                bg-[#F5F5F7] border border-[#E5E5E5] 
                transition-all duration-300 hover:bg-white hover:shadow-md 
                group cursor-default relative overflow-hidden touch-manipulation min-h-[48px] w-full md:w-auto
                ${benefit.special ? 'hover:border-[#006847]/30' : ''}
              `}
                        >
                            {/* Subtle Decorative Background for Mexico Pill */}
                            {benefit.special && (
                                <div className="absolute top-0 right-0 w-12 h-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                                    <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#006847]">
                                        <path d="M50 20 L20 80 L80 80 Z" /> {/* Minimalist abstract agave/mexican shape */}
                                    </svg>
                                </div>
                            )}

                            <div className={`
                text-xl md:text-2xl transition-opacity
                ${benefit.special ? 'opacity-100' : 'text-[#1D1D1F] opacity-70 group-hover:opacity-100'}
              `}>
                                {benefit.icon}
                            </div>
                            <span className={`
                text-xs md:text-sm lg:text-base font-bold tracking-tight whitespace-nowrap uppercase italic
                ${benefit.special ? 'text-[#1D1D1F]' : 'text-[#1D1D1F]'}
              `}>
                                {benefit.title}
                            </span>

                            {/* Special accent dot for Mexico */}
                            {benefit.special && (
                                <span className="flex h-1.5 w-1.5 rounded-full bg-[#006847] ml-[-4px]"></span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BentoBenefits;
