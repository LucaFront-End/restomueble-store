import { NextRequest, NextResponse } from "next/server";
import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { redirects } from "@wix/redirects";

export async function POST(req: NextRequest) {
    try {
        const { checkoutId, origin, accessToken } = await req.json();

        if (!checkoutId) {
            return NextResponse.json({ error: "Missing checkoutId" }, { status: 400 });
        }

        const apiKey = process.env.WIX_API_KEY;
        const siteId = process.env.WIX_SITE_ID;

        if (!apiKey || !siteId) {
            return NextResponse.json({ error: "Missing WIX_API_KEY or WIX_SITE_ID" }, { status: 500 });
        }

        // Extract memberId from the access token JWT (if user is logged in)
        let memberId: string | undefined;
        if (accessToken) {
            try {
                // Wix access tokens are JWTs — decode the payload to get memberId
                const parts = accessToken.split(".");
                if (parts.length >= 2) {
                    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
                    // Wix JWT payload contains data with member id
                    if (payload?.data) {
                        const data = typeof payload.data === "string" ? JSON.parse(payload.data) : payload.data;
                        memberId = data?.id || data?.memberId;
                    }
                }
            } catch (e) {
                console.warn("[checkout-redirect] Failed to decode access token:", e);
            }
        }

        const wixClient = createClient({
            modules: { redirects },
            auth: ApiKeyStrategy({
                apiKey,
                siteId,
            }),
        });

        // Build redirect params — include both checkout AND member login if we have a member
        const redirectParams: any = {
            ecomCheckout: { checkoutId },
            callbacks: {
                postFlowUrl: origin + "/gracias",
                thankYouPageUrl: origin + "/gracias",
            },
        };

        // If we know the member, tell Wix to log them in during the redirect
        if (memberId) {
            redirectParams.auth = {
                authRequest: {
                    memberId,
                    redirectUri: origin + "/gracias",
                },
            };
        }

        console.log("[checkout-redirect] Creating redirect session", {
            checkoutId,
            memberId: memberId || "none",
        });

        const redirect = await wixClient.redirects.createRedirectSession(redirectParams);

        if (redirect.redirectSession?.fullUrl) {
            return NextResponse.json({ url: redirect.redirectSession.fullUrl });
        }

        return NextResponse.json({ error: "No redirect URL returned" }, { status: 500 });
    } catch (error: any) {
        console.error("[checkout-redirect] Error:", error?.message || error);
        return NextResponse.json(
            { error: error?.message || "Failed to create checkout redirect" },
            { status: 500 }
        );
    }
}
