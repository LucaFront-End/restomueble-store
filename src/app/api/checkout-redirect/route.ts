import { NextRequest, NextResponse } from "next/server";
import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { redirects } from "@wix/redirects";

export async function POST(req: NextRequest) {
    try {
        const { checkoutId, origin } = await req.json();

        if (!checkoutId) {
            return NextResponse.json({ error: "Missing checkoutId" }, { status: 400 });
        }

        // Use API key strategy for server-side calls — bypasses domain resolution issues
        const wixClient = createClient({
            modules: { redirects },
            auth: ApiKeyStrategy({
                apiKey: process.env.WIX_API_KEY!,
                siteId: process.env.WIX_SITE_ID!,
            }),
        });

        const redirect = await wixClient.redirects.createRedirectSession({
            ecomCheckout: { checkoutId },
            callbacks: {
                postFlowUrl: origin + "/gracias",
                thankYouPageUrl: origin + "/gracias",
            },
        });

        if (redirect.redirectSession?.fullUrl) {
            return NextResponse.json({ url: redirect.redirectSession.fullUrl });
        }

        return NextResponse.json({ error: "No redirect URL returned" }, { status: 500 });
    } catch (error: any) {
        console.error("[API] createRedirectSession error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create checkout redirect" },
            { status: 500 }
        );
    }
}
