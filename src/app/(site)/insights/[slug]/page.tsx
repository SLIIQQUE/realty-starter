import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { articleSchema, pageAlternates, pageSocial, SITE_URL } from "@/lib/seo";
import { getPosts, getPostBySlug } from "@/lib/content/posts";
import { BRAND } from "@/data/brand";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: pageAlternates(`/insights/${post.slug}`),
    ...pageSocial({ title: post.title, description: post.excerpt, path: `/insights/${post.slug}` }),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <main>
      <JsonLd data={[articleSchema(post, SITE_URL)]} />
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs
            siteUrl={SITE_URL}
            items={[
              { name: "Home", href: "/" },
              { name: "Insights", href: "/insights" },
              { name: post.title, href: `/insights/${post.slug}` },
            ]}
          />
          <article className="legal" style={{ textAlign: "left", marginTop: 20 }}>
            <p className="eyebrow">
              {post.category} · {post.date} · By {BRAND.agent.name}
            </p>
            <SplitHeading as="h1" style={{ textAlign: "left", marginTop: 10 }}>
              {post.title}
            </SplitHeading>
            <div style={{ marginTop: 40 }}>
              {post.body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} style={{ textAlign: "left" }}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div style={{ marginTop: 60 }}>
              <RollButton href="/insights" variant="ghost">
                Back to the journal
              </RollButton>
            </div>
          </article>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="t-xs muted" style={{ textAlign: "center" }}>
            Part of the{" "}
            <Link href="/" style={{ color: "var(--c-accent)" }}>
              {BRAND.siteName}
            </Link>{" "}
            concept demo.
          </p>
        </div>
      </section>
    </main>
  );
}
