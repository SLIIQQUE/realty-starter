import type { Metadata } from "next";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";
import { getAgents, getAgentBySlug } from "@/lib/content/agents";
import { BRAND } from "@/data/brand";
import { pageAlternates, pageSocial, SITE_URL } from "@/lib/seo";
import { resolveImageSrc } from "@/lib/content/image";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const agents = await getAgents();
  return agents.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);
  if (!agent) return {};
  const title = `${agent.name}, ${agent.title}`;
  const description = `${agent.name} is the ${agent.title} in this SLIIQQUE Toronto real estate concept: ${agent.languages?.join(", ") ?? "English"} speaking, covering Toronto and the GTA. Sample profile, not a licensed registrant.`;
  return {
    title,
    description,
    alternates: pageAlternates(`/team/${agent.slug}`),
    ...pageSocial({
      title,
      description,
      path: `/team/${agent.slug}`,
      image: agent.photo ? `${SITE_URL}${resolveImageSrc(agent.photo)}` : undefined,
    }),
  };
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { slug } = await params;
  const agent = await getAgentBySlug(slug);
  if (!agent) notFound();

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="about-hero">
            <Reveal as="div" className="about-hero__photo">
              <ImageWithSkeleton src={agent.photo} alt={agent.name} fill sizes="(max-width: 1199px) 100vw, 520px" priority />
              <div className="cred-card" style={{ left: 20, bottom: 20, width: 280 }}>
                <p className="eyebrow">Credentials</p>
                <ul>
                  <li>{agent.licenceNumber}</li>
                  <li>{agent.brokerage}</li>
                  <li>
                    <a href={BRAND.agent.regulatorUrl} target="_blank" rel="noopener noreferrer">
                      {agent.regulator}
                    </a>
                  </li>
                </ul>
              </div>
            </Reveal>
            <div>
              <Reveal as="p" className="eyebrow">
                Team member
              </Reveal>
              <SplitHeading as="h1">
                Meet <em>{agent.name}.</em>
              </SplitHeading>
              <p className="lead" style={{ marginTop: 10 }}>
                {agent.title} at {agent.brokerage}
              </p>
              <p style={{ marginTop: 20, color: "var(--c-muted)" }}>{agent.bio}</p>

              <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 10 }}>
                {agent.designations.map((d) => (
                  <span key={d} className="tag" style={{ marginLeft: 0 }}>
                    {d}
                  </span>
                ))}
                {agent.languages.length > 0 && (
                  <span className="tag" style={{ marginLeft: 0 }}>
                    Speaks {agent.languages.join(" & ")}
                  </span>
                )}
              </div>

              <div style={{ marginTop: 30 }}>
                <p className="eyebrow">Contact</p>
                <ul style={{ marginTop: 16, color: "var(--c-muted)" }}>
                  <li>
                    <a href={BRAND.whatsappHref}>WhatsApp: {BRAND.whatsappNumber}</a>
                  </li>
                  <li style={{ marginTop: 8 }}>
                    <a href={`mailto:${agent.email}`}>{agent.email}</a>
                  </li>
                </ul>
              </div>

              <Reveal as="div" className="hero__actions" style={{ marginTop: 30 }}>
                <RollButton href="/contact" variant="forest">
                  Talk to {agent.name.split(" ")[0]}
                </RollButton>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {agent.gallery && agent.gallery.length > 0 && (
        <section className="section">
          <div className="container">
            <p className="eyebrow">More of {agent.name.split(" ")[0]}</p>
            <Reveal as="div" className="agent-gallery" style={{ marginTop: 20 }}>
              {agent.gallery.map((photo) => (
                <div className="card-img" key={photo}>
                  <ImageWithSkeleton className="bg" src={photo} alt={agent.name} fill sizes="(max-width: 809px) 100vw, 33vw" />
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </main>
  );
}
