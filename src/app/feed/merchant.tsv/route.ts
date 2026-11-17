import { buildGoogleMerchantTsv, serveCatalogFeed } from "@/lib/catalogFeed";

export const dynamic = "force-dynamic";

export async function GET() {
    return serveCatalogFeed({
        label: "merchant.tsv",
        contentType: "text/tab-separated-values; charset=utf-8",
        filename: "merchant.tsv",
        serialize: ({ items }) => buildGoogleMerchantTsv(items),
    });
}
