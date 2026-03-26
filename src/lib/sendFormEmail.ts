/**
 * Send form data as email via Formsubmit.co (client-side, free, no API keys).
 * 
 * Recipient: ventas@josepja.com
 * 
 * NOTE: The intro text ("Someone just submitted...") is from Formsubmit's 
 * template and cannot be changed. We minimize it by using _template: "box".
 */

const PRIMARY_EMAIL = "ventas@josepja.com";

interface EmailData {
    nombre: string;
    email: string;
    telefono?: string;
    mensaje?: string;
    servicio?: string;
    tipodeproyecto?: string;
    cantidad?: string;
    origen?: string;
}

export async function sendFormEmail(data: EmailData): Promise<boolean> {
    try {
        const origen = data.origen || "web";
        const tipo = data.servicio || data.tipodeproyecto || "";

        // Build a single formatted Spanish message body
        let detalles = `📋 NUEVO LEAD — ${origen.toUpperCase()}\n\n`;
        detalles += `👤 Nombre: ${data.nombre || "—"}\n`;
        detalles += `📧 Email: ${data.email || "—"}\n`;
        if (data.telefono) detalles += `📱 Teléfono: ${data.telefono}\n`;
        if (tipo) detalles += `🏢 Tipo de Proyecto: ${tipo}\n`;
        if (data.cantidad) detalles += `📦 Cantidad: ${data.cantidad}\n`;
        if (data.mensaje) detalles += `💬 Mensaje: ${data.mensaje}\n`;
        detalles += `🌐 Origen: ${origen}\n`;
        detalles += `📅 Fecha: ${new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })}`;

        const payload: Record<string, string> = {
            "Detalle del Lead": detalles,
            _replyto: data.email || "",
            _subject: `🪑 Nuevo lead — ${data.nombre} — desde ${origen}`,
            _template: "box",
            _captcha: "false",
        };

        const res = await fetch(`https://formsubmit.co/ajax/${PRIMARY_EMAIL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        console.log("[Formsubmit]", result);
        return res.ok;
    } catch (error) {
        console.error("[Formsubmit] Error:", error);
        return false;
    }
}
