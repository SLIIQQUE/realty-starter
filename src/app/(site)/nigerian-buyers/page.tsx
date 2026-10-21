import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealLink } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";
import Accordion from "@/components/Accordion";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { IconLock } from "@/components/icons";
import { getNeighbourhoods } from "@/lib/content/neighbourhoods";
import { resolveImageSrc } from "@/lib/content/image";
import { BRAND } from "@/data/brand";
import {
  breadcrumbSchema,
  faqSchema,
  nigeriaRemoteBuyingSchema,
  pageAlternates,
  pageGeo,
  pageSocial,
  SITE_URL,
} from "@/lib/seo";

const TITLE = "Buying Toronto Property from Nigeria";
const DESCRIPTION =
  "How Nigerian buyers purchase Toronto and GTA property remotely: video tours, non-resident financing, the foreign buyer rules and naira-to-dollar planning.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/nigerian-buyers"),
  other: pageGeo("nigeria"),
  ...pageSocial({
    title: TITLE,
    description: DESCRIPTION,
    path: "/nigerian-buyers",
    ogImage: "nigeria",
    imageAlt: "Toronto property, from Lagos: remote buying for Nigerian buyers",
  }),
};

const STEPS = [
  {
    title: "Discovery chat",
    body: "Thirty minutes on WhatsApp or Zoom, timed for Lagos and Abuja (WAT) as well as Toronto (ET). Budget, timeline, and whether this is a home to live in, a rental, or both.",
  },
  {
    title: "A shortlist, not a catalogue",
    body: "Two or three properties that actually fit, with floor plans, condo status certificates where relevant, and honest notes on what the photos leave out.",
  },
  {
    title: "Video walkthroughs",
    body: "A scheduled, room-by-room video tour, plus a second walkthrough at a different time of day so you see the light, the street and the noise for yourself.",
  },
  {
    title: "Verify and finance",
    body: "Survey or status-certificate review, a mortgage pre-approval with a lender that works with non-residents, and a written estimate of every closing cost before you commit.",
  },
  {
    title: "Offer and deposit",
    body: "The offer is prepared with you, conditions are explained in plain language, and the deposit transfer is scheduled around bank cut-off times in both countries.",
  },
  {
    title: "Close from abroad",
    body: "Inspection, final financing, title transfer and keys. Documents are couriered and sent digitally the same day; a lawyer can act under power of attorney if you prefer not to fly in.",
  },
];

const RULES = [
  {
    kicker: "Who can buy",
    title: "The federal rules come first",
    body: "Canada's prohibition on non-Canadians buying residential property applies in Toronto and is current to 1 January 2027, with limited exceptions for some work-permit holders, students who meet the conditions, and spouses of citizens. Ontario also applies a 25% Non-Resident Speculation Tax in the Greater Golden Horseshoe. Confirm the current rules on canada.ca and ontario.ca before you commit.",
    variant: "info-card--copper",
    light: true,
  },
  {
    kicker: "Financing",
    title: "Non-resident mortgages exist",
    body: "Several Canadian lenders lend to buyers who live abroad, typically asking for a 35% down payment plus proof of income, source of funds and a credit profile. A pre-approval before you make an offer is what keeps the financing condition short.",
    variant: "info-card--white",
    light: false,
  },
  {
    kicker: "Currency and timing",
    title: "Plan the naira-to-dollar move early",
    body: "Budget for the exchange spread, not just the headline rate, and allow five to ten business days for international wires to clear. A deposit that lands late can cost an offer, so the transfer is scheduled before the offer window closes.",
    variant: "info-card--sand",
    light: false,
  },
];

const FAQS = [
  {
    q: "Can a Nigerian citizen buy property in Toronto?",
    a: "Not freely while Canada's non-Canadian purchase prohibition applies, which currently runs to 1 January 2027. There are limited exceptions, and the rules differ for citizens, permanent residents, work-permit holders and students. This is general information, not legal advice: confirm your situation with a Canadian lawyer before making an offer.",
  },
  {
    q: "Can I get a Canadian mortgage while living in Nigeria?",
    a: "Yes, some Canadian lenders work with non-residents. They usually ask for a larger down payment, commonly 35%, plus proof of income, proof of funds and a credit profile, and they issue a pre-approval before you shop.",
  },
  {
    q: "Do I have to fly to Toronto to buy?",
    a: "No. Video walkthroughs, electronic signatures and a power of attorney for closing are all normal. Many buyers see the property in person only after completion, so the inspection and document review matter more, not less.",
  },
  {
    q: "What taxes and fees should I budget for?",
    a: "Ontario land transfer tax, an additional Toronto municipal land transfer tax, legal fees, title insurance, an inspection and closing adjustments. If the Non-Resident Speculation Tax applies to you, it is charged on top at 25% of the purchase price.",
  },
  {
    q: "How do I move the deposit from Nigeria to Canada?",
    a: "Through your bank, with the documentation your bank requires for an offshore property purchase. Start early, compare the spread rather than only the rate, and keep the transfer receipt: lenders and lawyers will ask for it.",
  },
  {
    q: "Is this a real brokerage?",
    a: `No. This is a concept site built by ${BRAND.studioName} Studio. The agent, brokerage and listings are sample content; the remote-buying process described here is the workflow a real deployment would use.`,
  },
];

