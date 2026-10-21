import type { Metadata } from "next";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { getAgents } from "@/lib/content/agents";
import { BRAND } from "@/data/brand";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Toronto Real Estate Team";
const DESCRIPTION =
  "Meet the sample agent behind the SLIIQQUE Toronto concept, including languages, designations and coverage across the GTA.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/team"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/team" }),
};

export default async function TeamPage() {
  const agents = await getAgents();

  return (
    <main>
      <section className="page-hero page-hero--center">
        <div className="container">
          <div className="stack">
            <Reveal as="p" className="eyebrow">
              Meet the team
            </Reveal>
            <SplitHeading as="h1">The people behind the sale.</SplitHeading>
            <Reveal as="p" className="lead" style={{ maxWidth: 620 }}>
              Sample agent profiles written for this concept demo. On a live deployment, this page pulls
              straight from the CMS so a brokerage can add, update, or retire team members without a developer.
            </Reveal>
          </div>

          <Reveal as="div" className="prop-pair" style={{ marginTop: 60, textAlign: "left" }}>
            {agents.sort((a, b) => a.displayOrder - b.displayOrder).map((agent) => (
              <Link href={`/team/${agent.slug}`} className="card-img prop-sm" key={agent.slug}>
                <ImageWithSkeleton className="bg" src={agent.photo} alt={agent.name} fill sizes="(max-width: 809px) 100vw, 50vw" />
                <div className="card-img__inner" style={{ justifyContent: "flex-end" }}>
                  <p className="card-img__loc">
                    {agent.title} · {agent.brokerage}
                  </p>
                  <h4 className="card-img__title">{agent.name}</h4>
                  <p className="card-img__price" style={{ fontSize: "var(--fs-sm)", lineHeight: "var(--lh-sm)" }}>
                    {agent.bio.split(". ")[0]}.
                  </p>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
