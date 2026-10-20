import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, RevealLink } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";
import ArticleToc, { type TocItem } from "@/components/ArticleToc";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "The Seller's Guide";
const DESCRIPTION = "What actually adds value before listing, and how private and public sales differ.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/resources/sellers-guide"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/resources/sellers-guide" }),
};

const STEPS = [
  {
    title: "Decide public, private, or both",
    body: "A public listing maximizes exposure; a private or pre-market approach trades some exposure for discretion and the ability to test pricing quietly. Many sellers in this segment start private and go public only if needed.",
  },
  {
    title: "Fix what an inspection would catch anyway",
    body: "A pre-listing inspection surfaces issues while they're still on the seller's timeline, not a buyer's contingency clock. Deferred maintenance (roofing, HVAC, pool equipment) is worth resolving before the first showing.",
  },
  {
    title: "Price for the data, not the hope",
    body: "Comparable sales, not wishful thinking, should set the number. Overpricing by even 5–8% at this level can mean months of sitting, which itself becomes a negative signal to buyers watching days-on-market.",
  },
  {
    title: "Prepare before the camera, not after",
    body: "Staging, landscaping, and photography should happen after repairs and decluttering, not instead of them. The first listing photo usually decides whether a buyer clicks through at all.",
  },
  {
    title: "Qualify showings, not just schedule them",
    body: "Pre-qualified or proof-of-funds requirements before a private showing filter out tourists and protect a seller's time and privacy, especially relevant for higher-value, lower-volume markets.",
  },
  {
    title: "Negotiate the whole offer, not just price",
    body: "Close timeline, contingencies, and deposit size are all negotiable levers. A slightly lower offer with a clean, fast close is often the stronger choice over a higher but contingency-heavy one.",
  },
];

const TOC: TocItem[] = [
  { id: "channels", label: "Public or private" },
  { id: "repairs", label: "Pre-listing fixes" },
  { id: "pricing", label: "Pricing" },
  { id: "prepare", label: "Preparation" },
  { id: "showings", label: "Showings" },
  { id: "negotiate", label: "Negotiation" },
];

/** Arrow used across the site's card affordances (same as the resources page). */
function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SellersGuidePage() {
  return (
    <main>
      {/* 1 · HERO: centred intro with meta tags and a wide image band */}
      <section className="page-hero page-hero--center">
        <div className="container">
          <div className="stack">
            <Reveal as="p" className="eyebrow">
              For sellers
            </Reveal>
            <SplitHeading as="h1">
              The Seller&apos;s <em>Guide</em>
            </SplitHeading>
            <Reveal as="p" className="lead">
              What actually adds value before listing, and how private and public sales differ.
            </Reveal>
            <Reveal as="div" className="guide-tags">
              <span className="tag">6 steps</span>
              <span className="tag">Prep to negotiation</span>
              <span className="tag">Sellers</span>
            </Reveal>
            <Reveal as="div" className="img guide-hero-img">
              <Image
                src="/images/remQfNeRY5YDXjKii4XwKBS6cHI.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 1199px) 100vw, 1140px"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2 · THE GUIDE: sticky table of contents + six step sections */}
      <section className="section">
        <div className="container">
          <div className="article">
            <ArticleToc items={TOC} />
            <div className="article__body">
              {STEPS.map((s, i) => (
                <section key={s.title} id={TOC[i].id}>
                  <p className="eyebrow">Step {String(i + 1).padStart(2, "0")}</p>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  {i === 2 && (
                    <div className="quote-box">
                      <Image
                        className="quote-box__mark"
                        width={50}
                        height={50}
                        src="/images/WKagG04AvCVspRdazfPUvdxrnY.svg"
                        alt=""
                      />
                      <p>
                        Price it once, correctly; every unsold day afterwards works against you.
                      </p>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 · KEEP READING: cross-links back to the selling page and the hub */}
      <section className="section section--sand">
        <div className="container">
          <div className="sec-head sec-head--split">
            <div className="sec-head__title">
              <Reveal as="p" className="eyebrow">
                Keep reading
              </Reveal>
              <SplitHeading as="h2">
                Where to go <em>from here.</em>
              </SplitHeading>
            </div>
            <Reveal as="p" className="lead">
              The full selling page for the journey, marketing plan, and enquiry form, or back to every resource in
              one place.
            </Reveal>
          </div>

          <div className="res-guides sec-body">
            <RevealLink href="/sell" className="res-guide">
              <span className="res-guide__n" aria-hidden="true">
                01
              </span>
              <p className="eyebrow">Main page</p>
              <h3>Selling in Toronto</h3>
              <p className="res-guide__desc">
                The five-step journey, the marketing plan, and the seller enquiry form in one place.
              </p>
              <span className="res-guide__foot">
                <span className="res-guide__meta">5 steps · prep to closing</span>
                <span className="res-go">
                  Open the page <Arrow />
                </span>
              </span>
            </RevealLink>
            <RevealLink href="/resources" className="res-guide">
              <span className="res-guide__n" aria-hidden="true">
                02
              </span>
              <p className="eyebrow">Hub</p>
              <h3>All resources</h3>
              <p className="res-guide__desc">
                Both guides, the mortgage calculator, the land transfer tax calculator, and what happens next.
              </p>
              <span className="res-guide__foot">
                <span className="res-guide__meta">4 sections · guides, calculators, next steps</span>
                <span className="res-go">
                  Back to resources <Arrow />
                </span>
              </span>
            </RevealLink>
          </div>
        </div>
      </section>

      {/* 4 · CTA */}
      <section className="cta-band">
        <div className="container">
          <div className="row">
            <div>
              <p className="eyebrow eyebrow--white50">Next step</p>
              <SplitHeading as="h2" className="h2s">
                Find out what your home is <em>worth.</em>
              </SplitHeading>
              <p>
                A valuation request goes to a person who reviews local comparables: no instant algorithmic number.
              </p>
            </div>
            <div className="cta-band__actions">
              <RollButton href="/home-valuation" variant="white">
                Request a valuation
              </RollButton>
              <RollButton href="/contact" variant="ghost-light">
                Talk to SLIIQQUE
              </RollButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
