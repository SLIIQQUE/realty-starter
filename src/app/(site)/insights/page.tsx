import type { Metadata } from "next";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { getPosts } from "@/lib/content/posts";
import { BRAND } from "@/data/brand";
import { pageAlternates, pageSocial } from "@/lib/seo";

const POST_IMAGES = [
  "YakBQUTrOeOG0sP4BryPbWMzhUg.jpg",
  "bszTW1u4QW54iYFG2R7pIPzqon4.jpg",
  "Pj9uv5laqDRjON76kpHxGvMJ5ko.jpg",
  "XYRf4RZvzWJ9msgmqyhKmKj2Lo.jpg",
  "qrlJc4vsKUvEXcbKW4lB1A6DZtU.jpg",
  "jb7LfoHr7Hn32s97adnDQZFO5o.jpg",
];

const TITLE = "Toronto Real Estate Insights";
const DESCRIPTION =
  "Market notes, pricing signals and buyer and seller guidance for Toronto and the GTA, written to be read before a decision.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/insights"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/insights", ogImage: "insights" }),
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main>
      <section className="page-hero page-hero--center">
        <div className="container">
          <div className="stack">
            <Reveal as="p" className="eyebrow">
              The {BRAND.siteName} Journal
            </Reveal>
            <SplitHeading as="h1" style={{ maxWidth: 620 }}>
              Quiet Insight for <em>Thoughtful</em> Decisions
            </SplitHeading>
            <Reveal as="p" className="lead" style={{ maxWidth: 800, marginTop: 10 }}>
              Market notes, neighbourhood guidance, and practical advice for the concept's Toronto and GTA portfolio.
            </Reveal>
          </div>
          <div className="blog-grid" style={{ textAlign: "left" }}>
            {posts.map((post, i) => (
              <Link href={`/insights/${post.slug}`} key={post.slug} className="post">
                <div className="img">
                  <ImageWithSkeleton
                    src={post.heroImg ?? POST_IMAGES[i % POST_IMAGES.length]}
                    alt=""
                    fill
                    sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 367px"
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }} className="t-xs muted">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h4>{post.title}</h4>
                <p>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
