import { createClient, OAuthStrategy } from "@wix/sdk";
import { products } from "@wix/stores";
import { currentCart, orders } from "@wix/ecom";
import { items } from "@wix/data";
import { posts } from "@wix/blog";
import { contacts } from "@wix/crm";

export const getWixServerClient = () => {
    return createClient({
        modules: {
            products,
            currentCart,
            orders,
            items,   // Wix CMS
            posts,   // Wix Blog
            contacts, // Wix CRM
        },
        auth: OAuthStrategy({
            clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "",
        }),
    });
};