/** The neighbourhood guides' own hero photos are generic stock shots elsewhere on the site;
 * on this page a representative sample home reads more honestly than a holiday-coast photo
 * under a Toronto neighbourhood name. Each image is that area's sample listing. */
const PICKS = [
  {
    slug: "liberty-village",
    img: "i46xXCsq4vRxnapEm4X5KD0x3PI.jpg",
    note: "Loft condominiums",
  },
  {
    slug: "leslieville",
    img: "PJdZd1adAgWdgdTeDru47g690E.jpg",
    note: "Renovated semis",
  },
  {
    slug: "forest-hill",
    img: "frHRZPT1GhZfKBvZhT6LcWHDcc.jpg",
    note: "Detached estates",
  },
];

export default async function NigerianBuyersPage() {
  const neighbourhoods = await getNeighbourhoods();
  const picks = PICKS.map((pick) => ({
    ...pick,
    neighbourhood: neighbourhoods.find((n) => n.slug === pick.slug),
  })).filter((pick): pick is typeof pick & { neighbourhood: NonNullable<typeof pick.neighbourhood> } =>
    Boolean(pick.neighbourhood)
  );

  return (
    <main>
      <JsonLd
        data={[
          nigeriaRemoteBuyingSchema(SITE_URL),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Buying from Nigeria", url: `${SITE_URL}/nigerian-buyers` },
          ]),
        ]}
      />

      <section className="page-hero">
        <div className="container">
          <div className="about-hero">
            <div>
              <Reveal as="p" className="eyebrow">
                Canada ↔ Nigeria
              </Reveal>
              <SplitHeading as="h1">
                Toronto property, <em>from Lagos.</em>
              </SplitHeading>
              <Reveal as="p" className="lead" style={{ marginTop: 20, maxWidth: 470 }}>
                A remote-first route for Nigerian buyers and investors: video tours, non-resident financing, and a
                closing that does not require a flight.
              </Reveal>
              <Reveal as="div" className="hero__actions">
                <RollButton href="#consult" variant="forest">
                  Book a remote consult
                </RollButton>
                <RollButton href="/listings" variant="ghost">
                  Browse the portfolio
                </RollButton>
              </Reveal>
            </div>
            <Reveal as="div" className="about-hero__photo">
              <Image
                src="/images/frHRZPT1GhZfKBvZhT6LcWHDcc.jpg"
                alt="A Toronto home from the sample portfolio"
                fill
                priority
                sizes="(max-width: 809px) 100vw, 520px"
              />
              <nav className="cred-card" aria-label="Sections on this page">
                <p className="eyebrow">On this page</p>
                <ul>
                  <li>
                    <a href="#route">The remote route</a>
                  </li>
                  <li>
                    <a href="#rules">Rules, financing and currency</a>
                  </li>
                  <li>
                    <a href="#areas">Where Nigerians buy</a>
                  </li>
                  <li>
                    <a href="#answers">Straight answers</a>
                  </li>
                </ul>
              </nav>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" id="route">
        <div className="container">
          <div className="steps">
            <div className="steps__left">
              <Reveal as="p" className="eyebrow">
                The remote route
              </Reveal>
              <SplitHeading as="h2">
                Six steps, <em>no flight required.</em>
              </SplitHeading>
              <Reveal as="p">
                The same sequence as an in-person purchase, with the verification steps made heavier because you are
                not in the room.
              </Reveal>
              <Reveal as="div" className="steps__note">
                <span className="chip">Time zones</span>
                <h3>Lagos and Toronto, same conversation</h3>
                <p>
                  Toronto is five or six hours behind Lagos depending on daylight saving. Sessions are scheduled in
                  both calendars so nothing lands at an unreasonable hour.
                </p>
              </Reveal>
            </div>
            <div className="steps__vr" />
            <Reveal as="ol" className="steps__right">
              {STEPS.map((s, i) => (
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

      <section className="section section--forest" id="rules">
        <div className="container">
          <div className="sec-head">
            <div className="sec-head__title">
              <Reveal as="p" className="eyebrow eyebrow--white50">
                Before the search
              </Reveal>
              <SplitHeading as="h2">
                Rules, financing <em>and currency.</em>
              </SplitHeading>
            </div>
            <Reveal as="p" className="lead">
              Three things decide whether a Toronto purchase works from Nigeria: eligibility, lending, and how the
              money moves. Get them in order before you fall for a property.
            </Reveal>
          </div>

          <div className="trio sec-body">
            {RULES.map((rule) => (
              <div
                className={`info-card ${rule.variant}`}
                key={rule.title}
                style={{ height: "auto", minHeight: 355, justifyContent: "flex-start", gap: 18 }}
              >
                <p className={rule.light ? "eyebrow eyebrow--white" : "eyebrow"}>{rule.kicker}</p>
                <div>
                  <h4>{rule.title}</h4>
                  <p>{rule.body}</p>
                </div>
              </div>
            ))}
          </div>

          <Reveal as="p" className="t-sm" style={{ marginTop: 28 }}>
            <Link
              href="/tools/land-transfer-tax"
              style={{ color: "var(--c-white)", textDecoration: "underline", textUnderlineOffset: 4 }}
            >
              Estimate Ontario and Toronto land transfer tax →
            </Link>
          </Reveal>

          <Reveal as="p" className="t-xs" style={{ marginTop: 18, color: "var(--c-white-50)", maxWidth: 720 }}>
            General information for this concept site, not legal, tax or financial advice. Canadian and Ontario rules
            change; verify the current position with a licensed Canadian lawyer or accountant before committing funds.
          </Reveal>

          <Reveal as="p" className="t-xs" style={{ marginTop: 12, color: "var(--c-white-50)" }}>
            Official sources:{" "}
            <a
              href="https://www.canada.ca/en/services/housing/programs-and-services/foreign-buyers-ban.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--c-white)", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              Canada&apos;s foreign buyer ban
            </a>{" "}
            and{" "}
            <a
              href="https://www.ontario.ca/page/non-resident-speculation-tax"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--c-white)", textDecoration: "underline", textUnderlineOffset: 3 }}
            >
              Ontario&apos;s Non-Resident Speculation Tax
            </a>
            .
          </Reveal>
        </div>
      </section>

      <section className="section" id="areas">
        <div className="container">
          <div className="sec-head">
            <div className="sec-head__title">
              <Reveal as="p" className="eyebrow">
                Where Nigerians buy
              </Reveal>
              <SplitHeading as="h2">
                Three places to <em>start looking.</em>
              </SplitHeading>
            </div>
            <Reveal as="p" className="lead">
              Most remote buyers begin with a condo for low maintenance or a family home near good schools. These three
              sample areas cover both, plus the top of the market.
            </Reveal>
          </div>

          <div className="trio sec-body">
            {picks.map((pick) => (
              <RevealLink
                key={pick.slug}
                href={`/neighbourhoods/${pick.slug}`}
                className="card-img"
                style={{ minHeight: 380 }}
              >
                <Image
                  className="bg"
                  src={resolveImageSrc(pick.img)}
                  alt={`${pick.neighbourhood.name}, Toronto`}
                  fill
                  sizes="(max-width: 809px) 100vw, 400px"
                />
                <div className="card-img__inner" style={{ justifyContent: "flex-end" }}>
                  <p className="card-img__loc">{pick.neighbourhood.region}</p>
                  <h4 className="card-img__title">{pick.neighbourhood.name}</h4>
                  <p className="card-img__price">{pick.note}</p>
                </div>
              </RevealLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="answers">
        <div className="container">
          <div className="sec-head">
            <div className="sec-head__title">
              <Reveal as="p" className="eyebrow">
                Straight answers
              </Reveal>
              <SplitHeading as="h2">
                The questions <em>that come first.</em>
              </SplitHeading>
            </div>
            <Reveal as="p" className="lead">
              Short answers to what Nigerian buyers ask before anything else. Nothing here replaces advice from a
              Canadian lawyer, lender or accountant.
            </Reveal>
          </div>
          <Reveal as="div" className="faq-page acc">
            <Accordion items={FAQS} />
          </Reveal>
        </div>
      </section>

      <section className="section" id="consult">
        <div className="container">
          <div className="contact">
            <div>
              <div className="sec-head__title">
                <Reveal as="p" className="eyebrow">
                  Remote consult
                </Reveal>
                <SplitHeading as="h2">
                  Start with a <em>conversation.</em>
                </SplitHeading>
              </div>
              <Reveal as="p" className="lead" style={{ marginTop: 20 }}>
                Tell us where you are, what the budget is in Canadian dollars, and when you want to own. The reply
                comes back with a shortlist and the questions a lender will ask.
              </Reveal>
              <Reveal as="div" style={{ marginTop: 40 }}>
                <ContactForm defaultTopic="I want to buy" />
              </Reveal>
            </div>
            <Reveal as="div">
              <div className="side-card">
                <p className="eyebrow">What happens next</p>
                <p className="t-sm muted" style={{ marginTop: 16 }}>
                  Every enquiry is read and answered by email within 24 hours. If a conversation is easier, message
                  us on{" "}
                  <a
                    href={BRAND.whatsappHref}
                    style={{ textDecoration: "underline", textUnderlineOffset: 3 }}
                  >
                    WhatsApp at {BRAND.whatsappNumber}
                  </a>{" "}
                  and we&apos;ll agree a time that works in West Africa Time.
                </p>
                <p className="t-sm muted" style={{ marginTop: 12 }}>
                  Prefer email first? Write to{" "}
                  <a href={`mailto:${BRAND.email}`} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                    {BRAND.email}
                  </a>
                  .
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
