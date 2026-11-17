import { buildMetaCsv, serveCatalogFeed } from "@/lib/catalogFeed";

export const dynamic = "force-dynamic";

export async function GET() {
    return serveCatalogFeed({
        label: "meta.csv",
        contentType: "text/csv; charset=utf-8",
        filename: "meta-catalog-feed.csv",
        serialize: ({ items }) => buildMetaCsv(items),
    });
}
