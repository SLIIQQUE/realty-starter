import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { getTestimonials } from "@/lib/content/testimonials";
import ReviewsFilter from "./ReviewsFilter";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Reviews";
const DESCRIPTION = "Sample buyer and seller reviews for the SLIIQQUE concept demo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/reviews"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/reviews" }),
};

export default async function ReviewsPage() {
  const testimonials = await getTestimonials();

  return (
    <main>
      <section className="page-hero page-hero--center">
        <div className="container">
          <div className="stack">
            <Reveal as="p" className="eyebrow">
              Client reviews
            </Reveal>
            <SplitHeading as="h1">What buyers and sellers say.</SplitHeading>
            <Reveal as="p" className="lead" style={{ maxWidth: 620 }}>
              Sample testimonials written for this concept demo. Filter by buyer or seller below. On a live
              deployment, these would be real, permissioned client reviews.
            </Reveal>
          </div>

          <Reveal as="div" style={{ marginTop: 60, textAlign: "left" }}>
            <ReviewsFilter testimonials={testimonials} />
          </Reveal>

          <p className="t-sm muted" style={{ marginTop: 40 }}>
            See more reviews on{" "}
            {/* Placeholder link: replace with the real Google Business Profile review link on a live deployment. */}
            <a href="https://g.page/r/example" target="_blank" rel="noopener noreferrer" style={{ color: "var(--c-accent)" }}>
              the agent&apos;s Google reviews profile
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
