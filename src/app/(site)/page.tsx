import type { Metadata } from "next";
import Image from "next/image";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import { Reveal, RevealLink } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";
import Accordion, { type AccordionItem } from "@/components/Accordion";
import { IconArea, IconBed, IconPin } from "@/components/icons";
import { getListings } from "@/lib/content/listings";
import { getAgentBySlug } from "@/lib/content/agents";
import { getPosts } from "@/lib/content/posts";
import { getTestimonials } from "@/lib/content/testimonials";
import { getNeighbourhoods } from "@/lib/content/neighbourhoods";
import { resolveImageSrc } from "@/lib/content/image";
import { BRAND } from "@/data/brand";
import { getLocale } from "@/lib/i18n/getLocale";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import { pageAlternates, pageSocial, faqSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Toronto Real Estate & GTA Homes for Sale | SLIIQQUE" },
  description:
    "Curated Toronto and GTA listings, six neighbourhood guides, and Canadian mortgage and land transfer tax calculators, plus a remote buying route for Nigerian buyers.",
  alternates: pageAlternates("/"),
  ...pageSocial({
    title: "Toronto Real Estate & GTA Homes for Sale",
    description:
      "Curated Toronto and GTA listings, neighbourhood guides, and Canadian property calculators, plus remote buying support for Nigerian buyers.",
    path: "/",
    ogImage: "home",
  }),
};

const POST_IMAGES = [
  "YakBQUTrOeOG0sP4BryPbWMzhUg.jpg",
  "bszTW1u4QW54iYFG2R7pIPzqon4.jpg",
  "Pj9uv5laqDRjON76kpHxGvMJ5ko.jpg",
];

const HOME_FAQS: AccordionItem[] = [
  {
    q: "Is this a real brokerage?",
    a: `No. This is a concept marketing site built by ${BRAND.siteName} Studio to demonstrate real-estate web design and engineering for the Canadian realtor vertical. "Priya Mehta" and "${BRAND.agent.brokerage.replace(" (demo)", "")}" are fictional, and the properties shown are sample listings, not real inventory.`,
  },
  {
    q: "What areas does Priya cover?",
    a: "The sample portfolio spans six Toronto neighbourhoods (Yorkville, Rosedale, Forest Hill, Leslieville, Liberty Village, and The Beaches), each with its own neighbourhood page covering transit, schools, and market context.",
  },
  {
    q: "How does the home valuation request work?",
    a: "It's a short multi-step form, not an instant automated number. On a real deployment, a human reviews local comparables before replying, the same promise this concept demonstrates.",
  },
  {
    q: "Do I need an account to save or compare properties?",
    a: "No. Favourites and comparisons are stored in your browser's local storage only, no sign-up required.",
  },
  {
    q: "Can I buy a Toronto home from Nigeria?",
    a: "Yes. The site includes a remote buying route: video walkthroughs, document review, non-resident financing introductions and closing by power of attorney. Canada restricts some non-resident purchases until 1 January 2027, so eligibility comes before the search.",
  },
  {
    q: "Can SLIIQQUE build something like this for a real brokerage or agent?",
    a: "Yes, this site demonstrates the full Canadian realtor template: listings, neighbourhood pages, calculators, lead funnels, and compliance scaffolding, ready to be configured around a real licence, brokerage, and listing feed.",
  },
];

