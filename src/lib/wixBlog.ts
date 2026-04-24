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
 *
 * Wix stores images as:
 *   wix:image://v1/<fileId>~mv2.jpg/<filename>#originWidth=W&originHeight=H
 *
 * The public URL pattern is:
 *   https://static.wixstatic.com/media/<fileId>~mv2.jpg
 */
function wixImageToUrl(wixUri: string | undefined): string {
    if (!wixUri) return "";
    if (wixUri.startsWith("http")) return wixUri; // Already a real URL

    // wix:image://v1/<fileId>/<filename>#...
    const match = wixUri.match(/wix:image:\/\/v1\/([^/]+)\//);
    if (!match) return "";
    const fileId = match[1];
    return `https://static.wixstatic.com/media/${fileId}`;
}

/** Strip accents and lowercase — mirrors Wix slug generation */
function normalize(str: string): string {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

// ─── Ricos JSON → HTML converter ─────────────────────────────────────────────
// Converts Wix's Ricos document nodes into semantic HTML.

interface RicosNode {
    type: string;
    id?: string;
    nodes?: RicosNode[];
    textData?: {
        text: string;
        decorations?: { type: string; fontWeightValue?: number }[];
    };
    paragraphData?: { textStyle?: { textAlignment?: string } };
    headingData?: { level?: number; textStyle?: { textAlignment?: string } };
    imageData?: {
        image?: { src?: { id?: string }; width?: number; height?: number };
        containerData?: { alignment?: string };
        altText?: string;
    };
    blockquoteData?: unknown;
    listData?: unknown;
    codeBlockData?: unknown;
    videoData?: unknown;
    dividerData?: unknown;
}

function ricosNodesToHtml(nodes: RicosNode[]): string {
    if (!nodes || nodes.length === 0) return "";
    return nodes.map(renderNode).join("");
}

function renderNode(node: RicosNode): string {
    switch (node.type) {
        case "PARAGRAPH":
            return `<p>${renderChildren(node)}</p>`;

        case "HEADING": {
            const level = node.headingData?.level || 2;
            const tag = `h${Math.min(Math.max(level, 1), 6)}`;
            return `<${tag}>${renderChildren(node)}</${tag}>`;
        }

        case "TEXT": {
            let text = escapeHtml(node.textData?.text || "");
            const decorations = node.textData?.decorations || [];
            for (const d of decorations) {
                if (d.type === "BOLD") text = `<strong>${text}</strong>`;
                if (d.type === "ITALIC") text = `<em>${text}</em>`;
                if (d.type === "UNDERLINE") text = `<u>${text}</u>`;
            }
            return text;
        }

        case "IMAGE": {
            const imgId = node.imageData?.image?.src?.id;
            if (!imgId) return "";
            const url = `https://static.wixstatic.com/media/${imgId}`;
            const alt = node.imageData?.altText || "";
            const w = node.imageData?.image?.width;
            const h = node.imageData?.image?.height;
            return `<figure><img src="${url}" alt="${escapeHtml(alt)}" ${w ? `width="${w}"` : ""} ${h ? `height="${h}"` : ""} loading="lazy" style="max-width:100%;height:auto;border-radius:1rem;" /></figure>`;
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
            const videoUrl = (node.videoData as any)?.video?.src?.url;
            if (videoUrl) return `<div><a href="${videoUrl}" target="_blank">Ver video</a></div>`;
            return "";
        }

        default:
            // Unknown node — try rendering children anyway
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
        .replace(/>/g, "&gt;");
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
 * First tries an exact match; if not found, falls back to accent-normalized
 * comparison (same strategy used for product slugs).
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const wixClient = getWixServerClient();
        const decodedSlug = decodeURIComponent(slug);

        // 1. Exact match (fast path) — include RICH_CONTENT for article body
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

    // Image field from Wix Blog API: media.wixMedia.image
    const wixImageUri = post.media?.wixMedia?.image;
    const coverImageUrl = wixImageToUrl(wixImageUri);

    const publishedDate = post.firstPublishedDate
        ? new Date(post.firstPublishedDate).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "";

    // Wix Blog uses `hashtags` (string[]), NOT `tags`
    const tags: string[] = post.hashtags || [];

    // Convert Ricos richContent nodes to HTML if present
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
