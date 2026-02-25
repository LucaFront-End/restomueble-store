// Script de diagnóstico - ver estructura real
import { createClient, OAuthStrategy } from "@wix/sdk";
import { items } from "@wix/data";

async function test() {
    const wixClient = createClient({
        modules: { items },
        auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "" }),
    });

    console.log("=== ESTRUCTURA REAL DE ITEMS ===");
    try {
        const result = await wixClient.items.query("ContenidoWeb").limit(2).find();
        console.log("Primer item completo:", JSON.stringify(result.items[0], null, 2));
    } catch (e: any) {
        console.log("ERROR:", e.message);
    }
}

test();
