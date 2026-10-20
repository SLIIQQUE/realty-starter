import type { Metadata } from "next";
import { BRAND } from "@/data/brand";
import { resolveImageSrc } from "@/lib/content/image";

/** Single source of truth for the production origin, used for canonical URLs, OG/Twitter
 * `url` fields, JSON-LD `@id`/`url` fields, `sitemap.ts` and `robots.ts`. Every page previously
 * redeclared this as a local const; centralizing it here means canonical/OG fixes can't drift
 * out of sync with each other across files. */
export const SITE_URL = "https://realestate.sliiqque.space";

/** Builds the `alternates` field for a page's metadata, always including a self-referencing
 * `canonical` URL. Next.js's metadata merge replaces the entire `alternates` object per
 * segment rather than deep-merging it (confirmed in
 * node_modules/next/dist/lib/metadata/resolve-metadata.js), so any page that sets `alternates`
 * at all — even just for `languages` (hreflang) — must include `canonical` itself or it's lost,
 * and any page that sets no `alternates` silently inherits the root layout's (the homepage's)
 * canonical instead of its own. This helper is the one place that logic lives. */
export function pageAlternates(path: string, options?: { languages?: boolean }): { canonical: string; languages?: { en: string; fr: string } } {
  const canonical = `${SITE_URL}${path}`;
  if (!options?.languages) return { canonical };
  return {
    canonical,
    languages: { en: canonical, fr: `${SITE_URL}/fr${path === "/" ? "" : path}` },
  };
}

/**
 * Builds BOTH `openGraph` and `twitter` for a page's metadata together, never one alone.
 * Next.js's metadata merge resolves each of these fields fresh from only the current segment's
 * own value (same full-replace behaviour as `alternates` above, confirmed in the same
 * resolve-metadata.js switch) — a page that sets `openGraph.title` but not `twitter` keeps the
 * root layout's `twitter.title` (the homepage's), and vice versa. Setting them together here is
 * what actually fixes a page's social-preview identity, and also re-applies `siteName`/`locale`/
 * `site`/`creator`, which otherwise reset to nothing the moment any page touches either field.
 */
export function pageSocial(options: {
  title: string;
  description: string;
  path: string;
  type?: "article";
  publishedTime?: string;
  /** Absolute image URL, when the page has one real photo to show (e.g. a listing's hero shot) — otherwise omitted, not backfilled with a generic placeholder. */
  image?: string;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const url = `${SITE_URL}${options.path}`;
  const images = options.image ? [{ url: options.image }] : undefined;
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
 * Deliberately Organization + WebSite schema only, not RealEstateAgent/LocalBusiness or
 * per-property Product/Residence markup. This site is a concept demo (no real license, no
 * real listings), and those richer schema types exist specifically to get real businesses
 * and real inventory into Google's real-estate/local-business surfaces. Asserting them here
 * would misrepresent the site to search engines even though the on-page copy is honest.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.studioName,
    url: BRAND.parentSiteUrl,
    logo: `${BRAND.parentSiteUrl}/brand/sliiqque-mark.png`,
    email: BRAND.email,
    sameAs: [BRAND.social.instagram, BRAND.social.x],
  };
}

export function websiteSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.siteName,
    url: siteUrl,
    description: BRAND.conceptNotice,
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

/**
 * Unlike organizationSchema()/websiteSchema() above (which deliberately describe only SLIIQQUE
 * the studio), this describes the on-page demo persona (Priya Mehta / SLIIQQUE),
 * but it does so with the SAME information a visitor already reads on /about and in the footer
 * compliance block (fictional, sample, no real licence). Structured data that only restates
 * disclosed on-page content isn't a new deception; it's the spec's required RealEstateAgent
 * markup, applied honestly. Do not add review ratings or aggregateRating here. See
 * src/app/reviews/page.tsx for why testimonials stay without Review schema.
 */
export function realEstateAgentSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: BRAND.agent.name,
    url: siteUrl,
    telephone: BRAND.phone,
    email: BRAND.email,
    areaServed: "Toronto, Ontario, Canada",
    address: { "@type": "PostalAddress", streetAddress: BRAND.officeAddress, addressCountry: "CA" },
    disambiguatingDescription:
      "Sample/demo profile for a SLIIQQUE Studio capability demonstration, not a real, licensed real-estate registrant.",
  };
}

export function articleSchema(post: { title: string; excerpt: string; date: string; slug: string }, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    // No separate edit-history data exists for this demo content (`src/data/content.ts`'s POSTS
    // are static, and the CMS mapper doesn't track a modified date either), so dateModified ==
    // datePublished, which is schema.org-valid shorthand for "unchanged since publish" rather
    // than an omission — Article rich-result eligibility wants this field present.
    dateModified: post.date,
    author: { "@type": "Person", name: BRAND.agent.name },
    publisher: { "@type": "Organization", name: BRAND.studioName },
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
  property: { name: string; price: string; status: string; loc: string; img: string; slug: string },
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
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: property.price.replace(/[^0-9.]/g, ""),
      availability:
        property.status === "Sold" || property.status === "Pending"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
      areaServed: property.loc,
    },
  };
}
