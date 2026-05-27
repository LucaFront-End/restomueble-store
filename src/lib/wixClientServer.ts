import { createClient, ApiKeyStrategy, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";
import { currentCart, orders } from "@wix/ecom";
import { items } from "@wix/data";
import { posts } from "@wix/blog";
import { contacts } from "@wix/crm";

/**
 * Server-side Wix client.
 *
 * Uses ApiKeyStrategy when WIX_API_KEY + WIX_SITE_ID are available
 * (reliable for server-side data fetching — blog, products, etc.).
 * Falls back to OAuthStrategy with the public client ID for
 * environments where API keys are not configured.
 */
export const getWixServerClient = () => {
    const apiKey = process.env.WIX_API_KEY;
    const siteId = process.env.WIX_SITE_ID;
    const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "";

    const auth =
        apiKey && siteId
            ? ApiKeyStrategy({ apiKey, siteId })
            : OAuthStrategy({ clientId });

    return createClient({
        modules: {
            products,
            currentCart,
            orders,
            items,     // Wix CMS
            posts,     // Wix Blog
            contacts,  // Wix CRM
        },
        auth,
    });
};
