import { getWixServerClient } from "./src/lib/wixClientServer";

async function testCreateProduct() {
    const client = getWixServerClient();
    console.log("Testing product creation permissions...");

    try {
        const product = await client.products.createProduct({
            name: "Test Product " + Date.now(),
            productType: "physical",
            priceData: {
                price: 100
            },
            description: "Testing API permissions"
        });
        console.log("Success! Created product ID:", product._id);
    } catch (err: any) {
        console.error("Failed to create product.");
        console.error("Error Message:", err.message);
        if (err.details) console.log("Details:", JSON.stringify(err.details, null, 2));
    }
}

testCreateProduct();
