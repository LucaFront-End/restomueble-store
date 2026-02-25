import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";

const wixClient = createClient({
    modules: { products },
    auth: OAuthStrategy({
        clientId: "eb662bfc-a3b2-4192-8356-a332f1e33389"
    }),
});

async function testConnection() {
    console.log("Iniciando prueba de conexion con Wix...");
    try {
        const result = await wixClient.products.queryProducts().limit(5).find();
        console.log("✅ CONEXIÓN EXITOSA");
        console.log(`Se encontraron ${result.items.length} productos.`);
        result.items.forEach(p => {
            console.log(`- ${p.name} (${p.price?.formatted?.price})`);
        });
    } catch (error) {
        console.error("❌ ERROR DE CONEXIÓN:");
        console.error(error);
    }
}

testConnection();
