import type { Metadata } from "next";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";
import PropertyStackCard from "@/components/PropertyStackCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Accordion, { type AccordionItem } from "@/components/Accordion";
import { getNeighbourhoods, getNeighbourhoodBySlug } from "@/lib/content/neighbourhoods";
import { getListings } from "@/lib/content/listings";
import { pageAlternates, pageSocial, placeSchema, faqSchema, SITE_URL } from "@/lib/seo";
import { resolveImageSrc } from "@/lib/content/image";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const neighbourhoods = await getNeighbourhoods();
  return neighbourhoods.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const n = await getNeighbourhoodBySlug(slug);
  if (!n) return {};
  return {
    title: `${n.name} Neighbourhood Guide`,
    description: `${n.name}, Toronto: ${n.blurb}`,
    alternates: pageAlternates(`/neighbourhoods/${n.slug}`),
    ...pageSocial({
      title: `${n.name} Neighbourhood Guide`,
      description: n.blurb,
      path: `/neighbourhoods/${n.slug}`,
      image: n.heroImg ? `${SITE_URL}${resolveImageSrc(n.heroImg)}` : undefined,
      imageAlt: `${n.name}, Toronto`,
      ogImage: "neighbourhoods",
    }),
  };
}

function parsePrice(price: string): number {
  return Number(price.replace(/[^0-9]/g, "")) || 0;
}

function fmtCAD(n: number): string {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
}

const MARKET_SNAPSHOT_LAST_UPDATED = "October 2026";

export default async function NeighborhoodDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [neighborhood, allProperties] = await Promise.all([getNeighbourhoodBySlug(slug), getListings()]);
  if (!neighborhood) notFound();

  const properties = allProperties.filter((p) => p.hood.name === neighborhood.name);

  const prices = properties.map((p) => parsePrice(p.price)).filter((n) => n > 0);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const propertyTypes = Array.from(new Set(properties.map((p) => p.ptype)));

  const [primaryStat, secondaryStat] = neighborhood.stats;
  const localFaqs: AccordionItem[] = [
    {
      q: `What's parking like in ${neighborhood.name}?`,
      a: properties[0]?.park
        ? `It varies by property: for example, sample listings here have included ${properties
            .map((p) => p.park.toLowerCase())
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .join(", ")}. Street permit parking is common for homes without a private drive.`
        : `Parking varies by building and street. Ask about a specific address for exact details.`,
    },
    {
      q: `What's the commute into downtown like from ${neighborhood.name}?`,
      a: primaryStat
        ? `About ${primaryStat[0]} ${primaryStat[1].toLowerCase()}, based on the sample commute data shown above.`
        : `Commute times vary by exact address. Ask Priya for specifics on a property you're considering.`,
    },
    {
      q: `What's the school zone like in ${neighborhood.name}?`,
      a: secondaryStat
        ? `This sample portfolio notes ${secondaryStat[0].toLowerCase()} for ${secondaryStat[1].toLowerCase()}, worth confirming current boundaries directly with the relevant school board.`
        : `School zones and boundaries should always be confirmed directly with the relevant school board before buying.`,
    },
  ];

  return (
    <main>
      <JsonLd
        data={[
          placeSchema(neighborhood, SITE_URL),
          faqSchema(localFaqs.map((f) => ({ q: f.q, a: String(f.a) }))),
        ]}
      />
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs
            siteUrl={SITE_URL}
            items={[
              { name: "Home", href: "/" },
              { name: "Neighbourhoods", href: "/neighbourhoods" },
              { name: neighborhood.name, href: `/neighbourhoods/${neighborhood.slug}` },
            ]}
          />
          <Reveal as="div" className="card-img card-img--tall" style={{ height: 420, marginTop: 20 }}>
            <ImageWithSkeleton className="bg" src={neighborhood.heroImg} alt={neighborhood.name} fill priority sizes="100vw" />
            <div className="card-img__inner" style={{ justifyContent: "flex-end" }}>
              <p className="card-img__loc">{neighborhood.region}</p>
              <h1 className="card-img__title" style={{ fontSize: 40 }}>
                {neighborhood.name}
              </h1>
            </div>
          </Reveal>

          <div className="pd-body" style={{ marginTop: 60 }}>
            <div className="pd-main">
              <div>
                <h3>About {neighborhood.name}</h3>
                {neighborhood.longDescription.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <div>
                <p className="eyebrow" style={{ marginBottom: 30 }}>
                  Market snapshot
                </p>
                <div className="hood-card">
                  <div className="hood-card__head">
                    <div>
                      <h4>Typical price range</h4>
                      <p className="t-sm" style={{ color: "var(--c-white-50)" }}>
                        Based on the sample listings shown for {neighborhood.name}
                      </p>
                    </div>
                  </div>
                  <p>
                    {minPrice && maxPrice
                      ? `Sample listings here range from ${fmtCAD(minPrice)} to ${fmtCAD(maxPrice)} CAD.`
                      : "No active sample listings in this neighbourhood right now."}
                    {propertyTypes.length > 0 ? ` Property types include ${propertyTypes.join(", ")}.` : ""}
                  </p>
                  <p className="t-xs" style={{ color: "var(--c-white-50)", marginTop: 16 }}>
                    Last updated: {MARKET_SNAPSHOT_LAST_UPDATED} · sample data, not a live market feed.
                  </p>
                </div>
              </div>
              {properties.length > 0 && (
                <div>
                  <p className="eyebrow" style={{ marginBottom: 30 }}>
                    Sample properties here
                  </p>
                  <div className="prop-grid">
                    {properties.map((p) => (
                      <PropertyStackCard key={p.slug} property={p} />
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="eyebrow" style={{ marginBottom: 30 }}>
                  {neighborhood.name} FAQ
                </p>
                <Reveal as="div" className="acc">
                  <Accordion items={localFaqs} />
                </Reveal>
              </div>
            </div>
            <aside className="pd-side">
              <div className="hood-card">
                <div className="hood-card__head">
                  <div>
                    <h4>At a glance</h4>
                  </div>
                </div>
                <div className="hood-card__stats">
                  {neighborhood.stats.map(([stat, label]) => (
                    <div key={label}>
                      <strong>{stat}</strong>
                      <span className="eyebrow eyebrow--white50">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="side-card" style={{ marginTop: 20 }}>
                <p className="eyebrow">Looking in {neighborhood.name}?</p>
                <p className="t-sm muted" style={{ marginTop: 16 }}>
                  Tell SLIIQQUE what you&apos;re after and the team will follow up.
                </p>
                <RollButton href="/contact" variant="forest" block>
                  Get in touch
                </RollButton>
              </div>
            </aside>
          </div>

          <div style={{ marginTop: 60, textAlign: "center" }}>
            <Link href="/neighbourhoods" style={{ color: "var(--c-accent)" }}>
              ← All neighbourhoods
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
