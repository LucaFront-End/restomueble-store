"use client";

import { useState, FormEvent } from "react";
import { subscribeNewsletter } from "@/lib/wixFormActions";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        const result = await subscribeNewsletter(email);
        if (result.success) {
            setStatus("success");
            setEmail("");
        } else {
            setStatus("error");
            setErrorMsg(result.error || "Error al suscribirse.");
        }
    };

    if (status === "success") {
        return (
            <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <p className="text-white font-light text-lg">¡Suscripción confirmada!</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto">
            <input
                type="email"
                required
                placeholder="tu-correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-8 py-5 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] transition-all font-light"
            />
            <button
                type="submit"
                disabled={status === "loading"}
                className="px-10 py-5 bg-[var(--accent)] text-white text-xs font-bold tracking-[0.2em] uppercase rounded-full hover:bg-white hover:text-[var(--brand-navy)] transition-all disabled:opacity-50"
            >
                {status === "loading" ? "Enviando..." : "Suscribirse"}
            </button>
            {status === "error" && (
                <p className="w-full text-red-400 text-xs text-center mt-2">{errorMsg}</p>
            )}
        </form>
    );
}
