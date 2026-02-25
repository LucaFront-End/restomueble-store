"use client";

import { createClient, OAuthStrategy, Tokens, EMPTY_TOKENS } from "@wix/sdk";
import { products } from "@wix/stores";
import { currentCart, orders } from "@wix/ecom";
import { redirects } from "@wix/redirects";
import Cookies from "js-cookie";
import { createContext, ReactNode, useEffect, useState } from "react";

const WIX_CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "";
const TOKEN_COOKIE = "wix_session";

function createCookieTokenStorage() {
    return {
        getTokens(): Tokens {
            try {
                const raw = Cookies.get(TOKEN_COOKIE);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed?.accessToken?.value && parsed?.refreshToken?.value) {
                        return parsed as Tokens;
                    }
                }
            } catch {
                // Corrupted cookie
            }
            return EMPTY_TOKENS;
        },
        setTokens(tokens: Tokens): void {
            Cookies.set(TOKEN_COOKIE, JSON.stringify(tokens), {
                expires: 30,
                sameSite: "Lax",
            });
        },
    };
}

function buildWixClient() {
    return createClient({
        modules: {
            products,
            currentCart,
            orders,
            redirects,
        },
        auth: OAuthStrategy({
            clientId: WIX_CLIENT_ID,
            tokenStorage: createCookieTokenStorage(),
        }),
    });
}

export type WixClient = ReturnType<typeof buildWixClient>;

interface WixContextValue {
    wixClient: WixClient;
    isReady: boolean;
}

export const WixContext = createContext<WixContextValue>({
    wixClient: buildWixClient(),
    isReady: false,
});

export const WixContextProvider = ({ children }: { children: ReactNode }) => {
    const [wixClient] = useState<WixClient>(() => buildWixClient());
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            const existing = Cookies.get(TOKEN_COOKIE);
            if (!existing) {
                try {
                    await wixClient.auth.generateVisitorTokens();
                } catch (err) {
                    console.error("[Wix] Failed to generate visitor tokens:", err);
                }
            }
            setIsReady(true);
        };

        init();
    }, [wixClient]);

    return (
        <WixContext.Provider value={{ wixClient, isReady }}>
            {children}
        </WixContext.Provider>
    );
};
