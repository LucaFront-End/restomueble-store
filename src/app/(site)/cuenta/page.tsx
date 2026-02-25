"use client";

import { useWixClient } from "@/hooks/useWixClient";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CuentaPage() {
    const { member } = useWixClient();

    const name =
        [member?.profile?.nickname || "", member?.contact?.firstName || "", member?.contact?.lastName || ""]
            .filter(Boolean)
            .join(" ") ||
        member?.loginEmail ||
        "Usuario";

    const avatarUrl = member?.profile?.photo?.url;
    const initials = name.slice(0, 2).toUpperCase();

    const infoItems = [
        { label: "Nombre completo", value: `${member?.contact?.firstName || ""} ${member?.contact?.lastName || ""}`.trim() || "—" },
        { label: "Email", value: member?.loginEmail || "—" },
        { label: "Apodo", value: member?.profile?.nickname || "—" },
        { label: "Miembro desde", value: member?._createdDate ? new Date(member._createdDate).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" }) : "—" },
    ];

    return (
        <div className="space-y-6">
            {/* Header card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-[var(--brand-navy)] flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg">
                        {avatarUrl ? (
                            <Image src={avatarUrl} alt={name} width={80} height={80} className="object-cover w-full h-full" />
                        ) : (
                            <span className="text-2xl font-bold text-white">{initials}</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-[var(--font-heading)] text-[var(--text-primary)] leading-tight">
                            {name}
                        </h1>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">{member?.loginEmail}</p>
                    </div>
                </div>
            </div>

            {/* Info grid */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-secondary)] mb-6">
                    Información de la Cuenta
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {infoItems.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="flex flex-col gap-1"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                {item.label}
                            </span>
                            <span className="text-sm text-[var(--text-primary)] font-medium">
                                {item.value}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
