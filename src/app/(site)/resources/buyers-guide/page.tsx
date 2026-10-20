import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, RevealLink } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";
import ArticleToc, { type TocItem } from "@/components/ArticleToc";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "The Buyer's Guide";
const DESCRIPTION = "A straightforward walkthrough of the buying process, from first conversation to closing.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/resources/buyers-guide"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/resources/buyers-guide" }),
};

const STEPS = [
  {
    title: "Get clear on budget before homes",
    body: "A mortgage pre-approval (not just pre-qualification) sets a real ceiling and signals seriousness to sellers in a competitive segment. Factor in Toronto's municipal and Ontario land transfer taxes early; they add up fast above $2M and change the real number you can spend.",
  },
  {
    title: "Build the shortlist, not the long list",
    body: "Touring twenty homes rarely beats touring five well-chosen ones. A tight shortlist built from clear must-haves and genuine deal-breakers saves the most time of any step in the process.",
  },
  {
    title: "Understand public vs. private inventory",
    body: "Some of the best-fit homes for a given budget never reach public search. Off-market and private listings move on relationships and timing, worth asking about explicitly, not assuming you've seen everything available.",
  },
  {
    title: "Write an offer that can actually win",
    body: "Price is one lever among several: close timeline, contingency structure, and deposit size all matter to a seller. A clean, well-structured offer frequently beats a higher but messier one.",
  },
  {
    title: "Inspect for what matters at this price point",
    body: "Beyond the standard inspection, century homes and ravine-lot properties often warrant knob-and-tube wiring, foundation/drainage, and structural specialists. The cost is small relative to the surprises it can catch.",
  },
  {
    title: "Close with a clear final walkthrough",
    body: "The final walkthrough exists to confirm agreed repairs were made and nothing changed since the offer, not to renegotiate. Going in with that clarity keeps closing day calm.",
  },
];

const TOC: TocItem[] = [
  { id: "budget", label: "Budget first" },
  { id: "shortlist", label: "The shortlist" },
  { id: "inventory", label: "Public vs. private" },
  { id: "offer", label: "The offer" },
  { id: "inspect", label: "Inspections" },
  { id: "walkthrough", label: "Final walkthrough" },
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

export default function BuyersGuidePage() {
  return (
    <main>
      {/* 1 · HERO: centred intro with meta tags and a wide image band */}
      <section className="page-hero page-hero--center">
        <div className="container">
          <div className="stack">
            <Reveal as="p" className="eyebrow">
              For buyers
            </Reveal>
            <SplitHeading as="h1">
              The Buyer&apos;s <em>Guide</em>
            </SplitHeading>
            <Reveal as="p" className="lead">
              A straightforward walkthrough of buying in the $1.8M–$6.5M CAD Toronto and GTA segment this concept
              represents.
            </Reveal>
            <Reveal as="div" className="guide-tags">
              <span className="tag">6 steps</span>
              <span className="tag">First conversation to closing</span>
              <span className="tag">Buyers</span>
            </Reveal>
            <Reveal as="div" className="img guide-hero-img">
              <Image
                src="/images/i46xXCsq4vRxnapEm4X5KD0x3PI.jpg"
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
                  {i === 0 && (
                    <div className="quote-box">
                      <Image
                        className="quote-box__mark"
                        width={50}
                        height={50}
                        src="/images/WKagG04AvCVspRdazfPUvdxrnY.svg"
                        alt=""
                      />
                      <p>
                        Budget first, homes second: every step in this guide gets easier once the pre-approval number
                        is real.
                      </p>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 · KEEP READING: cross-links back to the buying page and the hub */}
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
              The full buying page for the journey, costs, and consult form, or back to every resource in one place.
            </Reveal>
          </div>

          <div className="res-guides sec-body">
            <RevealLink href="/buy" className="res-guide">
              <span className="res-guide__n" aria-hidden="true">
                01
              </span>
              <p className="eyebrow">Main page</p>
              <h3>Buying in Toronto</h3>
              <p className="res-guide__desc">
                The six-step journey, the costs beyond the purchase price, and the buyer consult form in one place.
              </p>
              <span className="res-guide__foot">
                <span className="res-guide__meta">6 steps · pre-approval to closing</span>
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
                Put the guide to <em>work</em> on real listings.
              </SplitHeading>
              <p>
                Six sample properties across Toronto: filter by neighbourhood, price, and status, then book a
                viewing.
              </p>
            </div>
            <div className="cta-band__actions">
              <RollButton href="/listings" variant="white">
                Browse the portfolio
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
