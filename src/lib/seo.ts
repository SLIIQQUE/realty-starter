import type { Metadata } from "next";
import { BRAND } from "@/data/brand";
import { resolveImageSrc } from "@/lib/content/image";

/** Single source of truth for the production origin, used for canonical URLs, OG/Twitter
 * `url` fields, JSON-LD `@id`/`url` fields, `sitemap.ts` and `robots.ts`. Every page previously
 * redeclared this as a local const; centralizing it here means canonical/OG fixes can't drift
 * out of sync with each other across files. */
export const SITE_URL = "https://realestate.sliiqque.space";

/**
 * The two markets this site is built to be found in.
 *
 * Canada (Toronto/GTA) is the primary market and where the sample inventory sits. Nigeria is a
 * secondary, audience-led market: the site targets Nigerians buying or investing in Canadian
 * property (remote viewings, non-resident financing, naira-to-dollar planning), not Nigerian
 * domestic listings. That distinction matters for metadata honesty — nothing here claims a
 * Nigerian brokerage, office or inventory.
 */
export const MARKETS = {
  canada: {
    country: "CA",
    countryName: "Canada",
    region: "CA-ON",
    regionName: "Ontario",
    city: "Toronto",
    label: "Toronto & GTA",
    coordinates: "43.6532;-79.3832",
  },
  nigeria: {
    country: "NG",
    countryName: "Nigeria",
    region: "NG-LA",
    regionName: "Lagos",
    city: "Lagos",
    label: "Lagos & Abuja",
    coordinates: "6.5244;3.3792",
  },
} as const;

/** Branded 1200×630 preview cards, generated from the same type and palette as the site. */
export const OG_IMAGES = {
  default: "/og/default.png",
  home: "/og/home.png",
  listings: "/og/listings.png",
  neighbourhoods: "/og/neighbourhoods.png",
  buy: "/og/buy.png",
  sell: "/og/sell.png",
  valuation: "/og/valuation.png",
  insights: "/og/insights.png",
  tools: "/og/tools.png",
  nigeria: "/og/nigeria.png",
} as const;

export type OgImageKey = keyof typeof OG_IMAGES;

const absolute = (pathOrUrl: string) =>
  pathOrUrl.startsWith("http") ? pathOrUrl : `${SITE_URL}${pathOrUrl}`;

/** Post dates are stored human-readably ("Jul 8, 2026"). Both Open Graph's `article:published_time`
 * and schema.org's `datePublished` expect ISO 8601, so normalize to a date-only `YYYY-MM-DD`
 * string — using LOCAL date parts deliberately: converting to a UTC timestamp would shift a
 * midnight-local date to the previous day for any positive-offset timezone (the demo data did
 * exactly that, turning Jul 8 into Jul 7T23:00Z). Date-only is valid ISO 8601 and avoids the
 * off-by-one entirely. Falls back to the original string if unparseable rather than throwing. */
export const isoDate = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
};

/**
 * Builds the `alternates` field for a page's metadata, always including a self-referencing
 * `canonical` URL. Next.js's metadata merge replaces the entire `alternates` object per
 * segment rather than deep-merging it (confirmed in
 * node_modules/next/dist/lib/metadata/resolve-metadata.js), so any page that sets `alternates`
 * at all must include `canonical` itself or it's lost, and any page that sets no `alternates`
 * silently inherits the root layout's (the homepage's) canonical instead of its own. This
 * helper is the one place that logic lives.
 *
 * `en-CA` / `fr-CA` / `x-default` are emitted for every page because the French site is served
 * from the same page files by a `/fr/...` middleware rewrite (see `src/middleware.ts`) — those
 * URLs exist and render with French chrome, so the annotations are valid rather than pointing at
 * 404s. French <title>/<meta description> copy is still English (a documented open item in
 * PRODUCTION-CHECKLIST §8.6); the hreflang pair remains the correct structural signal until that
 * copy is written.
 */
export function pageAlternates(path: string): NonNullable<Metadata["alternates"]> {
  const canonical = `${SITE_URL}${path === "/" ? "" : path}`;
  const french = `${SITE_URL}/fr${path === "/" ? "" : path}`;
  return {
    canonical,
    languages: {
      "en-CA": canonical,
      "fr-CA": french,
      "x-default": canonical,
    },
  };
}

/**
 * Legacy-but-harmless geographic hints. Google has de-emphasised `geo.*`, but Bing, some
 * regional crawlers and several AI retrieval pipelines still read them, and they cost nothing.
 * `other` is merged per segment by Next, so pages that don't set it inherit the Canadian
 * defaults set in the root layout.
 */
export function pageGeo(market: keyof typeof MARKETS = "canada"): NonNullable<Metadata["other"]> {
  const m = MARKETS[market];
  return {
    "geo.region": m.region,
    "geo.placename": `${m.city}, ${m.countryName}`,
    "geo.position": m.coordinates,
    ICBM: m.coordinates.split(";").join(", "),
  };
}

