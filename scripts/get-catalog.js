require("dotenv").config({ path: ".env.local" });
const { createClient, OAuthStrategy } = require('@wix/sdk');
const { products } = require('@wix/stores');

const wixClient = createClient({
    modules: { products },
    auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID })
});

async function run() {
    try {
        const res = await wixClient.products.queryProducts().limit(50).find();
        console.log("=== CATALOGO REAL JOSEPJA ===");
        res.items.forEach(p => {
            console.log(`- ${p.name} (ID: ${p._id})`);
            if (p.media && p.media.mainMedia && p.media.mainMedia.image) {
                console.log(`  Imagen: ${p.media.mainMedia.image.url}`);
            }
        });
    } catch (e) {
        console.error("Error fetching Wix API:", e);
    }
}
run();
