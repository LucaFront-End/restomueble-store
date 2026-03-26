/**
 * Send form data as email via Formsubmit.co (client-side, free, no API keys).
 * 
 * Primary: ventas@josepja.com
 * CC: dessenaluca53@gmail.com
 * 
 * ACTIVATION: The first submission triggers a confirmation email.
 * Click the link in that email to activate. After that, all submissions 
 * are forwarded automatically.
 */

const PRIMARY_EMAIL = "ventas@josepja.com";
const CC_EMAIL = "dessenaluca53@gmail.com";

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
        const payload: Record<string, string> = {
            Nombre: data.nombre || "—",
            Email: data.email || "—",
            _replyto: data.email || "",
            _subject: `🪑 Nuevo lead — ${data.nombre} — desde ${data.origen || "web"}`,
            _cc: CC_EMAIL,
            _template: "table",
            _captcha: "false",
        };

        if (data.telefono) payload["Teléfono"] = data.telefono;
        if (data.servicio || data.tipodeproyecto) payload["Tipo de Proyecto"] = data.servicio || data.tipodeproyecto || "";
        if (data.cantidad) payload["Cantidad"] = data.cantidad;
        if (data.mensaje) payload["Mensaje"] = data.mensaje;
        if (data.origen) payload["Origen"] = data.origen;
        payload["Fecha"] = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });

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
