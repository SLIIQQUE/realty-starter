import type { Metadata } from "next";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";
import ArticleToc from "@/components/ArticleToc";
import { BRAND } from "@/data/brand";
import { getAgentBySlug } from "@/lib/content/agents";
import { getNeighbourhoods } from "@/lib/content/neighbourhoods";
import { getLocale } from "@/lib/i18n/getLocale";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import { pageAlternates, pageSocial } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const agent = (await getAgentBySlug("priya-mehta"))!;
  const title = "About";
  const description = `Meet ${agent.name} and learn what the ${BRAND.siteName} concept is, who built it, and why it exists.`;
  return {
    title,
    description,
    alternates: pageAlternates("/about", { languages: true }),
    ...pageSocial({ title, description, path: "/about" }),
  };
}

const SPECIALTIES = [
  "First-time buyers navigating pre-approval and down payments in Liberty Village and Leslieville condos",
  "Newcomers to Canada buying their first home across the GTA",
  "Small investors building a condo or rental portfolio",
  "Young families moving from a condo into a semi or townhouse",
];

const TOC_ITEMS = [
  { id: "background", label: "Background" },
  { id: "approach", label: "Approach" },
  { id: "values", label: "Values" },
  { id: "stack", label: "Built with" },
];

export default async function AboutPage() {
  const locale = await getLocale();
  const t = locale === "fr" ? fr : en;
  const agent = (await getAgentBySlug("priya-mehta"))!;
  const neighbourhoods = await getNeighbourhoods();
  const heroPhoto = agent.gallery?.[1] ?? agent.photo;

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="about-hero">
            <div>
              <Reveal as="p" className="eyebrow">
                {t.about.eyebrow}
              </Reveal>
              <SplitHeading as="h1">
                {t.about.headingMain} <em>{t.about.headingEm}</em>
              </SplitHeading>
              <Reveal as="p" className="lead" style={{ marginTop: 10, maxWidth: 420 }}>
                {t.about.lead}
              </Reveal>
              <Reveal as="div" className="hero__actions">
                <RollButton href="/contact" variant="forest">
                  {t.about.ctaTalk}
                </RollButton>
                <RollButton href="/listings" variant="ghost">
                  {t.about.ctaListings}
                </RollButton>
              </Reveal>
            </div>
            <Reveal as="div" className="about-hero__photo">
              <ImageWithSkeleton
                src={heroPhoto}
                alt=""
                fill
                sizes="(max-width: 809px) 100vw, 50vw"
                style={{ objectPosition: "top" }}
              />
              <div className="cred-card" style={{ right: 20, bottom: 20, width: 260 }}>
                <p className="eyebrow">This project</p>
                <ul>
                  <li>Next.js 15, App Router</li>
                  <li>6 sample properties, 6 neighbourhoods</li>
                  <li>Real email via Resend</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="stats-band">
        <div className="container">
          <Reveal as="div" className="row">
            <div>
              <strong>SLIIQQUE</strong>
              <span>{BRAND.hq}</span>
            </div>
            <div>
              <strong>2025</strong>
              <span>Studio founded</span>
            </div>
            <div>
              <strong>6</strong>
              <span>Sample listings</span>
            </div>
            <div>
              <strong>12+</strong>
              <span>Features implemented</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-hero">
            <Reveal as="div" className="about-hero__photo" style={{ height: 480 }}>
              <ImageWithSkeleton src={agent.photo} alt={agent.name} fill sizes="(max-width: 809px) 100vw, 50vw" />
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
                {t.about.agentEyebrow}
              </Reveal>
              <SplitHeading as="h2">
                Meet <em>{agent.name}.</em>
              </SplitHeading>
              <p className="lead" style={{ marginTop: 10 }}>
                {agent.title} {t.about.titleAt} {agent.brokerage}
              </p>
              <p style={{ marginTop: 20, color: "var(--c-muted)" }}>{agent.bio}</p>
              <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 10 }}>
                {agent.designations.map((d) => (
                  <span key={d} className="tag" style={{ marginLeft: 0 }}>
                    {d}
                  </span>
                ))}
                <span className="tag" style={{ marginLeft: 0 }}>
                  Speaks {agent.languages.join(" & ")}
                </span>
              </div>
              <div style={{ marginTop: 30 }}>
                <p className="eyebrow">Service areas</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
                  {neighbourhoods.map((n) => (
                    <Link key={n.slug} href={`/neighbourhoods/${n.slug}`} className="topic">
                      {n.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 30 }}>
                <p className="eyebrow">Specialties</p>
                <ul style={{ marginTop: 16, paddingLeft: 18, listStyle: "disc", color: "var(--c-muted)" }}>
                  {SPECIALTIES.map((s) => (
                    <li key={s} style={{ marginTop: 8 }}>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: 30 }}>
                <p className="eyebrow">In the community</p>
                <p style={{ marginTop: 16, color: "var(--c-muted)" }}>
                  Priya volunteers with a Mississauga newcomer settlement program, helping new Canadians understand
                  the home-buying process, and sponsors a youth soccer team in Leslieville each summer, sample
                  community details written for this concept demo.
                </p>
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

      <section className="section">
        <div className="container">
          <div className="article">
            <ArticleToc items={TOC_ITEMS} />
            <div className="article__body">
              <section id="background">
                <p className="eyebrow">Background</p>
                <h3>
                  A real-estate site, built <em>in full.</em>
                </h3>
                <p>
                  Most real-estate concept sites are a hero section and a few property cards. This one goes further
                  on purpose: real search and filtering, a map view, a saved-favorites system, a side-by-side
                  comparison tool, a mortgage calculator, and contact, valuation, and newsletter forms that send
                  actual email.
                </p>
                <p>
                  It started from a static HTML template, then was rebuilt from scratch as a componentized Next.js
                  15 application: TypeScript throughout, statically generated where possible, with API routes for
                  the parts that need a server.
                </p>
                <div className="quote-box">
                  <img
                    className="quote-box__mark"
                    style={{ width: 50, height: 50 }}
                    src="/images/WKagG04AvCVspRdazfPUvdxrnY.svg"
                    alt=""
                  />
                  <p>&quot;The brief was simple: fix every missing feature a real agent site would need, for real.&quot;</p>
                </div>
                <p>
                  The six sample properties, their neighborhoods, and every stat on this site are fictional,
                  clearly labeled as such, and built for demonstration, not a real listings feed.
                </p>
              </section>
              <section id="approach">
                <p className="eyebrow">Approach</p>
                <h3>
                  Build the feature, not just the <em>screenshot.</em>
                </h3>
                <p>
                  Every tool on this site actually works: the properties filter narrows real results, the map
                  renders real pins from OpenStreetMap (no API key required), favorites and comparisons persist in
                  your browser, and the contact form posts to a real API route backed by Resend. Nothing here is a
                  static image pretending to be a product.
                </p>
              </section>
              <section id="values">
                <p className="eyebrow">Values</p>
                <h3>
                  Four things this build did not <em>skip.</em>
                </h3>
                <div className="value-grid">
                  <article className="value-card">
                    <span>01</span>
                    <h4>Honesty over polish</h4>
                    <p className="muted">
                      No fabricated client testimonials, no invented license numbers, no fake performance metrics,
                      clearly labeled as a concept throughout.
                    </p>
                  </article>
                  <article className="value-card">
                    <span>02</span>
                    <h4>Real functionality</h4>
                    <p className="muted">
                      Search, filters, map, favorites, comparison, and a mortgage calculator all compute real
                      results from real inputs.
                    </p>
                  </article>
                  <article className="value-card">
                    <span>03</span>
                    <h4>No account required</h4>
                    <p className="muted">
                      Favorites and comparisons live in your browser's storage. Nothing is tracked or sent to a
                      server until you submit a form.
                    </p>
                  </article>
                  <article className="value-card">
                    <span>04</span>
                    <h4>Pixel-level care</h4>
                    <p className="muted">
                      The visual design carries SLIIQQUE's actual brand system (Syne and DM Sans, the indigo accent,
                      the dark theme), not a generic template left untouched.
                    </p>
                  </article>
                </div>
              </section>
              <section id="stack">
                <p className="eyebrow">Built with</p>
                <h3>
                  The stack behind the <em>concept.</em>
                </h3>
                <p>
                  Next.js 15 (App Router) and TypeScript, hand-written CSS matching the SLIIQQUE Brand Book, Leaflet
                  and OpenStreetMap for the map view, and Resend for transactional email. No database: favorites
                  and comparisons use browser storage, and sample listings live in a typed data file.
                </p>
                <div className="follow">
                  <span className="eyebrow">See more from SLIIQQUE:</span>
                  <a href={BRAND.parentSiteUrl}>sliiqque.space</a>
                  <a href={BRAND.social.instagram}>{BRAND.social.handle}</a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <div className="phil">
            <div className="steps__left">
              <p className="eyebrow">Philosophy</p>
              <SplitHeading as="h2">How SLIIQQUE approaches a concept like this.</SplitHeading>
              <p style={{ marginTop: 10, fontSize: 14, lineHeight: "18.2px", color: "var(--c-muted)", maxWidth: 420 }}>
                A concept site is only useful if it tells the truth about what it is while still showing what&apos;s
                possible. That tension shaped every decision here.
              </p>
            </div>
            <div className="steps__vr" />
            <ol className="steps__right">
              <li className="step">
                <span className="step__n">01</span>
                <div>
                  <h4>Build the whole feature</h4>
                  <p>A filter that doesn&apos;t filter, or a form that doesn&apos;t send, is worse than not having it at all.</p>
                </div>
              </li>
              <li className="step">
                <span className="step__n">02</span>
                <div>
                  <h4>Label the concept clearly</h4>
                  <p>A concept banner, an honest footer note, and no fabricated credentials or metrics anywhere.</p>
                </div>
              </li>
              <li className="step">
                <span className="step__n">03</span>
                <div>
                  <h4>Match the brand, not a template</h4>
                  <p>Every color, font, and interaction here comes from SLIIQQUE's actual design system.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-card__copy">
              <p className="eyebrow eyebrow--white">{t.about.ctaFinalEyebrow}</p>
              <h2 className="h2s">
                {t.about.ctaFinalHeadingMain} <em>{t.about.ctaFinalHeadingEm}</em>
              </h2>
              <p>{t.about.ctaFinalBody}</p>
            </div>
            <div className="cta-card__actions">
              <RollButton href="/contact" variant="white">
                {t.about.ctaFinalTalk}
              </RollButton>
              <RollButton href="/listings" variant="copper">
                {t.about.ctaFinalListings}
              </RollButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
