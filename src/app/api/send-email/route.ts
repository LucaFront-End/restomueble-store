import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/send-email
 * 
 * Sends a contact/lead notification email to Josepja's sales team.
 * Uses Resend API (free tier: 100 emails/day, 3k/month).
 * 
 * Required env vars on Vercel:
 *   RESEND_API_KEY — Get from https://resend.com/api-keys
 * 
 * Recipients: ventas@josepja.com + dessenaluca53@gmail.com
 */

const RECIPIENTS = [
    "ventas@josepja.com",
    "dessenaluca53@gmail.com",
];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nombre, email, telefono, mensaje, servicio, origen, cantidad, tipodeproyecto } = body;

        // Build email content
        const subject = `🪑 Nuevo lead — ${nombre} — ${origen || "web"}`;
        const htmlContent = `
            <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                <div style="background: #1a1a2e; color: white; padding: 24px 32px; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; font-size: 20px; font-weight: 600;">Josepja — Nuevo Contacto</h1>
                    <p style="margin: 8px 0 0; color: #a0a0b0; font-size: 14px;">Recibido desde ${origen || "formulario web"}</p>
                </div>
                <table style="border-collapse: collapse; width: 100%; border: 1px solid #e5e5e5; border-top: none;">
                    <tr style="background: #f9f9f9;">
                        <td style="padding: 12px 16px; font-weight: 600; color: #333; width: 140px; border-bottom: 1px solid #e5e5e5;">Nombre</td>
                        <td style="padding: 12px 16px; color: #555; border-bottom: 1px solid #e5e5e5;">${nombre || "—"}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 16px; font-weight: 600; color: #333; border-bottom: 1px solid #e5e5e5;">Email</td>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5;"><a href="mailto:${email}" style="color: #2563eb;">${email || "—"}</a></td>
                    </tr>
                    ${telefono ? `
                    <tr style="background: #f9f9f9;">
                        <td style="padding: 12px 16px; font-weight: 600; color: #333; border-bottom: 1px solid #e5e5e5;">Teléfono</td>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5;"><a href="tel:${telefono}" style="color: #2563eb;">${telefono}</a></td>
                    </tr>` : ""}
                    ${servicio || tipodeproyecto ? `
                    <tr>
                        <td style="padding: 12px 16px; font-weight: 600; color: #333; border-bottom: 1px solid #e5e5e5;">Tipo de Proyecto</td>
                        <td style="padding: 12px 16px; color: #555; border-bottom: 1px solid #e5e5e5;">${servicio || tipodeproyecto}</td>
                    </tr>` : ""}
                    ${cantidad ? `
                    <tr style="background: #f9f9f9;">
                        <td style="padding: 12px 16px; font-weight: 600; color: #333; border-bottom: 1px solid #e5e5e5;">Cantidad</td>
                        <td style="padding: 12px 16px; color: #555; border-bottom: 1px solid #e5e5e5;">${cantidad}</td>
                    </tr>` : ""}
                    ${mensaje ? `
                    <tr>
                        <td style="padding: 12px 16px; font-weight: 600; color: #333; border-bottom: 1px solid #e5e5e5;">Mensaje</td>
                        <td style="padding: 12px 16px; color: #555; border-bottom: 1px solid #e5e5e5;">${mensaje}</td>
                    </tr>` : ""}
                    <tr style="background: #f9f9f9;">
                        <td style="padding: 12px 16px; font-weight: 600; color: #333;">Fecha</td>
                        <td style="padding: 12px 16px; color: #888;">${new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })}</td>
                    </tr>
                </table>
                <div style="padding: 16px 32px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #e5e5e5;">
                    Email enviado automáticamente desde josepja.com
                </div>
            </div>
        `;

        const RESEND_API_KEY = process.env.RESEND_API_KEY;

        if (RESEND_API_KEY) {
            // Send via Resend API to ALL recipients
            const response = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from: "Josepja Web <onboarding@resend.dev>",
                    to: RECIPIENTS,
                    subject,
                    html: htmlContent,
                    reply_to: email || undefined,
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("[Email] Resend API error:", response.status, errorData);
                return NextResponse.json({ 
                    success: false, 
                    error: `Resend API error: ${response.status}` 
                }, { status: 502 });
            }

            const resData = await response.json();
            console.log("[Email] ✅ Sent via Resend to", RECIPIENTS.join(", "), "| ID:", resData.id);
        } else {
            // No API key — log warning
            console.warn("[Email] ⚠️ RESEND_API_KEY not configured in environment variables.");
            console.warn("[Email] Set it in Vercel: Settings → Environment Variables → RESEND_API_KEY");
            console.log("[Email] Would have sent to:", RECIPIENTS.join(", "));
            console.log("[Email] Subject:", subject);
            console.log("[Email] Data:", { nombre, email, telefono, servicio, mensaje, origen });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[Email] Error:", error?.message || error);
        return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
    }
}
