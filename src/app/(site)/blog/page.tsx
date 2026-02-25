import { getAllPosts, BlogPost, normalizePostSlug } from "@/lib/wixBlog";
import SectionHero from "@/components/SectionHero";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";

export const revalidate = 300; // Refresh every 5 minutes

export const metadata: Metadata = {
    title: "Blog | Josepja — Diseño y tendencias para hospitalidad",
    description: "Artículos sobre diseño de interiores, tendencias en la industria gastronómica y consejos para optimizar tu espacio.",
};

export default async function BlogPage() {
    const posts = await getAllPosts(30);

    return (
        <main className="bg-white min-h-screen">
            {/* Hero */}
            <SectionHero
                overline="Journal"
                title={<>Nuestras <em className="text-[var(--accent)] not-italic">historias</em> de diseño</>}
                subtitle="Artículos sobre diseño de interiores, tendencias gastronómicas y consejos para tu negocio."
                backgroundImage="/images/blog-hero.jpg"
            />

            {/* Categories sticky bar */}
            <section className="sticky top-[var(--header-height)] z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4">
                <div className="container mx-auto px-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="text-[10px] font-bold tracking-[0.15em] uppercase px-5 py-2 rounded-full bg-[var(--brand-navy)] text-white shadow-lg shadow-[var(--brand-navy)]/20">
                        Todos
                    </span>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-20 px-6">
                <div className="max-w-[1240px] mx-auto">
                    {posts.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {posts.map((post, idx) => (
                                <PostCard key={post.id} post={post} featured={idx === 0} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-32 bg-gray-50 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="bg-[var(--brand-navy-deep)] rounded-[2.5rem] p-10 md:p-24 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
                        <div className="relative z-10 max-w-2xl">
                            <span className="text-xs font-bold tracking-[0.3em] text-[var(--accent)] uppercase mb-8 block">Newsletter</span>
                            <h2 className="text-4xl md:text-6xl font-serif !text-white mb-8 leading-tight">
                                Recibe ideas de <em className="italic !text-white/50">diseño</em> en tu correo
                            </h2>
                            <NewsletterForm />
                        </div>
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)] opacity-5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    </div>
                </div>
            </section>
        </main>
    );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, featured }: { post: BlogPost; featured?: boolean }) {
    const hasImage = !!post.coverImageUrl;

    return (
        <article className={`group flex flex-col ${featured ? "md:col-span-2 lg:col-span-2 mb-8 md:mb-12" : ""}`}>
            <Link
                href={`/blog/${normalizePostSlug(post.slug)}`}
                className="relative block overflow-hidden rounded-[2rem] aspect-[16/9] mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-500 bg-gray-100"
            >
                {hasImage ? (
                    <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-[1.5s] ease-in-out group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-4xl font-serif text-gray-300">J</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                {post.tags[0] && (
                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md text-[var(--brand-navy)] text-[10px] font-bold tracking-[0.2em] uppercase rounded-full shadow-lg">
                        {post.tags[0]}
                    </div>
                )}
            </Link>

            <div className="px-2">
                <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.15em] text-gray-400 uppercase mb-4">
                    <span>{post.publishedDate}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                    <span>{post.readTime} lectura</span>
                </div>
                <h3 className={`font-serif text-gray-900 group-hover:text-[var(--accent)] transition-colors duration-300 mb-4 leading-[1.1] ${featured ? "text-3xl md:text-5xl" : "text-2xl"}`}>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className={`text-gray-500 font-light leading-relaxed mb-8 ${featured ? "text-lg md:text-xl max-w-2xl" : "text-sm"}`}>
                    {post.excerpt}
                </p>
                <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-[var(--brand-navy)] group-hover:text-[var(--accent)] transition-colors"
                >
                    Leer Artículo
                    <span className="flex items-center justify-center w-6 h-6 rounded-full border border-current group-hover:border-[var(--accent)] transition-colors">
                        <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                </Link>
            </div>
        </article>
    );
}

// ─── Empty state when blog has no posts ──────────────────────────────────────
function EmptyState() {
    return (
        <div className="text-center py-32">
            <p className="text-2xl font-serif text-gray-300 mb-4">Próximamente</p>
            <p className="text-gray-400 text-sm font-light">
                Activa el Blog de Wix en tu panel y publica tu primer artículo — aparecerá aquí automáticamente.
            </p>
        </div>
    );
}
