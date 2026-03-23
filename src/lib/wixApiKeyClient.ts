import { createClient, ApiKeyStrategy } from "@wix/sdk";
import { contacts } from "@wix/crm";
import { items } from "@wix/data";

/**
 * Wix server client using an API Key.
 * This has elevated permissions needed to create CRM contacts and CMS items.
 *
 * Required env vars:
 *   WIX_API_KEY     — from Wix Dev Center > API Keys (needs CRM.Contacts + CMS.Data)
 *   WIX_SITE_ID     — the Site ID (from Wix Dashboard URL or Settings > General)
 *
 * @see https://dev.wix.com/docs/rest/getting-started/api-keys
 */
export const getWixApiKeyClient = () => {
    const apiKey = process.env.WIX_API_KEY || "";
    const siteId = process.env.WIX_SITE_ID || "";

    if (!apiKey || !siteId) {
        throw new Error(
            "[Wix] WIX_API_KEY and WIX_SITE_ID are required for CRM/CMS operations. " +
            "Generate an API Key in Wix Dev Center with CRM + CMS permissions."
        );
    }

    return createClient({
        modules: { contacts, items },
        auth: ApiKeyStrategy({ apiKey, siteId }),
    });
};

