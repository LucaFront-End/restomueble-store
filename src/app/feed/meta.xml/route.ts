import { buildMetaXml, serveCatalogFeed } from "@/lib/catalogFeed";

export const dynamic = "force-dynamic";

export async function GET() {
    return serveCatalogFeed({
        label: "meta.xml",
        contentType: "application/xml; charset=utf-8",
        serialize: ({ baseUrl, items }) => buildMetaXml(baseUrl, items),
    });
}
