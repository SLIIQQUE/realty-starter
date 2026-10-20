import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, RevealLink } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Resources";
const DESCRIPTION = "Guides, a mortgage calculator, a valuation request flow, and open houses.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/resources"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/resources" }),
};

/** Arrow used across the page's card affordances. */
function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Section index shown beside the hero, a compact table of contents for the page. */
const SECTIONS = [
  { id: "paths", n: "01", label: "Choose a path", count: "2 paths" },
  { id: "guides", n: "02", label: "Guides", count: "2 guides" },
  { id: "tools", n: "03", label: "Calculators", count: "2 tools" },
  { id: "next-steps", n: "04", label: "Next steps", count: "3 actions" },
];

const PATHS = [
  {
    href: "/buy",
    kicker: "For buyers",
    short: "buying",
    title: "Buying in Toronto",
    desc: "A step-by-step buyer's journey, financing basics, and the costs to budget for beyond the purchase price.",
    inside: ["The buyer's guide", "Mortgage calculator", "Book a viewing"],
    img: "frHRZPT1GhZfKBvZhT6LcWHDcc.jpg",
  },
  {
    href: "/sell",
    kicker: "For sellers",
    short: "selling",
    title: "Selling in Toronto",
    desc: "From prep to closing: the marketing plan, pricing strategy, and how to request a free valuation.",
    inside: ["The seller's guide", "Land transfer tax calculator", "Request a valuation"],
    img: "wUNokG3QHHu3pUkyBw1rFdGdfx4.jpg",
  },
];

const GUIDES = [
  {
    href: "/resources/buyers-guide",
    n: "01",
    kicker: "Buyers",
    title: "The buyer's guide",
    desc: "A straightforward walkthrough of the buying process, from first conversation to closing, including public vs. private inventory and what an offer needs to actually win.",
    meta: "6 steps · first conversation to closing",
  },
  {
    href: "/resources/sellers-guide",
    n: "02",
    kicker: "Sellers",
    title: "The seller's guide",
    desc: "What genuinely adds value before listing, how to price against the data rather than the hope, and where private sales differ from a public campaign.",
    meta: "6 steps · prep to negotiation",
  },
];

const TOOLS = [
  {
    href: "/tools/mortgage-calculator",
    n: "01",
    kicker: "Canadian rules",
    title: "Mortgage calculator",
    desc: "Estimate monthly, bi-weekly, or accelerated bi-weekly payments under Canadian mortgage rules.",
    chips: ["Semi-annual compounding", "Bi-weekly options", "CMHC insurance"],
    value: "$3,490",
    unit: "CAD / month",
    note: "Illustrative: $750,000 purchase, 20% down, 5.00% five-year fixed.",
  },
  {
    href: "/tools/land-transfer-tax",
    n: "02",
    kicker: "Provincial + municipal",
    title: "Land transfer tax calculator",
    desc: "Estimate Ontario, Toronto, and BC land transfer tax, including first-time buyer rebates.",
    chips: ["Ontario & Toronto", "British Columbia", "First-time rebates"],
    value: "$26,950",
    unit: "CAD total tax",
    note: "Illustrative: Ontario + Toronto on an $850,000 purchase, before rebates.",
  },
];

const ACTIONS = [
  {
    href: "/home-valuation",
    kicker: "Valuation",
    title: "Request a valuation",
    desc: "A concept lead flow, reviewed by a person, not an automated pricing model.",
    variant: "info-card--copper",
    light: true,
  },
  {
    href: "/book-a-viewing",
    kicker: "Showings",
    title: "Book a viewing",
    desc: "Request a private showing for any listing, or a general consultation about a move.",
    variant: "info-card--white",
    light: false,
  },
  {
    href: "/open-houses",
    kicker: "This week",
    title: "Upcoming open houses",
    desc: "See which sample properties have a scheduled open house, no RSVP needed.",
    variant: "info-card--sand",
    light: false,
  },
];

