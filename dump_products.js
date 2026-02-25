const { createClient, OAuthStrategy } = require('@wix/sdk');
const { products } = require('@wix/stores');
const fs = require('fs');

let clientId = '';
try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    for (const line of envFile.split('\n')) {
        if (line.includes('NEXT_PUBLIC_WIX_CLIENT_ID=')) {
            clientId = line.split('=')[1].trim().replace(/['"]/g, '');
            break;
        }
    }
} catch (e) { console.error(e); }

const wixClient = createClient({
    modules: { products },
    auth: OAuthStrategy({ clientId })
});

(async () => {
    await wixClient.auth.generateVisitorTokens();
    const r = await wixClient.products.queryProducts().limit(50).find();
    const data = r.items.map(p => ({
        name: p.name,
        id: p._id,
        slug: p.slug,
        hasOptions: (p.productOptions || []).length > 0,
        options: (p.productOptions || []).map(o => ({
            name: o.name,
            choices: (o.choices || []).map(c => c.value)
        })),
        variantCount: (p.variants || []).length,
        variants: (p.variants || []).slice(0, 3).map(v => ({
            id: v._id,
            choices: v.choices,
            inStock: v.stock && v.stock.inStock
        }))
    }));
    fs.writeFileSync('products_data.json', JSON.stringify(data, null, 2), 'utf8');
    console.log('Written to products_data.json');
    data.forEach(p => {
        console.log(p.name + ' | options=' + p.hasOptions + ' | variants=' + p.variantCount);
    });
})().catch(e => console.error(e.message));
