import { buildMetaTsv, serveCatalogFeed } from "@/lib/catalogFeed";

export const dynamic = "force-dynamic";

export async function GET() {
    return serveCatalogFeed({
        label: "meta.tsv",
        contentType: "text/tab-separated-values; charset=utf-8",
        filename: "meta-catalog-feed.tsv",
        serialize: ({ items }) => buildMetaTsv(items),
    });
}
