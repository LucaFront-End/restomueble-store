const { createClient, OAuthStrategy } = require("@wix/sdk");
const { posts } = require("@wix/blog");
require("dotenv").config({ path: ".env.local" });

const client = createClient({
    modules: { posts },
    auth: OAuthStrategy({ clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID }),
});

async function main() {
    const result = await client.posts.queryPosts().limit(5).find();
    console.log("\n=== Total posts:", result.items.length, "===\n");

    result.items.forEach((post, i) => {
        console.log(`\n--- POST ${i + 1} ---`);
        console.log("id:", post.id);
        console.log("slug:", post.slug);
        console.log("title:", post.title);
        console.log("firstPublishedDate:", post.firstPublishedDate);
        console.log("excerpt:", post.excerpt?.slice(0, 80));
        console.log("coverMedia:", JSON.stringify(post.coverMedia, null, 2));
        console.log("media:", JSON.stringify(post.media, null, 2));
        console.log("heroImage:", post.heroImage);
        console.log("tags:", post.tags);
        console.log("categoryIds:", post.categoryIds);
        console.log("All keys:", Object.keys(post));
    });
}

main().catch(console.error);
