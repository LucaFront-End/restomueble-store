import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getAllPosts, normalizePostSlug } from "@/lib/wixBlog";
import type { Metadata } from "next";

export const revalidate = 300; // 5 min — se actualiza dinámicamente

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    try {
        const posts = await getAllPosts(50);
        return posts.map((p) => ({ slug: normalizePostSlug(p.slug) }));
    } catch (e) {
        console.error("[Blog] Error fetching posts for static params:", e);
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Artículo no encontrado" };
    return {
        title: `${post.title} | Blog Josepja`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : [],
        },
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) notFound();

    // Fetch related posts for "Más artículos" section
    const allPosts = await getAllPosts(10);
    const relatedPosts = allPosts
        .filter((p) => p.id !== post.id)
        .slice(0, 3);

    return (
        <main className="bg-white min-h-screen">
            {/* ═══ Hero Editorial ═══ */}
            <section className="relative h-[60vh] md:h-[85vh] overflow-hidden flex items-end pb-16 md:pb-20">
                {post.coverImageUrl ? (
                    <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-navy-deep)] to-gray-900" />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                <div className="container relative z-10 px-6 mx-auto">
                    <div className="max-w-4xl">
                        {/* Category tag */}
                        {post.tags[0] && (
                            <span className="inline-block px-5 py-2 bg-[var(--accent)] rounded-full text-white text-[10px] font-bold tracking-[0.2em] uppercase mb-6 shadow-xl shadow-[var(--accent)]/20">
                                {post.tags[0]}
                            </span>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] mb-8 drop-shadow-2xl">
                            {post.title}
                        </h1>

                        {/* Meta bar */}
                        <div className="flex flex-wrap items-center gap-6 text-white/60 text-[11px] font-bold tracking-widest uppercase border-t border-white/20 pt-6">
                            {post.publishedDate && (
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                                    {post.publishedDate}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                                {post.readTime} lectura
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Article Body ═══ */}
            <section className="py-16 md:py-24 px-6">
                <article className="max-w-3xl mx-auto">
                    {/* Excerpt lead */}
                    {post.excerpt && (
                        <p className="text-lg md:text-xl font-serif text-gray-600 leading-relaxed font-light mb-12 border-l-4 border-[var(--accent)] pl-6 md:pl-8">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Rich content from Wix */}
                    <div
                        className="blog-content"
                        dangerouslySetInnerHTML={{ __html: post.richContent || "" }}
                    />

                    {/* ═══ CTA Box ═══ */}
                    <div className="mt-24 p-8 md:p-16 bg-[var(--brand-navy)] rounded-[2rem] relative overflow-hidden group">
                        <div className="relative z-10 text-center">
                            <span className="text-xs font-bold tracking-widest text-[var(--accent)] uppercase mb-4 block">
                                Proyecto de Mobiliario
                            </span>
                            <h3 className="text-2xl md:text-4xl font-serif text-white mb-6">
                                ¿Inspirado por este <em className="italic">diseño</em>?
                            </h3>
                            <p className="text-white/60 mb-10 max-w-xl mx-auto font-light leading-relaxed text-sm md:text-base">
                                Ayudamos a restauranteros y hoteleros a materializar su visión
                                con mobiliario artesanal de alta gama.
                            </p>
                            <Link
                                href="/contacto"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-white hover:text-[var(--brand-navy)] transition-all shadow-xl shadow-[var(--accent)]/20"
                            >
                                Contactar Consultor
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] opacity-10 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-150" />
                    </div>

                    {/* ═══ Back nav ═══ */}
                    <div className="mt-16 flex justify-between items-center border-t border-gray-100 pt-10">
                        <Link
                            href="/blog"
                            className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-[var(--brand-navy)] transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition-all group-hover:border-[var(--brand-navy)]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                </svg>
                            </div>
                            Regresar al Blog
                        </Link>
                        <span className="hidden md:block text-[10px] font-bold text-gray-300 tracking-[0.3em] uppercase">
                            Gracias por leer
                        </span>
                    </div>
                </article>
            </section>

            {/* ═══ Related Posts ═══ */}
            {relatedPosts.length > 0 && (
                <section className="py-20 px-6 bg-gray-50">
                    <div className="max-w-[1240px] mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--accent)] uppercase mb-4 block">
                                Sigue leyendo
                            </span>
                            <h2 className="text-3xl md:text-5xl font-serif text-gray-900">
                                Más artículos
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {relatedPosts.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/blog/${normalizePostSlug(related.slug)}`}
                                    className="group"
                                >
                                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-gray-100">
                                        {related.coverImageUrl ? (
                                            <Image
                                                src={related.coverImageUrl}
                                                alt={related.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                <span className="text-4xl font-serif text-gray-300">J</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-3">
                                        <span>{related.publishedDate}</span>
                                        <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                                        <span>{related.readTime} lectura</span>
                                    </div>
                                    <h3 className="text-lg font-serif text-gray-900 group-hover:text-[var(--accent)] transition-colors leading-snug">
                                        {related.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