type SocialOptions = {
  title: string;
  description: string;
  path: string;
  type?: "article";
  publishedTime?: string;
  /** Absolute image URL or a site-relative path. When a page has one real photo (a listing's
   * hero shot, a post's cover), pass it; otherwise fall back to a branded card from OG_IMAGES. */
  image?: string;
  imageAlt?: string;
  /** Which branded fallback to use when no photo is supplied. */
  ogImage?: OgImageKey;
};

/**
 * Builds BOTH `openGraph` and `twitter` for a page's metadata together, never one alone.
 * Next.js's metadata merge resolves each of these fields fresh from only the current segment's
 * own value (same full-replace behaviour as `alternates` above) — a page that sets
 * `openGraph.title` but not `twitter` keeps the root layout's `twitter.title` (the homepage's),
 * and vice versa. Setting them together here is what actually fixes a page's social-preview
 * identity, and also re-applies `siteName`/`locale`/`site`/`creator`, which otherwise reset to
 * nothing the moment any page touches either field.
 *
 * Every page now gets an image. Previously pages without a photo emitted no `og:image` at all,
 * so shared links fell back to a bare text card — the single biggest preview-quality gap.
 */
export function pageSocial(options: SocialOptions): Pick<Metadata, "openGraph" | "twitter"> {
  const url = `${SITE_URL}${options.path === "/" ? "" : options.path}`;
  const image = absolute(options.image ?? OG_IMAGES[options.ogImage ?? "default"]);
  const alt = options.imageAlt ?? `${options.title} — ${BRAND.siteName}`;
  const images = [{ url: image, width: 1200, height: 630, alt }];

  const openGraph: NonNullable<Metadata["openGraph"]> =
    options.type === "article"
      ? {
          type: "article",
          siteName: BRAND.siteName,
          locale: "en_CA",
          url,
          title: options.title,
          description: options.description,
          publishedTime: options.publishedTime,
          authors: [BRAND.agent.name],
          images,
        }
      : {
          type: "website",
          siteName: BRAND.siteName,
          locale: "en_CA",
          url,
          title: options.title,
          description: options.description,
          images,
        };

  return {
    openGraph,
    twitter: {
      card: "summary_large_image",
      site: BRAND.social.handle,
      creator: BRAND.social.handle,
      title: options.title,
      description: options.description,
      images,
    },
  };
}

/**
 * SLIIQQUE the studio — the entity that actually exists and is verifiable (Lagos HQ, parent
 * site, public socials). Kept separate from the fictional agent persona below so search engines
 * can tell the real company from the demo content it built.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BRAND.parentSiteUrl}/#organization`,
    name: BRAND.studioName,
    url: BRAND.parentSiteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${BRAND.parentSiteUrl}/brand/sliiqque-mark.png`,
    },
    email: BRAND.email,
    foundingDate: BRAND.founded,
    founder: { "@type": "Person", name: BRAND.founder },
    address: {
      "@type": "PostalAddress",
      addressLocality: MARKETS.nigeria.city,
      addressCountry: MARKETS.nigeria.country,
    },
    areaServed: [
      { "@type": "Country", name: MARKETS.canada.countryName },
      { "@type": "Country", name: MARKETS.nigeria.countryName },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: BRAND.email,
        areaServed: [MARKETS.canada.country, MARKETS.nigeria.country],
        availableLanguage: ["English", "French"],
      },
    ],
    sameAs: [BRAND.social.instagram, BRAND.social.x],
  };
}

export function websiteSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: BRAND.siteName,
    url: siteUrl,
    inLanguage: "en-CA",
    description: BRAND.conceptNotice,
    publisher: { "@id": `${BRAND.parentSiteUrl}/#organization` },
  };
}

/**
 * Unlike organizationSchema()/websiteSchema() above (which deliberately describe only SLIIQQUE
 * the studio), this describes the on-page demo persona (Priya Mehta / SLIIQQUE),
 * but it does so with the SAME information a visitor already reads on /about and in the footer
 * compliance block (fictional, sample, no real licence). Structured data that only restates
 * disclosed on-page content isn't a new deception; it's the spec's required RealEstateAgent
 * markup, applied honestly. Do not add review ratings or aggregateRating here. See
 * src/app/reviews/page.tsx for why testimonials stay without Review schema.
 *
 * `areaServed` now lists the GTA municipalities the sample portfolio actually covers plus
 * Nigeria, where the remote-buying audience sits. It is an audience statement, not a claim of a
 * second office — the address and disambiguation below stay Canadian and explicitly sample-only.
 */
export function realEstateAgentSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${siteUrl}/#agent`,
    name: BRAND.agent.name,
    url: siteUrl,
    telephone: BRAND.phone,
    email: BRAND.email,
    image: `${siteUrl}/brand/sliiqque-mark.png`,
    areaServed: [
      { "@type": "City", name: "Toronto" },
      { "@type": "City", name: "Mississauga" },
      { "@type": "City", name: "Vaughan" },
      { "@type": "City", name: "Markham" },
      { "@type": "City", name: "Richmond Hill" },
      { "@type": "City", name: "Brampton" },
      { "@type": "Country", name: MARKETS.nigeria.countryName },
    ],
    knowsLanguage: ["en-CA", "fr-CA"],
    address: {
      "@type": "PostalAddress",
      streetAddress: BRAND.officeAddress,
      addressLocality: "Toronto",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    priceRange: "$$$",
    currenciesAccepted: "CAD",
    disambiguatingDescription:
      "Sample/demo profile for a SLIIQQUE Studio capability demonstration, not a real, licensed real-estate registrant.",
  };
}

