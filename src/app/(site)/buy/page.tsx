import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";
import ContactForm from "@/components/ContactForm";
import { IconLock } from "@/components/icons";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Buying a Home in Toronto";
const DESCRIPTION =
  "The Toronto buying process from pre-approval to closing: costs beyond the purchase price, offers, conditions, and what to budget.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/buy"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/buy" }),
};

const JOURNEY = [
  {
    title: "Get pre-approved",
    body: "A mortgage pre-approval sets a real budget and signals seriousness to sellers. It's worth doing before you start touring, not after you've found the one.",
  },
  {
    title: "Define the shortlist",
    body: "Clear must-haves and genuine deal-breakers beat an endless list of showings; a tight shortlist is the fastest path to an offer.",
  },
  {
    title: "Tour and compare",
    body: "See homes in person, compare notes, and revisit your shortlist as you learn what actually matters to you.",
  },
  {
    title: "Make a competitive offer",
    body: "Price, deposit, conditions, and closing date all factor into a winning offer in Toronto's market, not price alone.",
  },
  {
    title: "Inspect and finalize financing",
    body: "A home inspection and final mortgage approval typically happen during the conditional period after an accepted offer.",
  },
  {
    title: "Close",
    body: "Your real estate lawyer handles closing: land transfer tax, title search, and the final transfer of funds and keys.",
  },
];

const COSTS = [
  "Land transfer tax (Ontario, plus an additional municipal tax in Toronto)",
  "Legal fees and disbursements",
  "Home inspection",
  "Title insurance",
  "Moving costs",
  "Closing-day adjustments (prepaid property tax, utilities, etc.)",
];

export default function BuyPage() {
  return (
    <main>
      {/* 1 · HERO: copy + photo with an "on this page" index card */}
      <section className="page-hero">
        <div className="container">
          <div className="about-hero">
            <div>
              <Reveal as="p" className="eyebrow">
                For buyers
              </Reveal>
              <SplitHeading as="h1">
                Buying in <em>Toronto.</em>
              </SplitHeading>
              <Reveal as="p" className="lead" style={{ marginTop: 20, maxWidth: 470 }}>
                A clear path from first conversation to keys in hand, plus what to budget for beyond the purchase
                price.
              </Reveal>
              <Reveal as="div" className="hero__actions">
                <RollButton href="/contact" variant="forest">
                  Book a buyer consult
                </RollButton>
                <RollButton href="/resources/buyers-guide" variant="ghost">
                  Read the buyer&apos;s guide
                </RollButton>
              </Reveal>
            </div>
            <Reveal as="div" className="about-hero__photo">
              <Image
                src="/images/frHRZPT1GhZfKBvZhT6LcWHDcc.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 809px) 100vw, 520px"
              />
              <nav className="cred-card" aria-label="Sections on this page">
                <p className="eyebrow">On this page</p>
                <ul>
                  <li>
                    <a href="#journey">The six-step journey</a>
                  </li>
                  <li>
                    <a href="#financing">Financing and pre-approval</a>
                  </li>
                  <li>
                    <a href="#consult">Buyer consult form</a>
                  </li>
                </ul>
              </nav>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2 · THE JOURNEY: sticky heading + numbered steps */}
      <section className="section" id="journey">
        <div className="container">
          <div className="steps">
            <div className="steps__left">
              <Reveal as="p" className="eyebrow">
                The journey
              </Reveal>
              <SplitHeading as="h2">
                Six steps to <em>keys in hand.</em>
              </SplitHeading>
              <Reveal as="p">
                The sequence every purchase follows, from the first pre-approval conversation to the lawyer&apos;s
                closing table.
              </Reveal>
              <Reveal as="div" className="steps__note">
                <span className="chip">Free tool</span>
                <h3>Run the numbers first</h3>
                <p>
                  The mortgage calculator models Canadian rules: semi-annual compounding, bi-weekly options, and
                  CMHC insurance, so the budget range holds up before you start touring.
                </p>
                <div style={{ marginTop: 20 }}>
                  <RollButton href="/tools/mortgage-calculator" variant="ghost">
                    Open the calculator
                  </RollButton>
                </div>
              </Reveal>
            </div>
            <div className="steps__vr" />
            <Reveal as="ol" className="steps__right">
              {JOURNEY.map((s, i) => (
                <li className="step" key={s.title}>
                  <span className="step__n">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h4>{s.title}</h4>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 · FINANCING + COSTS, dark split: copy left, the cost list right */}
      <section className="section section--forest" id="financing">
        <div className="container">
          <div className="feature">
            <div className="feature__copy">
              <Reveal as="p" className="eyebrow eyebrow--white50">
                Before the search
              </Reveal>
              <SplitHeading as="h2">
                Financing and <em>pre-approval.</em>
              </SplitHeading>
              <Reveal as="p" className="lead">
                Getting pre-approved early tells you what you can realistically afford and strengthens any offer you
                make. Try the{" "}
                <Link href="/tools/mortgage-calculator">mortgage calculator</Link> to estimate monthly payments before
                you start touring. Buying from Nigeria? The{" "}
                <Link href="/nigerian-buyers">remote buying route</Link> covers video tours, non-resident financing and
                moving funds across currencies.
              </Reveal>
            </div>
            <div className="feature__vr" />
            <div>
              <Reveal as="p" className="eyebrow eyebrow--white50">
                Costs to budget for beyond the purchase price
              </Reveal>
              <Reveal as="ul" className="feature__list" style={{ marginTop: 24 }}>
                {COSTS.map((c) => (
                  <li key={c}>
                    <h4>{c}</h4>
                  </li>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · CONSULT FORM: form left, what-happens-next cards right */}
      <section className="section" id="consult">
        <div className="container">
          <div className="contact">
            <div>
              <div className="sec-head__title">
                <Reveal as="p" className="eyebrow">
                  Buyer consult form
                </Reveal>
                <SplitHeading as="h2">
                  Ready to start <em>looking?</em>
                </SplitHeading>
              </div>
              <Reveal as="p" className="lead" style={{ marginTop: 20 }}>
                Tell us the budget range and rough timeline: the reply comes back with a shortlist that fits, not
                everything on the market.
              </Reveal>
              <Reveal as="div" style={{ marginTop: 40 }}>
                <ContactForm defaultTopic="I want to buy" />
              </Reveal>
            </div>
            <Reveal as="div">
              <div className="side-card">
                <p className="eyebrow">What happens next</p>
                <p className="t-sm muted" style={{ marginTop: 16 }}>
                  Every enquiry is read by the team and answered by email within 24 hours, usually with two or three
                  questions about must-haves before any showings get booked.
                </p>
              </div>
              <div className="privacy-note" style={{ marginTop: 20 }}>
                <IconLock />
                <p>
                  <strong>No listing spam.</strong> Your details are used only to answer this enquiry; see the{" "}
                  <Link href="/privacy" style={{ textDecoration: "underline", textUnderlineOffset: 2 }}>
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
