const { createClient, OAuthStrategy } = require('@wix/sdk');
const { products } = require('@wix/stores');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
let clientId = "";
try {
    const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
    const lines = envFile.split('\n');
    for (const line of lines) {
        if (line.includes('NEXT_PUBLIC_WIX_CLIENT_ID=')) {
            clientId = line.split('=')[1].trim().replace(/['"]/g, '');
            break;
        }
    }
} catch (e) {
    console.error("Could not read .env.local", e);
}

async function checkProducts() {
    if (!clientId) {
        console.error("❌ No Client ID found in .env.local");
        return;
    }

    const wixClient = createClient({
        modules: { products },
        auth: OAuthStrategy({ clientId }),
    });

    try {
        await wixClient.auth.generateVisitorTokens();
        console.log("🔍 Fetching products with variants...\n");
        const result = await wixClient.products.queryProducts().limit(50).find();
        console.log(`✅ Found ${result.items.length} products:\n`);
        result.items.forEach(p => {
            const hasOptions = p.productOptions && p.productOptions.length > 0;
            const hasVariants = p.variants && p.variants.length > 0;
            console.log(`📦 ${p.name}`);
            console.log(`   ID: ${p._id}`);
            console.log(`   Slug: ${p.slug}`);
            console.log(`   HasOptions: ${hasOptions}`);
            if (hasOptions) {
                p.productOptions.forEach(opt => {
                    console.log(`   Option: "${opt.name}" → choices: ${opt.choices.map(c => c.value).join(', ')}`);
                });
            }
            console.log(`   HasVariants: ${hasVariants} (${p.variants?.length ?? 0} variants)`);
            if (hasVariants && p.variants.length <= 5) {
                p.variants.forEach(v => {
                    const choices = Object.entries(v.choices || {}).map(([k, val]) => `${k}=${val}`).join(', ');
                    console.log(`   Variant ${v._id}: [${choices}] stock=${v.stock?.quantity ?? 'n/a'} inStock=${v.stock?.inStock}`);
                });
            }
            console.log('');
        });
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

checkProducts();
