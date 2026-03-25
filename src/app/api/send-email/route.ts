import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/send-email
 * 
 * Sends a contact/lead notification email to Josepja's sales team.
 * Uses a simple SMTP-free approach via Wix Triggered Emails or a basic
 * email-forwarding approach through the contact form data.
 * 
 * For production, set up one of:
 * 1. Wix Automations: Trigger on "Contact Created" or "CMS Item Created" (Leads)
 * 2. SendGrid/Resend API: Add SENDGRID_API_KEY or RESEND_API_KEY to .env.local
 * 3. Nodemailer with SMTP credentials
 * 
 * This endpoint currently uses the Resend API if available,
 * otherwise falls back to console logging (and a success response so the UX works).
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nombre, email, telefono, mensaje, servicio, origen } = body;

        // Build email content
        const subject = `Nuevo lead desde ${origen || "formulario web"} — ${nombre}`;
        const htmlContent = `
            <h2>Nuevo contacto desde josepja.com</h2>
            <table style="border-collapse:collapse; width:100%; max-width:600px;">
                <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Nombre</td><td style="padding:8px; border:1px solid #ddd;">${nombre}</td></tr>
                <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Email</td><td style="padding:8px; border:1px solid #ddd;">${email}</td></tr>
                ${telefono ? `<tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Teléfono</td><td style="padding:8px; border:1px solid #ddd;">${telefono}</td></tr>` : ""}
                ${servicio ? `<tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Tipo de Proyecto</td><td style="padding:8px; border:1px solid #ddd;">${servicio}</td></tr>` : ""}
                ${mensaje ? `<tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Mensaje</td><td style="padding:8px; border:1px solid #ddd;">${mensaje}</td></tr>` : ""}
                <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Origen</td><td style="padding:8px; border:1px solid #ddd;">${origen || "web"}</td></tr>
                <tr><td style="padding:8px; border:1px solid #ddd; font-weight:bold;">Fecha</td><td style="padding:8px; border:1px solid #ddd;">${new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })}</td></tr>
            </table>
        `;

        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const SALES_EMAIL = process.env.SALES_EMAIL || "ventas@josepja.com";

        if (RESEND_API_KEY) {
            // Send via Resend API
            const response = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: "Josepja Web <noreply@josepja.com>",
                    to: [SALES_EMAIL],
                    subject,
                    html: htmlContent,
                    reply_to: email,
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("[Email] Resend API error:", errorData);
                // Don't fail the form — still return success
            } else {
                console.log("[Email] ✅ Sent via Resend to", SALES_EMAIL);
            }
        } else {
            // Fallback: log the email for debugging
            console.log("[Email] No RESEND_API_KEY configured. Would send to:", SALES_EMAIL);
            console.log("[Email] Subject:", subject);
            console.log("[Email] Body:", { nombre, email, telefono, servicio, mensaje, origen });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[Email] Error:", error?.message || error);
        return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
    }
}