/**
 * Service markup for the Nigeria-to-Canada buying route. Describes a service the site actually
 * documents on /nigerian-buyers (remote tours, document review, financing introductions), with
 * Nigeria as the area served and the agent as provider. No price is asserted because the
 * commission structure of a real engagement isn't published.
 */
export function nigeriaRemoteBuyingSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/nigerian-buyers#service`,
    name: "Remote Toronto property buying for Nigerian buyers",
    serviceType: "Remote real estate buyer representation",
    description:
      "Video-led property tours, document review, non-resident financing introductions, currency and closing planning for buyers in Lagos, Abuja and across Nigeria purchasing Toronto and GTA property.",
    provider: { "@id": `${siteUrl}/#agent` },
    areaServed: [
      { "@type": "Country", name: MARKETS.nigeria.countryName },
      { "@type": "City", name: MARKETS.nigeria.city },
      { "@type": "City", name: "Abuja" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${siteUrl}/nigerian-buyers`,
      availableLanguage: ["English"],
    },
    audience: {
      "@type": "Audience",
      audienceType: "Nigerian buyers and investors purchasing Canadian property",
      geographicArea: { "@type": "Country", name: MARKETS.nigeria.countryName },
    },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function articleSchema(
  post: { title: string; excerpt: string; date: string; slug: string; image?: string },
  siteUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image ? `${siteUrl}${post.image}` : `${siteUrl}${OG_IMAGES.insights}`,
    datePublished: isoDate(post.date),
    // No separate edit-history data exists for this demo content (`src/data/content.ts`'s POSTS
    // are static, and the CMS mapper doesn't track a modified date either), so dateModified ==
    // datePublished, which is schema.org-valid shorthand for "unchanged since publish" rather
    // than an omission — Article rich-result eligibility wants this field present.
    dateModified: isoDate(post.date),
    inLanguage: "en-CA",
    author: { "@type": "Person", name: BRAND.agent.name, url: `${siteUrl}/team/priya-mehta` },
    publisher: {
      "@type": "Organization",
      name: BRAND.studioName,
      logo: { "@type": "ImageObject", url: `${siteUrl}/brand/sliiqque-mark.png` },
    },
    mainEntityOfPage: `${siteUrl}/insights/${post.slug}`,
  };
}

/**
 * Minimal `Place` markup for a neighbourhood guide page — these previously carried no JSON-LD
 * of their own (only the inherited site-wide Organization/WebSite/RealEstateAgent + the
 * BreadcrumbList from `<Breadcrumbs>`), despite being genuine local-area guide content.
 */
export function placeSchema(neighbourhood: { name: string; blurb: string; slug: string }, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: neighbourhood.name,
    description: neighbourhood.blurb,
    url: `${siteUrl}/neighbourhoods/${neighbourhood.slug}`,
    containedInPlace: { "@type": "City", name: "Toronto", containedInPlace: { "@type": "State", name: "Ontario" } },
  };
}

/**
 * `ItemList` markup for index pages (listings, neighbourhoods). It tells search and answer
 * engines that the page is a collection with an order, which is what earns carousel-style and
 * "best X in Y" citation treatment. URLs and names mirror the visible cards exactly.
 */
export function itemListSchema(
  name: string,
  items: { name: string; url: string }[],
  siteUrl: string,
  pagePath: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: `${siteUrl}${pagePath}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${siteUrl}${item.url}`,
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Product/Offer markup for a single listing (spec §5.5: "listing markup on listing pages").
 * Mirrors exactly the price/status/address already shown on that listing's own page.
 */
export function realEstateListingSchema(
  property: {
    name: string;
    price: string;
    status: string;
    loc: string;
    img: string;
    slug: string;
    bed?: string | number;
    bath?: string | number;
    sqft?: string;
  },
  siteUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.name,
    // `property.img` is a bare filename against static data, or an already-absolute
    // `/api/media/file/...` path once the CMS is connected (see resolveImageSrc) — building
    // this with a hardcoded `/images/` prefix broke the second case (double-prefixed URL).
    image: `${siteUrl}${resolveImageSrc(property.img)}`,
    url: `${siteUrl}/listings/${property.slug}`,
    category: "Residential real estate listing (sample)",
    additionalProperty: [
      property.bed != null ? { "@type": "PropertyValue", name: "Bedrooms", value: String(property.bed) } : null,
      property.bath != null ? { "@type": "PropertyValue", name: "Bathrooms", value: String(property.bath) } : null,
      property.sqft ? { "@type": "PropertyValue", name: "Interior size", value: property.sqft } : null,
    ].filter(Boolean),
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: property.price.replace(/[^0-9.]/g, ""),
      availability:
        property.status === "Sold" || property.status === "Pending"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      areaServed: property.loc,
      url: `${siteUrl}/listings/${property.slug}`,
    },
  };
}
