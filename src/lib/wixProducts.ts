import { getWixServerClient } from "@/lib/wixClientServer";
import { products } from "@wix/stores";

/**
 * Fetches ALL products from Wix, paginating through all pages.
 * The default queryProducts() limit is 100, but the store may have
 * more products — this ensures all are fetched.
 */
export async function getAllProducts(): Promise<products.Product[]> {
    const wixClient = getWixServerClient();
    const allItems: products.Product[] = [];
    let skip = 0;
    const limit = 100;

    while (true) {
        const result = await wixClient.products
            .queryProducts()
            .skip(skip)
            .limit(limit)
            .find();

        allItems.push(...result.items);

        if (!result.hasNext()) break;
        skip += limit;
    }

    return allItems;
}
