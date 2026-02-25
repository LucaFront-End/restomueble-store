"use server";

import { getWixApiKeyClient } from "@/lib/wixApiKeyClient";

export interface ContactFormData {
    nombre: string;
    email: string;
    telefono?: string;
    servicio?: string;
    mensaje: string;
}

export interface ActionResult {
    success: boolean;
    error?: string;
}

/**
 * Submits a contact/quote request to Wix CRM.
 * Creates a contact in Wix CRM/Inbox visible under Contacts.
 * Trigger "Contact Created" automation in Wix to send confirmation emails.
 */
export async function submitContact(data: ContactFormData): Promise<ActionResult> {
    try {
        const wixClient = getWixApiKeyClient();

        // ContactInfo passed directly — see @wix/auto_sdk_crm_contacts typings
        await wixClient.contacts.createContact({
            name: {
                first: data.nombre.split(" ")[0],
                last: data.nombre.split(" ").slice(1).join(" ") || "",
            },
            emails: {
                items: [
                    {
                        tag: "MAIN",
                        email: data.email,
                    },
                ],
            },
            phones: data.telefono
                ? {
                    items: [
                        {
                            tag: "MOBILE",
                            phone: data.telefono,
                            countryCode: "MX",
                        },
                    ],
                }
                : undefined,
            extendedFields: {
                items: {
                    "custom.servicio": data.servicio || "",
                    "custom.mensaje": data.mensaje,
                },
            },
        });

        return { success: true };
    } catch (err: any) {
        // 409 = contact already exists — still treat as success
        if (
            err?.details?.applicationError?.code === "DUPLICATE_FOUND" ||
            err?.httpStatus === 409 ||
            String(err?.message).includes("DUPLICATE")
        ) {
            return { success: true };
        }
        console.error("[CRM] submitContact error:", err?.message || err);
        return {
            success: false,
            error: "No se pudo enviar el formulario. Por favor intenta de nuevo.",
        };
    }
}

/**
 * Subscribes an email address to the newsletter via Wix CRM.
 * Tag the contact with a newsletter label in Wix and trigger Wix Automation.
 */
export async function subscribeNewsletter(email: string): Promise<ActionResult> {
    try {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return { success: false, error: "Email inválido." };
        }

        const wixClient = getWixApiKeyClient();

        await wixClient.contacts.createContact({
            emails: {
                items: [
                    {
                        tag: "MAIN",
                        email,
                    },
                ],
            },
        });

        return { success: true };
    } catch (err: any) {
        if (
            err?.details?.applicationError?.code === "DUPLICATE_FOUND" ||
            err?.httpStatus === 409 ||
            String(err?.message).includes("DUPLICATE")
        ) {
            return { success: true };
        }
        console.error("[CRM] subscribeNewsletter error:", err?.message || err);
        return {
            success: false,
            error: "No se pudo procesar tu suscripción.",
        };
    }
}