export default function ResourcesPage() {
  return (
    <main>
      {/* 1 · HERO WITH PAGE INDEX + THE TWO PATHS */}
      <section className="page-hero res-hero">
        <div className="container">
          <div className="res-hero__grid">
            <div className="res-hero__copy">
              <Reveal as="p" className="eyebrow">
                For buyers and sellers
              </Reveal>
              <SplitHeading as="h1">
                Resources for the <em>whole move</em>.
              </SplitHeading>
              <Reveal as="p" className="lead">
                Guides, calculators, and next steps, whichever side of the move you&apos;re on.
              </Reveal>
            </div>

            <Reveal as="nav" className="res-index" aria-label="Sections on this page">
              <div className="res-index__head">
                <p className="eyebrow">On this page</p>
                <span>4 sections</span>
              </div>
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`}>
                  <span className="res-index__num">{s.n}</span>
                  <span className="res-index__label">{s.label}</span>
                  <span className="res-index__count">{s.count}</span>
                  <Arrow className="res-index__arrow" />
                </a>
              ))}
            </Reveal>
          </div>

          <div className="res-paths" id="paths">
            {PATHS.map((p) => (
              <RevealLink key={p.href} href={p.href} className="res-path">
                <Image src={`/images/${p.img}`} alt="" fill sizes="(max-width: 809px) 100vw, 50vw" />
                <span className="pill">{p.kicker}</span>
                <div className="res-path__body">
                  <h3>{p.title}</h3>
                  <p className="res-path__desc">{p.desc}</p>
                  <p className="res-path__inside">
                    <span>Inside</span> {p.inside.join(" · ")}
                  </p>
                  <span className="res-path__go">
                    Explore {p.short} <Arrow />
                  </span>
                </div>
              </RevealLink>
            ))}
          </div>
        </div>
      </section>

      {/* 2 · GUIDES */}
      <section className="section section--sand" id="guides">
        <div className="container">
          <div className="sec-head sec-head--split">
            <div className="sec-head__title">
              <Reveal as="p" className="eyebrow">
                Read first
              </Reveal>
              <SplitHeading as="h2">Two guides, written to be <em>used</em>.</SplitHeading>
            </div>
            <Reveal as="p" className="lead">
              No filler. Each one is the sequence we&apos;d actually walk a client through, in order, with the trade-offs
              named out loud.
            </Reveal>
          </div>

          <div className="res-guides sec-body">
            {GUIDES.map((g) => (
              <RevealLink key={g.href} href={g.href} className="res-guide">
                <span className="res-guide__n" aria-hidden="true">
                  {g.n}
                </span>
                <p className="eyebrow">{g.kicker}</p>
                <h3>{g.title}</h3>
                <p className="res-guide__desc">{g.desc}</p>
                <span className="res-guide__foot">
                  <span className="res-guide__meta">{g.meta}</span>
                  <span className="res-go">
                    Read the guide <Arrow />
                  </span>
                </span>
              </RevealLink>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · CALCULATORS */}
      <section className="section section--forest" id="tools">
        <div className="container">
          <div className="sec-head sec-head--split">
            <div className="sec-head__title">
              <Reveal as="p" className="eyebrow eyebrow--white50">
                Calculators
              </Reveal>
              <SplitHeading as="h2">Run the numbers <em>before</em> the viewing.</SplitHeading>
            </div>
            <Reveal as="p" className="lead">
              Both calculators use the real bracket and compounding rules rather than a rounded estimate, so the figure
              you see is the one a lender would start from.
            </Reveal>
          </div>

          <div className="res-tools sec-body">
            {TOOLS.map((tool) => (
              <RevealLink key={tool.href} href={tool.href} className="res-tool">
                <div className="res-tool__head">
                  <p className="eyebrow eyebrow--white50">{tool.kicker}</p>
                  <span className="res-tool__n">{tool.n}</span>
                </div>
                <h3>{tool.title}</h3>
                <p className="res-tool__desc">{tool.desc}</p>
                <div className="chips">
                  {tool.chips.map((c) => (
                    <span className="chip" key={c}>
                      {c}
                    </span>
                  ))}
                </div>
                <div className="res-tool__readout">
                  <p className="res-tool__label">Sample output</p>
                  <p className="res-tool__value">
                    {tool.value}
                    <span>{tool.unit}</span>
                  </p>
                  <p className="res-tool__note">{tool.note}</p>
                </div>
                <span className="res-go res-go--light">
                  Open calculator <Arrow />
                </span>
              </RevealLink>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · NEXT STEPS */}
      <section className="section" id="next-steps">
        <div className="container">
          <div className="sec-head sec-head--split">
            <div className="sec-head__title">
              <Reveal as="p" className="eyebrow">
                Next steps
              </Reveal>
              <SplitHeading as="h2">When reading turns into <em>moving</em>.</SplitHeading>
            </div>
            <Reveal as="p" className="lead">
              Three short flows, each answered by a person. Demonstration only: no lead is routed to a real brokerage.
            </Reveal>
          </div>

          <div className="trio sec-body">
            {ACTIONS.map((a) => (
              <RevealLink key={a.href} href={a.href} className={`info-card ${a.variant}`}>
                <p className={a.light ? "eyebrow eyebrow--white" : "eyebrow"}>{a.kicker}</p>
                <div>
                  <h4>{a.title}</h4>
                  <p>{a.desc}</p>
                </div>
                <span className="res-go">
                  Get started <Arrow />
                </span>
              </RevealLink>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · CTA */}
      <section className="cta-band">
        <div className="container">
          <div className="row">
            <div>
              <p className="eyebrow eyebrow--white50">Not sure where to start</p>
              <SplitHeading as="h2" className="h2s">
                Tell us where you are in the move; we&apos;ll point you to the <em>right resource.</em>
              </SplitHeading>
              <p>No pitch, no drip campaign. Just the page, tool, or conversation that fits your situation.</p>
            </div>
            <RollButton href="/contact" variant="ghost-light">
              Talk to SLIIQQUE
            </RollButton>
          </div>
        </div>
      </section>
    </main>
  );
}
