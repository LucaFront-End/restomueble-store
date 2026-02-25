"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWixClient } from "@/hooks/useWixClient";

/**
 * OAuth callback for Wix Members login.
 *
 * Flow:
 * 1. handleLogin() calls auth.generateOAuthData() and stores OAuthData in localStorage
 * 2. User logs in on Wix → redirected here with ?code=...&state=...
 * 3. We retrieve the stored OAuthData (which has codeVerifier) and exchange for member tokens
 */
function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { wixClient, isReady } = useWixClient();

    useEffect(() => {
        if (!isReady) return;

        const handleCallback = async () => {
            const code = searchParams.get("code");
            const state = searchParams.get("state");

            if (!code || !state) {
                router.replace("/");
                return;
            }

            try {
                // Retrieve the OAuthData we stored before the redirect (contains codeVerifier)
                const raw = localStorage.getItem("wix_oauth_data");
                if (!raw) throw new Error("Missing OAuth data in localStorage");

                const oauthData = JSON.parse(raw);
                localStorage.removeItem("wix_oauth_data");

                // Exchange code + codeVerifier for member tokens
                const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
                    searchParams.toString(),
                    oauthData
                );
                await wixClient.auth.setTokens(tokens);

                router.replace("/cuenta");
            } catch (err) {
                console.error("[Auth] Callback failed:", err);
                router.replace("/");
            }
        };

        handleCallback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReady]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
            <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                <p className="text-[var(--text-secondary)] font-light text-sm tracking-wider">
                    Iniciando sesión...
                </p>
            </div>
        </div>
    );
}

export default function LoginCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <CallbackHandler />
        </Suspense>
    );
}
