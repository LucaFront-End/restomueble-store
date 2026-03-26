import { getWixServerClient } from "@/lib/wixClientServer";
import { NextResponse } from "next/server";

const CATEGORY_IDS = {
    sillas: "1e6161fd-cfbc-4a34-b826-a0d4782faa23",
    mesas: "b61ed7ad-b30c-4c7e-a3ae-177f0a2994a7",
    conjuntos: "10312fa4-6afc-4258-bf01-d24bb61122a5",
    "salas-lounge": "8a850e35-ab0f-41f4-9e4b-6dc957337ddb",
};

export async function GET() {
    const wixClient = getWixServerClient();
    const results: Record<string, any> = {};

    // Test 1: Standard queryProducts with limit 100
    try {
        const all = await wixClient.products.queryProducts().limit(100).find();
        results.totalProducts = all.items.length;
        results.hasNextPage = all.hasNext();
        
        // Gather all collectionIds
        const seenIds = new Set<string>();
        all.items.forEach(p => p.collectionIds?.forEach(id => seenIds.add(id)));
        results.allCollectionIds = Array.from(seenIds);

        // Check each category
        results.filterTest = {};
        for (const [name, id] of Object.entries(CATEGORY_IDS)) {
            const matched = all.items.filter(p => p.collectionIds?.includes(id));
            results.filterTest[name] = {
                id,
                matchCount: matched.length,
                sample: matched.slice(0, 2).map(p => p.name),
            };
        }
    } catch (e: any) {
        results.test1Error = e.message;
    }

    // Test 2: Try fetching page 2 if exists
    try {
        const page2 = await wixClient.products.queryProducts().skip(100).limit(50).find();
        results.page2Count = page2.items.length;
        const seenIds2 = new Set<string>();
        page2.items.forEach(p => p.collectionIds?.forEach(id => seenIds2.add(id)));
        results.page2CollectionIds = Array.from(seenIds2);
        
        for (const [name, id] of Object.entries(CATEGORY_IDS)) {
            const matched = page2.items.filter(p => p.collectionIds?.includes(id));
            if (matched.length > 0) {
                results.page2Matches = results.page2Matches || {};
                results.page2Matches[name] = matched.length;
            }
        }
    } catch (e: any) {
        results.page2Error = e.message;
    }

    // Test 3: Try eq filter directly
    try {
        const eqResult = await wixClient.products.queryProducts()
            .eq("collectionIds", CATEGORY_IDS.sillas)
            .limit(5)
            .find();
        results.eqFilterSillas = {
            count: eqResult.items.length,
            sample: eqResult.items.slice(0, 3).map(p => p.name),
        };
    } catch (e: any) {
        results.eqFilterError = e.message;
    }

    // Test 4: Try field expansion / rawQuery pattern
    try {
        // Fetch first product and dump ALL fields to see what's available
        const first = await wixClient.products.queryProducts().limit(1).find();
        if (first.items[0]) {
            results.firstProductAllFields = {
                name: first.items[0].name,
                collectionIds: first.items[0].collectionIds,
                slug: first.items[0].slug,
                allKeys: Object.keys(first.items[0]),
            };
        }
    } catch (e: any) {
        results.firstProductError = e.message;
    }

    return NextResponse.json(results, { status: 200 });
}
