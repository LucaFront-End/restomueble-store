import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getAllPosts, normalizePostSlug } from "@/lib/wixBlog";
import type { Metadata } from "next";

export const revalidate = 300;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = await getAllPosts(50);
    return posts.map((p) => ({ slug: normalizePostSlug(p.slug) }));
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

    return (
        <main className="bg-white min-h-screen">
            {/* Hero Editorial */}
            <section className="relative h-[70vh] md:h-[90vh] overflow-hidden flex items-end pb-20">
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
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />

                <div className="container relative z-10 px-6 mx-auto">
                    <div className="max-w-4xl">
                        {post.tags[0] && (
                            <span className="inline-block px-4 py-1.5 bg-[var(--accent)] rounded-full text-white text-[10px] font-bold tracking-[0.2em] uppercase mb-8 shadow-xl shadow-[var(--accent)]/20">
                                {post.tags[0]}
                            </span>
                        )}
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.1] mb-10 drop-shadow-2xl">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-white/60 text-xs font-bold tracking-widest uppercase border-t border-white/20 pt-8">
                            {post.publishedDate && (
                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                                    Publicado el {post.publishedDate}
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                                {post.readTime} lectura
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Body */}
            <section className="py-24 md:py-32 px-6">
                <article className="max-w-3xl mx-auto">
                    {/* Excerpt lead */}
                    {post.excerpt && (
                        <p className="text-xl md:text-2xl font-serif text-gray-700 leading-relaxed font-light mb-16 border-l-4 border-[var(--accent)] pl-8">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Rich content from Wix */}
                    <div
                        className="prose prose-lg prose-gray max-w-none
                            prose-headings:font-serif prose-headings:text-gray-900
                            prose-p:leading-[1.9] prose-p:text-gray-600 prose-p:font-light
                            prose-blockquote:border-l-4 prose-blockquote:border-[var(--accent)] prose-blockquote:pl-8
                            prose-img:rounded-2xl prose-img:shadow-xl prose-img:w-full
                            prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: post.richContent || "" }}
                    />

                    {/* CTA Box */}
                    <div className="mt-32 p-10 md:p-20 bg-[var(--brand-navy)] rounded-[2.5rem] relative overflow-hidden group">
                        <div className="relative z-10 text-center">
                            <span className="text-xs font-bold tracking-widest text-[var(--accent)] uppercase mb-6 block">Proyecto de Mobiliario</span>
                            <h3 className="text-3xl md:text-5xl font-serif text-white mb-8">
                                ¿Inspirado por este <em className="italic">diseño</em>?
                            </h3>
                            <p className="text-white/60 mb-12 max-w-xl mx-auto font-light leading-relaxed">
                                Ayudamos a restauranteros y hoteleros a materializar su visión con mobiliario artesanal de alta gama. Platiquemos sobre tu espacio.
                            </p>
                            <Link
                                href="/contacto"
                                className="inline-flex items-center gap-4 px-10 py-5 bg-[var(--accent)] text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-white hover:text-[var(--brand-navy)] transition-all shadow-xl shadow-[var(--accent)]/20"
                            >
                                Contactar Consultor
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] opacity-10 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-150" />
                    </div>

                    {/* Back nav */}
                    <div className="mt-20 flex justify-between items-center border-t border-gray-100 pt-12">
                        <Link
                            href="/blog"
                            className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-[var(--brand-navy)] transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center transition-all group-hover:border-[var(--brand-navy)]">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                                </svg>
                            </div>
                            Regresar al Blog
                        </Link>
                        <span className="hidden md:block text-[10px] font-bold text-gray-300 tracking-[0.3em] uppercase">Gracias por leer</span>
                    </div>
                </article>
            </section>
        </main>
    );
}
