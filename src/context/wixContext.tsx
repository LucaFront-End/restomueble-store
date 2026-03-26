"use client";

import { createClient, OAuthStrategy, Tokens, EMPTY_TOKENS } from "@wix/sdk";
import { products } from "@wix/stores";
import { currentCart, orders } from "@wix/ecom";
import { redirects } from "@wix/redirects";
import { members } from "@wix/members";
import { items } from "@wix/data";
import { createContext, ReactNode, useEffect, useState } from "react";

const WIX_CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID || "";
const TOKEN_KEY = "wix_session";
const MEMBER_FLAG = "wix_is_member";

/** Check if user has an active member session (survives JWT expiry). */
export function isMemberSession(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(MEMBER_FLAG) === "true";
}

/** Set/clear the member session flag. */
export function setMemberFlag(isMember: boolean): void {
    if (typeof window === "undefined") return;
    if (isMember) {
        localStorage.setItem(MEMBER_FLAG, "true");
    } else {
        localStorage.removeItem(MEMBER_FLAG);
        localStorage.removeItem(TOKEN_KEY);
    }
}

function createLocalTokenStorage() {
    return {
        getTokens(): Tokens {
            if (typeof window === "undefined") return EMPTY_TOKENS;
            try {
                const raw = localStorage.getItem(TOKEN_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed?.accessToken?.value && parsed?.refreshToken?.value) {
                        return parsed as Tokens;
                    }
                }
            } catch {
                localStorage.removeItem(TOKEN_KEY);
            }
            return EMPTY_TOKENS;
        },
        setTokens(tokens: Tokens): void {
            if (typeof window === "undefined") return;
            // Protect member tokens from being overwritten with visitor tokens
            const isMember = localStorage.getItem(MEMBER_FLAG) === "true";
            if (isMember) {
                const currentRaw = localStorage.getItem(TOKEN_KEY);
                if (currentRaw) {
                    try {
                        const current = JSON.parse(currentRaw);
                        const incomingRefresh = (tokens as any)?.refreshToken?.value;
                        const currentRefresh = current?.refreshToken?.value;
                        if (currentRefresh && incomingRefresh && currentRefresh !== incomingRefresh) {
                            return; // Block visitor token overwrite
                        }
                    } catch {}
                }
            }
            try {
                localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
            } catch {}
        },
    };
}

function buildWixClient() {
    return createClient({
        modules: { products, currentCart, orders, redirects, items, members },
        auth: OAuthStrategy({
            clientId: WIX_CLIENT_ID,
            tokenStorage: createLocalTokenStorage(),
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
            const existing = localStorage.getItem(TOKEN_KEY);
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
