import { NextRequest, NextResponse } from "next/server";
import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { orders } from "@wix/ecom";
import { members } from "@wix/members";

export async function POST(req: NextRequest) {
    try {
        const { memberId } = await req.json();

        const apiKey = process.env.WIX_API_KEY;
        const siteId = process.env.WIX_SITE_ID;

        if (!apiKey || !siteId) {
            return NextResponse.json({ error: "Server config missing" }, { status: 500 });
        }

        const wixClient = createClient({
            modules: { orders, members },
            auth: ApiKeyStrategy({ apiKey, siteId }),
        });

        // Fetch member profile
        let profile = null;
        if (memberId) {
            try {
                const memberData = await wixClient.members.getMember(memberId, { fieldsets: ["FULL"] });
                profile = {
                    name: (memberData as any)?.contact?.firstName || "",
                    lastName: (memberData as any)?.contact?.lastName || "",
                    email: (memberData as any)?.loginEmail || "",
                    phone: (memberData as any)?.contact?.phones?.[0] || "",
                };
            } catch (e: any) {
                console.warn("[member-data] Failed to get member:", e?.message);
            }
        }

        // Fetch orders for this member
        let memberOrders: any[] = [];
        if (memberId) {
            try {
                const result = await wixClient.orders.searchOrders({
                    filter: { "buyerInfo.memberId": { "$eq": memberId } },
                } as any);
                memberOrders = (result.orders || []).map((o: any) => ({
                    id: o._id,
                    number: o.number,
                    status: o.status,
                    total: o.priceSummary?.total?.formattedAmount || o.priceSummary?.total?.amount || "0",
                    currency: o.currency,
                    createdDate: o._createdDate,
                    items: (o.lineItems || []).map((li: any) => ({
                        name: li.productName?.translated || li.productName?.original || "Producto",
                        quantity: li.quantity,
                        price: li.price?.formattedAmount || li.price?.amount || "0",
                        image: li.image?.url || "",
                    })),
                }));
            } catch (e: any) {
                console.warn("[member-data] Failed to get orders:", e?.message);
            }
        }

        return NextResponse.json({ profile, orders: memberOrders });
    } catch (error: any) {
        console.error("[member-data] Error:", error?.message);
        return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
    }
}
