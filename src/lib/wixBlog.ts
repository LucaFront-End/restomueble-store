import { getWixServerClient } from "@/lib/wixClientServer";

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImageUrl: string;
    publishedDate: string;
    readTime: string;
    categoryIds: string[];
    tags: string[];
    richContent?: string; // HTML rendered from Wix Ricos nodes
}

function estimateReadTime(minutesToRead?: number, text?: string): string {
    if (minutesToRead && minutesToRead > 0) return `${minutesToRead} min`;
    const words = text?.split(/\s+/).length || 0;
    return `${Math.max(1, Math.round(words / 200))} min`;
}

/**
 * Converts a Wix-internal image URI to a public HTTPS URL.
 */
function wixImageToUrl(wixUri: string | undefined): string {
    if (!wixUri) return "";
    if (wixUri.startsWith("http")) return wixUri;
    const match = wixUri.match(/wix:image:\/\/v1\/([^/]+)\//);
    if (!match) return "";
    return `https://static.wixstatic.com/media/${match[1]}`;
}

/** Strip accents and lowercase — mirrors Wix slug generation */
function normalize(str: string): string {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// ─── Ricos JSON → HTML converter ─────────────────────────────────────────────
// Converts Wix's Ricos document nodes into semantic, well-formatted HTML.

interface RicosDecoration {
    type: string;
    fontWeightValue?: number;
    italicData?: boolean;
    anchorData?: { anchor?: string };
    linkData?: { link?: { url?: string; target?: string } };
}

interface RicosTextData {
    text: string;
    decorations?: RicosDecoration[];
}

interface RicosNode {
    type: string;
    id?: string;
    nodes?: RicosNode[];
    textData?: RicosTextData;
    paragraphData?: { textStyle?: { textAlignment?: string } };
    headingData?: { level?: number; textStyle?: { textAlignment?: string } };
    imageData?: {
        image?: { src?: { id?: string; url?: string }; width?: number; height?: number };
        containerData?: { alignment?: string; width?: { size?: string } };
        altText?: string;
    };
    appEmbedData?: {
        type?: string;
        itemId?: string;
        name?: string;
        url?: string;
        image?: { src?: { id?: string }; width?: number; height?: number };
    };
    blockquoteData?: unknown;
    listData?: unknown;
    codeBlockData?: unknown;
    videoData?: { video?: { src?: { url?: string } } };
    dividerData?: unknown;
}

function ricosNodesToHtml(nodes: RicosNode[]): string {
    if (!nodes || nodes.length === 0) return "";
    return nodes.map(renderNode).join("\n");
}

function renderNode(node: RicosNode): string {
    switch (node.type) {
        case "PARAGRAPH": {
            const inner = renderChildren(node);
            // Skip empty paragraphs but render as spacing
            if (!inner.trim()) return '<div class="blog-spacer"></div>';
            return `<p>${inner}</p>`;
        }

        case "HEADING": {
            const level = node.headingData?.level || 2;
            const tag = `h${Math.min(Math.max(level, 1), 6)}`;
            return `<${tag}>${renderChildren(node)}</${tag}>`;
        }

        case "TEXT": {
            let text = escapeHtml(node.textData?.text || "");
            if (!text) return "";
            const decorations = node.textData?.decorations || [];
            for (const d of decorations) {
                if (d.type === "BOLD") text = `<strong>${text}</strong>`;
                if (d.type === "ITALIC") text = `<em>${text}</em>`;
                if (d.type === "UNDERLINE") text = `<u>${text}</u>`;
                if (d.type === "LINK" && d.linkData?.link?.url) {
                    const url = escapeHtml(d.linkData.link.url);
                    text = `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
                }
            }
            return text;
        }

        case "IMAGE": {
            const imgId = node.imageData?.image?.src?.id || node.imageData?.image?.src?.url;
            if (!imgId) return "";
            const url = imgId.startsWith("http")
                ? imgId
                : `https://static.wixstatic.com/media/${imgId}`;
            const alt = node.imageData?.altText || "";
            const w = node.imageData?.image?.width;
            const h = node.imageData?.image?.height;
            const alignment = node.imageData?.containerData?.alignment || "CENTER";
            const size = node.imageData?.containerData?.width?.size || "CONTENT";
            const alignClass = alignment === "LEFT" ? "blog-img-left" : alignment === "RIGHT" ? "blog-img-right" : "blog-img-center";
            const sizeClass = size === "SMALL" ? "blog-img-small" : "blog-img-full";
            return `<figure class="${alignClass} ${sizeClass}"><img src="${url}" alt="${escapeHtml(alt)}" ${w ? `width="${w}"` : ""} ${h ? `height="${h}"` : ""} loading="lazy" /></figure>`;
        }

        case "APP_EMBED": {
            // Wix embedded product — render as a product card
            const embed = node.appEmbedData;
            if (!embed || embed.type !== "PRODUCT") return "";
            const productImgId = embed.image?.src?.id;
            const productImg = productImgId
                ? `https://static.wixstatic.com/media/${productImgId}`
                : "";
            const productName = escapeHtml(embed.name || "Producto");
            // Link to our own store instead of wix.app
            const slug = (embed.name || "")
                .toLowerCase()
                .replace(/[^a-z0-9áéíóúüñ\s-]/g, "")
                .replace(/\s+/g, "-");
            return `<div class="blog-product-embed">
                ${productImg ? `<img src="${productImg}" alt="${productName}" loading="lazy" />` : ""}
                <div class="blog-product-info">
                    <span class="blog-product-label">Producto Relacionado</span>
                    <strong>${productName}</strong>
                    <a href="/tienda/${slug}" class="blog-product-link">Ver Producto →</a>
                </div>
            </div>`;
        }

        case "BLOCKQUOTE":
            return `<blockquote>${renderChildren(node)}</blockquote>`;

        case "ORDERED_LIST":
            return `<ol>${renderListItems(node)}</ol>`;

        case "BULLETED_LIST":
            return `<ul>${renderListItems(node)}</ul>`;

        case "LIST_ITEM":
            return `<li>${renderChildren(node)}</li>`;

        case "DIVIDER":
            return `<hr />`;

        case "CODE_BLOCK":
            return `<pre><code>${renderChildren(node)}</code></pre>`;

        case "VIDEO": {
            const videoUrl = node.videoData?.video?.src?.url;
            if (videoUrl) {
                return `<div class="blog-video"><a href="${escapeHtml(videoUrl)}" target="_blank" rel="noopener">Ver video ▶</a></div>`;
            }
            return "";
        }

        default:
            if (node.nodes && node.nodes.length > 0) {
                return renderChildren(node);
            }
            return "";
    }
}

function renderChildren(node: RicosNode): string {
    if (!node.nodes || node.nodes.length === 0) return "";
    return node.nodes.map(renderNode).join("");
}

function renderListItems(node: RicosNode): string {
    if (!node.nodes) return "";
    return node.nodes.map(renderNode).join("");
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function getAllPosts(limit = 50): Promise<BlogPost[]> {
    try {
        const wixClient = getWixServerClient();
        const result = await wixClient.posts.queryPosts().limit(limit).find();
        return result.items.map((post) => mapPost(post));
    } catch (error) {
        console.error("[Blog] Error fetching posts:", error);
        return [];
    }
}

/**
 * Fetch a single post by slug — includes RICH_CONTENT for the full body.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const wixClient = getWixServerClient();
        const decodedSlug = decodeURIComponent(slug);

        // 1. Exact match — include RICH_CONTENT for article body
        const exact = await wixClient.posts
            .queryPosts({ fieldsets: ["RICH_CONTENT"] })
            .eq("slug", decodedSlug)
            .limit(1)
            .find();
        if (exact.items.length > 0) return mapPost(exact.items[0]);

        // 2. Normalized fallback — Wix stored slug has accents, URL doesn't
        const normalizedInput = normalize(decodedSlug);
        const all = await wixClient.posts
            .queryPosts({ fieldsets: ["RICH_CONTENT"] })
            .limit(100)
            .find();
        const match = all.items.find(
            (p) => p.slug && normalize(p.slug) === normalizedInput
        );
        return match ? mapPost(match) : null;
    } catch (error) {
        console.error("[Blog] Error fetching post by slug:", error);
        return null;
    }
}

/** Normalize slug for link hrefs (strips accents so URLs are always ASCII) */
export function normalizePostSlug(slug: string): string {
    return normalize(slug);
}

function mapPost(post: any): BlogPost {
    const title = post.title || "Sin título";
    const excerpt = post.excerpt || "";

    const wixImageUri = post.media?.wixMedia?.image;
    const coverImageUrl = wixImageToUrl(wixImageUri);

    const publishedDate = post.firstPublishedDate
        ? new Date(post.firstPublishedDate).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "";

    // Wix Blog uses `hashtags`, NOT `tags`
    const tags: string[] = post.hashtags || [];

    // Convert Ricos richContent nodes to HTML
    let richContentHtml = "";
    if (post.richContent && post.richContent.nodes) {
        richContentHtml = ricosNodesToHtml(post.richContent.nodes);
    }

    return {
        id: post._id || post.id || "",
        slug: post.slug || "",
        title,
        excerpt,
        coverImageUrl,
        publishedDate,
        readTime: estimateReadTime(post.minutesToRead),
        categoryIds: post.categoryIds || [],
        tags,
        richContent: richContentHtml,
    };
}