export default async function HomePage() {
  const locale = await getLocale();
  const t = locale === "fr" ? fr : en;
  const fullName = BRAND.agent.name;
  const firstName = fullName.split(" ")[0];

  const [properties, priyaAgent, posts, testimonials, neighbourhoods] = await Promise.all([
    getListings(),
    getAgentBySlug("priya-mehta"),
    getPosts(),
    getTestimonials(),
    getNeighbourhoods(),
  ]);
  const priya = priyaAgent!;

  const newListing = properties.find((p) => p.status === "New Listing")!;
  const available = properties.find((p) => p.status === "Available")!;
  const pending = properties.find((p) => p.status === "Pending")!;
  const soldSample = properties.filter((p) => p.sold).slice(0, 3);
  const latestPosts = posts.slice(0, 3);
  const featuredTestimonials = testimonials.slice(0, 3);
  const homeHoodBySlug = new Map(neighbourhoods.map((n) => [n.slug, n]));

  return (
    <main>
      <JsonLd data={[faqSchema(HOME_FAQS.map((f) => ({ q: f.q, a: String(f.a) })))]} />
      {/* 1 · HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero__grid">
            <div className="hero__copy">
              <Reveal as="p" className="eyebrow">
                {t.home.hero.eyebrow}
              </Reveal>
              <SplitHeading as="h1">
                {t.home.hero.headlineMain} <em>{t.home.hero.headlineEm}</em>
              </SplitHeading>
              <Reveal as="p" className="lead">
                {fullName} {t.home.hero.lead.replace("{name} ", "")}
              </Reveal>
              <Reveal as="div" className="hero__actions">
                <RollButton href="/listings" variant="forest">
                  {t.home.hero.ctaBrowse}
                </RollButton>
                <RollButton href="/contact" variant="ghost">
                  {t.home.hero.ctaConsult}
                </RollButton>
              </Reveal>
              <div className="hero__rule" />
              <Reveal as="div" className="proof">
                <div className="avatars">
                  <span className="av">
                    <Image src="/images/uX33rMp5DudW3tvoDWzVLtdDRHw.jpg" alt="" width={46} height={46} />
                  </span>
                  <span className="av">
                    <Image src="/images/GrJHN2ujfzkKJw8Hyzx84PCWV8Q.jpg" alt="" width={46} height={46} />
                  </span>
                  <span className="av">
                    <Image src="/images/hGqoFHSEI5Ulkqk6Ju2c7nTQ24A.jpg" alt="" width={46} height={46} />
                  </span>
                </div>
                <div>
                  <strong>{t.home.hero.proofStrong}</strong>
                  <span>{t.home.hero.proofSpan}</span>
                </div>
              </Reveal>
            </div>
            <Reveal as="div" className="hero__visual">
              <Link className="card-img hero-card" href={`/listings/${available.slug}`}>
                <ImageWithSkeleton className="bg" src={available.img} alt={available.name} fill priority sizes="(max-width: 809px) 100vw, 50vw" />
                <div className="card-img__inner">
                  <span className="pill pill--solid-white" style={{ alignSelf: "flex-start" }}>
                    {t.home.hero.featuredBadge}
                  </span>
                  <div className="card-img__foot">
                    <div>
                      <p className="card-img__loc">{available.loc}</p>
                      <h4 className="card-img__title">{available.name}</h4>
                    </div>
                    <span className="price-pill">{available.price}</span>
                  </div>
                </div>
              </Link>
              <div className="stats-duo">
                <div className="stat-card stat-card--forest">
                  <p className="stat-card__label">{t.home.hero.statIncludesLabel}</p>
                  <div>
                    <p className="stat-card__value">
                      12<em>{t.home.hero.statIncludesSuffix}</em>
                    </p>
                    <p className="stat-card__note">{t.home.hero.statIncludesNote}</p>
                  </div>
                </div>
                <div className="stat-card stat-card--white">
                  <p className="stat-card__label">{t.home.hero.statBuiltLabel}</p>
                  <div>
                    <p className="stat-card__value">
                      Next.js <em>15</em>
                    </p>
                    <p className="stat-card__note">{t.home.hero.statBuiltNote}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2 · TRUST BAR */}
      <section className="stats-band">
        <div className="container">
          <Reveal as="div" className="row">
            <div>
              <strong>{BRAND.agent.brokerage.replace(" (demo)", "")}</strong>
              <span>{t.home.trust.brokerage}</span>
            </div>
            <div>
              <strong>12+</strong>
              <span>{t.home.trust.years}</span>
            </div>
            <div>
              <strong>{soldSample.length * 2}+</strong>
              <span>{t.home.trust.homesSold}</span>
            </div>
            <div>
              <strong>RECO</strong>
              <span>{t.home.trust.licensed}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 · HOME VALUATION: editorial split with portrait */}
      <section className="section">
        <div className="container">
          <div className="valuation-split">
            <Reveal as="div" className="valuation-split__media">
              <div className="valuation-split__photo">
                <ImageWithSkeleton
                  src={priya.photo}
                  alt={`${priya.name}, ${priya.title}`}
                  fill
                  sizes="(max-width: 809px) 100vw, 480px"
                />
              </div>
              <div className="valuation-split__stamp">
                <p className="eyebrow">{t.home.valuation.reviewedBy}</p>
                <strong>{priya.name}</strong>
                <span>{priya.title}</span>
              </div>
            </Reveal>
            <Reveal as="div" className="valuation-split__body">
              <p className="eyebrow">{t.home.valuation.eyebrow}</p>
              <SplitHeading as="h2" className="h2s">
                {t.home.valuation.headingMain} <em>{t.home.valuation.headingEm}</em>
              </SplitHeading>
              <p className="lead">{t.home.valuation.supporting}</p>
              <form className="valuation-quick" action="/home-valuation" method="get">
                <span className="valuation-quick__icon" aria-hidden="true">
                  <IconPin />
                </span>
                <input
                  className="input"
                  type="text"
                  name="address"
                  placeholder={t.home.valuation.placeholder}
                  aria-label={t.home.valuation.aria}
                  required
                />
                <button className="btn btn--copper" type="submit">
                  {t.home.valuation.submit}
                </button>
              </form>
              <ul className="valuation-split__points">
                <li>{t.home.valuation.badge1}</li>
                <li>{t.home.valuation.badge2}</li>
                <li>{t.home.valuation.badge3}</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4 · FEATURED LISTINGS */}
      <section className="section section--no-bottom">
        <div className="container">
          <div className="sec-head">
            <div className="sec-head__title">
              <Reveal as="p" className="eyebrow">
                {t.home.featured.eyebrow}
              </Reveal>
              <SplitHeading as="h2">
                {t.home.featured.headingMain} <em>{t.home.featured.headingEm}</em>
              </SplitHeading>
            </div>
            <RollButton href="/listings" variant="forest">
              {t.home.featured.viewAll}
            </RollButton>
          </div>
          <RevealLink className="card-img prop-big" href={`/listings/${newListing.slug}`}>
            <ImageWithSkeleton className="bg" src={newListing.img} alt={newListing.name} fill sizes="100vw" />
            <span className="pill badge-tl">{newListing.status}</span>
            <div className="card-img__inner" style={{ justifyContent: "flex-end" }}>
              <div className="card-img__foot">
                <div>
                  <p className="card-img__loc">{newListing.loc}</p>
                  <h2>{newListing.name}</h2>
                  <div className="card-img__meta">
                    <span>{newListing.price}</span>
                    <span>{newListing.bed} Bed</span>
                    <span>{newListing.bath} Bath</span>
                    <span>{newListing.sqft} Sq Ft</span>
                  </div>
                </div>
                <span className="price-pill">{t.home.featured.scheduleViewing}</span>
              </div>
            </div>
          </RevealLink>
          <Reveal as="div" className="prop-pair">
            {[available, pending].map((p) => (
              <Link key={p.slug} className="card-img prop-sm" href={`/listings/${p.slug}`}>
                <ImageWithSkeleton className="bg" src={p.img} alt={p.name} fill sizes="(max-width: 809px) 100vw, 50vw" />
                <span className="pill badge-tl">{p.status}</span>
                <div className="card-img__inner" style={{ justifyContent: "flex-end" }}>
                  <p className="card-img__loc">{p.loc}</p>
                  <h4 className="card-img__title">{p.name}</h4>
                  <p className="card-img__price">{p.price}</p>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 5 · HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <div className="steps">
            <div className="steps__left">
              <Reveal as="p" className="eyebrow">
                {t.home.how.eyebrow}
              </Reveal>
              <SplitHeading as="h2">{t.home.how.heading}</SplitHeading>
              <Reveal as="p">{t.home.how.lead}</Reveal>
              <Reveal as="div" className="steps__note">
                <span className="chip">{t.home.how.noteChip}</span>
                <h3>{t.home.how.noteHeading}</h3>
                <p>{t.home.how.noteBody}</p>
              </Reveal>
            </div>
            <div className="steps__vr" />
            <Reveal as="ol" className="steps__right">
              {t.home.how.steps.map((step, i) => (
                <li className="step" key={step.title}>
                  <span className="step__n">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6 · BUYER / SELLER SPLIT */}
      <section className="section section--no-bottom">
        <div className="container">
          <div className="sec-head sec-head--center">
            <SplitHeading as="h2" style={{ maxWidth: 520 }}>
              {t.home.split.heading}
            </SplitHeading>
          </div>
          <Reveal as="div" className="moves">
            <article className="move-card move-card--buy">
              <div className="move-card__head">
                <span className="move-card__n" aria-hidden="true">01</span>
                <span className="move-card__icon" aria-hidden="true">
                  <IconBed />
                </span>
              </div>
              <div className="move-card__body">
                <p className="eyebrow">{t.home.split.buyingEyebrow}</p>
                <h4>{t.home.split.buyingHeading}</h4>
                <p>{t.home.split.buyingBody}</p>
              </div>
              <div className="move-card__foot">
                <RollButton href="/buy" variant="white" block>
                  {t.home.split.buyingCta}
                </RollButton>
              </div>
            </article>
            <article className="move-card move-card--sell">
              <div className="move-card__head">
                <span className="move-card__n" aria-hidden="true">02</span>
                <span className="move-card__icon" aria-hidden="true">
                  <IconArea />
                </span>
              </div>
              <div className="move-card__body">
                <p className="eyebrow">{t.home.split.sellingEyebrow}</p>
                <h4>{t.home.split.sellingHeading}</h4>
                <p>{t.home.split.sellingBody}</p>
              </div>
              <div className="move-card__foot">
                <RollButton href="/sell" variant="white" block>
                  {t.home.split.sellingCta}
                </RollButton>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* 7 · NEIGHBOURHOODS */}
      <section className="section section--no-bottom">
        <div className="container">
          <div className="sec-head sec-head--center">
            <SplitHeading as="h2" style={{ maxWidth: 520 }}>
              {t.home.neighbourhoods.headingMain} <em>{t.home.neighbourhoods.headingEm}</em>
            </SplitHeading>
            <Reveal as="p" className="lead" style={{ maxWidth: 600, textAlign: "center" }}>
              {t.home.neighbourhoods.lead}
            </Reveal>
          </div>
          <Reveal as="div" className="hood-grid">
            <Link href="/neighbourhoods/forest-hill" className="card-img card-img--tall">
              <ImageWithSkeleton className="bg" src={homeHoodBySlug.get("forest-hill")?.heroImg ?? ""} alt="" fill sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 33vw" />
              <div className="card-img__inner">
                <p className="card-img__loc">Forest Hill</p>
                <h4 className="card-img__title">{t.home.neighbourhoods.forestHill}</h4>
              </div>
            </Link>
            <Link href="/neighbourhoods/yorkville" className="card-img">
              <ImageWithSkeleton className="bg" src={homeHoodBySlug.get("yorkville")?.heroImg ?? ""} alt="" fill sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 33vw" />
              <div className="card-img__inner">
                <p className="card-img__loc">Yorkville</p>
                <h4 className="card-img__title">{t.home.neighbourhoods.yorkville}</h4>
              </div>
            </Link>
            <Link href="/neighbourhoods/the-beaches" className="card-img">
              <ImageWithSkeleton className="bg" src={homeHoodBySlug.get("the-beaches")?.heroImg ?? ""} alt="" fill sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 33vw" />
              <div className="card-img__inner">
                <p className="card-img__loc">The Beaches</p>
                <h4 className="card-img__title">{t.home.neighbourhoods.beaches}</h4>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 8 · ABOUT THE AGENT */}
      <section className="section">
        <div className="container">
          <div className="about-split">
            <Reveal as="div" className="about-photo">
              <ImageWithSkeleton src={priya.gallery?.[3] ?? priya.photo} alt="" fill sizes="(max-width: 809px) 100vw, 50vw" />
              <div className="cred-card">
                <p className="eyebrow">{BRAND.agent.title}</p>
                <ul>
                  <li>{BRAND.agent.brokerage}</li>
                  <li>Licence {BRAND.agent.licenceNumber}</li>
                  <li>{BRAND.agent.languages.join(" / ")}</li>
                </ul>
              </div>
            </Reveal>
            <div className="about-copy">
              <Reveal as="p" className="eyebrow">
                {t.home.about.eyebrowPrefix}
                {firstName}
              </Reveal>
              <SplitHeading as="h2" className="h2s">
                {t.home.about.headingMain} <em>{t.home.about.headingEm}</em>
              </SplitHeading>
              <Reveal as="p" className="lead">
                {fullName} {t.home.about.lead.replace("{name} ", "")}
              </Reveal>
              <Reveal as="div" className="quote-box">
                <Image className="quote-box__mark" width={50} height={50} src="/images/WKagG04AvCVspRdazfPUvdxrnY.svg" alt="" />
                <p>&quot;Call, text, or email: I reply the same way you reach out, usually the same day.&quot;</p>
              </Reveal>
              <Reveal as="div" className="mini-stats">
                <div>
                  <strong>6</strong>
                  <span>{t.home.about.miniNeighbourhoods}</span>
                </div>
                <div>
                  <strong>{properties.length}</strong>
                  <span>{t.home.about.miniProperties}</span>
                </div>
                <div>
                  <strong>12+</strong>
                  <span>{t.home.about.miniYears}</span>
                </div>
              </Reveal>
              <Reveal as="div" style={{ marginTop: 30 }}>
                <RollButton href="/about" variant="ghost">
                  {t.home.about.cta}
                </RollButton>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 9 · RECENT SALES */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="sec-head__title">
              <Reveal as="p" className="eyebrow">
                {t.home.sales.eyebrow}
              </Reveal>
              <SplitHeading as="h2">
                {t.home.sales.headingMain} <em>{t.home.sales.headingEm}</em>
              </SplitHeading>
            </div>
            <RollButton href="/sold" variant="ghost">
              {t.home.sales.viewSold}
            </RollButton>
          </div>
          <Reveal as="div" className="sold-list">
            {soldSample.map((p) => (
              <div className="sold-row" key={p.slug}>
                <div className="sold-row__thumb">
                  <Image src={resolveImageSrc(p.img)} alt="" width={100} height={100} />
                </div>
                <div className="sold-row__name">
                  <h4>{p.name}</h4>
                  <p className="eyebrow">{p.loc}</p>
                </div>
                <p className="sold-row__price">{p.price}</p>
                <p className="sold-row__desc">{p.about[0]}</p>
                <span className="tag">{t.home.sales.soldTag}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 10 · TESTIMONIALS */}
      <section className="section section--sand section--no-bottom">
        <div className="container">
          <div className="sec-head sec-head--center">
            <Reveal as="p" className="eyebrow">
              {t.home.testimonials.eyebrow}
            </Reveal>
            <SplitHeading as="h2" style={{ maxWidth: 560 }}>
              {t.home.testimonials.heading}
            </SplitHeading>
          </div>
          <Reveal as="div" className="trio sec-body">
            {featuredTestimonials.map((tm, i) => (
              <article
                className={`info-card ${i === 0 ? "info-card--copper" : i === 1 ? "info-card--white" : "info-card--sand"}`}
                key={tm.name}
                style={{ height: "auto", minHeight: 300 }}
              >
                <p className={i === 0 ? "eyebrow eyebrow--white" : "eyebrow"}>
                  {tm.role === "buyer" ? t.home.testimonials.buyer : t.home.testimonials.seller}
                </p>
                <div>
                  <p style={{ fontStyle: "italic" }}>&quot;{tm.quote}&quot;</p>
                </div>
                <div>
                  <h4 style={{ fontSize: "var(--fs-md)" }}>{tm.name}</h4>
                  <p className="t-xs" style={{ opacity: 0.7 }}>
                    {tm.source} · {tm.date}
                  </p>
                </div>
              </article>
            ))}
          </Reveal>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <RollButton href="/reviews" variant="forest">
              {t.home.testimonials.readAll}
            </RollButton>
          </div>
        </div>
      </section>

      {/* 11 · INSIGHTS PREVIEW */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="sec-head__title">
              <Reveal as="p" className="eyebrow">
                {t.home.insights.eyebrow}
              </Reveal>
              <SplitHeading as="h2">{t.home.insights.heading}</SplitHeading>
            </div>
            <RollButton href="/insights" variant="ghost">
              {t.home.insights.viewAll}
            </RollButton>
          </div>
          <div className="blog-grid">
            {latestPosts.map((post, i) => (
              <Link href={`/insights/${post.slug}`} key={post.slug} className="post">
                <div className="img">
                  <ImageWithSkeleton
                    src={post.heroImg ?? POST_IMAGES[i % POST_IMAGES.length]}
                    alt=""
                    fill
                    sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 367px"
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }} className="t-xs muted">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h4>{post.title}</h4>
                <p>{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 12 · VALUATION CTA BAND */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal as="div" className="cta">
            <Image className="bg" src="/images/YakBQUTrOeOG0sP4BryPbWMzhUg.jpg" alt="" fill sizes="100vw" />
            <div className="cta__copy">
              <p className="eyebrow eyebrow--white">{t.home.valuationCta.eyebrow}</p>
              <h2 className="h2s">{t.home.valuationCta.heading}</h2>
              <p className="lead">{t.home.valuationCta.lead}</p>
            </div>
            <div className="cta__card">
              <p className="eyebrow eyebrow--white70" style={{ marginBottom: 10 }}>
                {t.home.valuationCta.cardEyebrow}
              </p>
              <h3>{t.home.valuationCta.cardHeading}</h3>
              <p>{t.home.valuationCta.cardBody.replace("{firstName}", firstName)}</p>
              <RollButton href="/home-valuation" variant="white" block>
                {t.home.valuationCta.button}
              </RollButton>
              <small>{BRAND.email}</small>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 13 · FAQ PREVIEW */}
      <section className="section section--sand">
        <div className="container">
          <div className="faq-split">
            <div className="faq-split__left">
              <Reveal as="p" className="eyebrow">
                {t.home.faqPreview.eyebrow}
              </Reveal>
              <SplitHeading as="h2">{t.home.faqPreview.heading}</SplitHeading>
              <Reveal as="p">{t.home.faqPreview.lead}</Reveal>
              <RollButton href="/faq" variant="forest">
                {t.home.faqPreview.button}
              </RollButton>
            </div>
            <Reveal as="div" className="acc">
              <Accordion items={HOME_FAQS} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 14 · CONTACT */}
      <section className="section">
        <div className="container">
          <div className="sec-head sec-head--center">
            <Reveal as="p" className="eyebrow">
              {t.home.contactSection.eyebrow}
            </Reveal>
            <SplitHeading as="h2" style={{ maxWidth: 520 }}>
              {t.home.contactSection.headingTemplate.replace("{name}", fullName)}
            </SplitHeading>
          </div>
          <Reveal as="div" className="mini-stats" style={{ maxWidth: 760, margin: "40px auto 0" }}>
            <div>
              <strong>{t.home.contactSection.callText}</strong>
              <span>
                <a href={BRAND.phoneHref}>{BRAND.phone}</a>
              </span>
            </div>
            <div>
              <strong>{t.home.contactSection.emailText}</strong>
              <span>
                <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
              </span>
            </div>
            <div>
              <strong>{t.home.contactSection.officeText}</strong>
              <span>{BRAND.officeAddress}</span>
            </div>
          </Reveal>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <RollButton href="/contact" variant="copper">
              {t.home.contactSection.button}
            </RollButton>
          </div>
        </div>
      </section>
    </main>
  );
}
