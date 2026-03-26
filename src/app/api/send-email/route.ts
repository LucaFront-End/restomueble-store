import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/send-email
 * 
 * Sends form data as email using Formsubmit.co (free, no API keys needed).
 * 
 * HOW IT WORKS:
 * 1. We POST form data to https://formsubmit.co/ajax/EMAIL
 * 2. First time: Formsubmit sends a confirmation email — click the link to activate
 * 3. After activation: all future form submissions are forwarded to the email
 * 
 * Recipients: ventas@josepja.com (primary) + dessenaluca53@gmail.com (CC)
 * No API keys, no accounts, completely free.
 */

const PRIMARY_EMAIL = "ventas@josepja.com";
const CC_EMAIL = "dessenaluca53@gmail.com";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nombre, email, telefono, mensaje, servicio, origen, cantidad, tipodeproyecto } = body;

        const formData = {
            Nombre: nombre || "—",
            Email: email || "—",
            Telefono: telefono || "—",
            "Tipo de Proyecto": servicio || tipodeproyecto || "—",
            Cantidad: cantidad || "—",
            Mensaje: mensaje || "—",
            Origen: origen || "web",
            Fecha: new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }),
            // Formsubmit special fields
            _subject: `🪑 Nuevo lead — ${nombre} — ${origen || "web"}`,
            _cc: CC_EMAIL,
            _template: "table",
            _captcha: "false",
            _replyto: email || "",
        };

        // Send to Formsubmit.co (AJAX mode for JSON response)
        const response = await fetch(`https://formsubmit.co/ajax/${PRIMARY_EMAIL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log("[Email] ✅ Sent via Formsubmit to", PRIMARY_EMAIL, "+", CC_EMAIL);
        } else {
            console.error("[Email] Formsubmit response:", result);
            // If it says "needs activation", the user needs to check their email
            if (result.message?.includes("activate") || result.message?.includes("confirm")) {
                console.warn("[Email] ⚠️ Check ventas@josepja.com inbox for activation email from Formsubmit");
            }
        }

        // Always return success to the frontend so the form UX works
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[Email] Error:", error?.message || error);
        return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
    }
}
