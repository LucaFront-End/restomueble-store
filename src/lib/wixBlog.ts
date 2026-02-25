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
    richContent?: string;
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
 * Fetch a single post by slug.
 * First tries an exact match; if not found, falls back to accent-normalized
 * comparison (same strategy used for product slugs).
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const wixClient = getWixServerClient();
        const decodedSlug = decodeURIComponent(slug);

        // 1. Exact match (fast path)
        const exact = await wixClient.posts
            .queryPosts()
            .eq("slug", decodedSlug)
            .limit(1)
            .find();
        if (exact.items.length > 0) return mapPost(exact.items[0]);

        // 2. Normalized fallback — Wix stored slug has accents, URL doesn't
        const normalizedInput = normalize(decodedSlug);
        const all = await wixClient.posts.queryPosts().limit(100).find();
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

    // Real image field from Wix Blog API: media.wixMedia.image
    const wixImageUri = post.media?.wixMedia?.image;
    const coverImageUrl = wixImageToUrl(wixImageUri);

    const publishedDate = post.firstPublishedDate
        ? new Date(post.firstPublishedDate).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "";

    return {
        id: post.id || post._id || "",
        slug: post.slug || "",
        title,
        excerpt,
        coverImageUrl,
        publishedDate,
        readTime: estimateReadTime(post.minutesToRead),
        categoryIds: post.categoryIds || [],
        tags: post.hashtags || post.tags || [],
        richContent: post.excerpt || "", // Wix blog content fetched separately if needed
    };
}
