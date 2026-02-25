const { createClient, OAuthStrategy } = require('@wix/sdk');
const { collections } = require('@wix/stores');
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

async function listCollections() {
    if (!clientId) {
        console.error("❌ No Client ID found in .env.local");
        return;
    }

    const wixClient = createClient({
        modules: {
            collections,
        },
        auth: OAuthStrategy({
            clientId: clientId,
        }),
    });

    try {
        const result = await wixClient.collections.queryCollections().find();
        console.log("COLLECTIONS_LIST_START");
        result.items.forEach(c => {
            console.log(`${c.name}|${c._id}`);
        });
        console.log("COLLECTIONS_LIST_END");
    } catch (error) {
        console.error("❌ Error fetching collections:", error.message);
    }
}

listCollections();
