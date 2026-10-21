import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";
import ContactForm from "@/components/ContactForm";
import { IconLock } from "@/components/icons";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Selling a Home in Toronto";
const DESCRIPTION =
  "What adds value before listing, how to price in the Toronto market, and how private and public sales differ.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/sell"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/sell", ogImage: "sell" }),
};

const JOURNEY = [
  {
    title: "Prepare the home",
    body: "Fix what an inspection would catch anyway, declutter, and handle deferred maintenance before the first showing, not after an offer falls through.",
  },
  {
    title: "Price it right",
    body: "Comparable sales (not wishful thinking) should set the asking price. Overpricing usually means more days on market, which itself becomes a negative signal.",
  },
  {
    title: "Market it well",
    body: "Professional photos, a short video, and a social push get a listing in front of the right buyers quickly.",
  },
  {
    title: "Show and negotiate",
    body: "Qualified showings protect your time, and a clean offer (not just the highest price) is often the strongest one to accept.",
  },
  {
    title: "Close",
    body: "Your lawyer handles the paperwork, land transfer, and the final transfer of funds and keys on closing day.",
  },
];

const MARKETING = [
  "Professional photography and a walkthrough video",
  "A dedicated listing page with full details and a floor plan",
  "Targeted social media promotion",
  "Open houses and private showings",
  "Syndication to major listing portals",
];

export default function SellPage() {
  return (
    <main>
      {/* 1 · HERO: copy + photo with an "on this page" index card */}
      <section className="page-hero">
        <div className="container">
          <div className="about-hero">
            <div>
              <Reveal as="p" className="eyebrow">
                For sellers
              </Reveal>
              <SplitHeading as="h1">
                Selling in <em>Toronto.</em>
              </SplitHeading>
              <Reveal as="p" className="lead" style={{ marginTop: 20, maxWidth: 470 }}>
                A straightforward path from prep to closing, with a marketing plan and pricing strategy built around
                your home.
              </Reveal>
              <Reveal as="div" className="hero__actions">
                <RollButton href="/home-valuation" variant="forest">
                  Request a free valuation
                </RollButton>
                <RollButton href="/sold" variant="ghost">
                  Browse past sales
                </RollButton>
              </Reveal>
            </div>
            <Reveal as="div" className="about-hero__photo">
              <Image
                src="/images/wUNokG3QHHu3pUkyBw1rFdGdfx4.jpg"
                alt=""
                fill
                priority
                sizes="(max-width: 809px) 100vw, 520px"
              />
              <nav className="cred-card" aria-label="Sections on this page">
                <p className="eyebrow">On this page</p>
                <ul>
                  <li>
                    <a href="#journey">The five-step journey</a>
                  </li>
                  <li>
                    <a href="#marketing">The marketing plan</a>
                  </li>
                  <li>
                    <a href="#pricing">Pricing strategy</a>
                  </li>
                  <li>
                    <a href="#enquiry">Seller enquiry</a>
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
                Five steps from prep to <em>closing day.</em>
              </SplitHeading>
              <Reveal as="p">
                What actually moves the needle, in order, from the first repair to the final transfer of keys.
              </Reveal>
              <Reveal as="div" className="steps__note">
                <span className="chip">Pre-market</span>
                <h3>Private before public</h3>
                <p>
                  A private launch lets you test pricing and control who sees the home; many sellers start quiet and
                  go public only if needed.
                </p>
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

      {/* 3 · THE MARKETING PLAN, dark split: copy left, the five deliverables right */}
      <section className="section section--forest" id="marketing">
        <div className="container">
          <div className="feature">
            <div className="feature__copy">
              <Reveal as="p" className="eyebrow eyebrow--white50">
                The marketing plan
              </Reveal>
              <SplitHeading as="h2">
                How your home gets <em>seen.</em>
              </SplitHeading>
              <Reveal as="p" className="lead">
                Five things every listing gets, in the order that works: repairs first, then the camera, then reach.
              </Reveal>
            </div>
            <div className="feature__vr" />
            <div>
              <Reveal as="p" className="eyebrow eyebrow--white50">
                Included with every listing
              </Reveal>
              <Reveal as="ul" className="feature__list" style={{ marginTop: 24 }}>
                {MARKETING.map((m) => (
                  <li key={m}>
                    <h4>{m}</h4>
                  </li>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · PRICING STRATEGY: forest CTA card with the valuation ask */}
      <section className="section" id="pricing">
        <div className="container">
          <Reveal as="div" className="cta-card">
            <div className="cta-card__copy">
              <p className="eyebrow eyebrow--white">Pricing strategy</p>
              <SplitHeading as="h2" className="h2s">
                Priced by the data, <em>not the hope.</em>
              </SplitHeading>
              <p>
                The right price comes from recent comparable sales in your neighbourhood, not a number picked to
                &quot;test the market.&quot; A home priced accurately from day one typically attracts stronger offers,
                faster, while sitting unsold tends to invite lower ones.
              </p>
            </div>
            <div className="cta-card__actions">
              <RollButton href="/home-valuation" variant="white">
                Request a free valuation
              </RollButton>
              <a className="btn btn--ghost-light" href="#enquiry">
                <span className="btn__roll">
                  <span>Send an enquiry</span>
                  <span>Send an enquiry</span>
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5 · SELLER ENQUIRY: form left, what-happens-next cards right */}
      <section className="section" id="enquiry">
        <div className="container">
          <div className="contact">
            <div>
              <div className="sec-head__title">
                <Reveal as="p" className="eyebrow">
                  Prefer to talk first?
                </Reveal>
                <SplitHeading as="h2">
                  Send a <em>seller enquiry.</em>
                </SplitHeading>
              </div>
              <Reveal as="p" className="lead" style={{ marginTop: 20 }}>
                Share a few details about the home and the timeline: the reply comes from a person, with next steps
                and honest expectations.
              </Reveal>
              <Reveal as="div" style={{ marginTop: 40 }}>
                <ContactForm defaultTopic="I want to sell" />
              </Reveal>
            </div>
            <Reveal as="div">
              <div className="side-card">
                <p className="eyebrow">What happens next</p>
                <p className="t-sm muted" style={{ marginTop: 16 }}>
                  Every seller enquiry is read by the team and answered by email within 24 hours, usually with a
                  couple of questions about the home before anything gets scheduled.
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
