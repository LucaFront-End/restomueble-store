const { createClient, OAuthStrategy } = require('@wix/sdk');
const { products } = require('@wix/stores');

const wixClient = createClient({
    modules: { products },
    auth: OAuthStrategy({ clientId: '7cc1d9d9-bb43-4cc0-9280-ff6776106c62' })
});

async function run() {
    try {
        const res = await wixClient.products.queryProducts().limit(10).find();
        res.items.forEach(p => {
            console.log(p.name + " ||| " + (p.media?.mainMedia?.image?.url || ''));
        });
    } catch (e) {
        console.error(e);
    }
}
run();
