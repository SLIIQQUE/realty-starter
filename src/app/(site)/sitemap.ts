import type { MetadataRoute } from "next";
import { getListings } from "@/lib/content/listings";
import { getNeighbourhoods } from "@/lib/content/neighbourhoods";
import { getPosts } from "@/lib/content/posts";
import { getAgents } from "@/lib/content/agents";
import { resolveImageSrc } from "@/lib/content/image";
import { SITE_URL } from "@/lib/seo";

/**
 * Last time this template's static routes (copy, components) were actually touched — NOT
 * `new Date()` evaluated on every sitemap request, which previously made every URL look
 * "modified right now" forever. A `lastModified` that's always "now" carries no real freshness
 * signal, and Google has said it discounts `lastmod` values it judges unreliable. Bump this
 * constant by hand when static page content actually changes.
 */
const STATIC_CONTENT_LAST_UPDATED = new Date("2026-10-20");

/** The French site is a middleware rewrite of the same routes (`src/middleware.ts`), so every
 * canonical URL has a working `/fr` counterpart. Declaring the pair in the sitemap as
 * `xhtml:link` alternates is the sitemap-level equivalent of the page-level hreflang tags. */
const languageAlternates = (path: string) => ({
  alternates: {
    languages: {
      "en-CA": `${SITE_URL}${path}`,
      "fr-CA": `${SITE_URL}/fr${path}`,
    },
  },
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, neighbourhoods, posts, agents] = await Promise.all([
    getListings(),
    getNeighbourhoods(),
    getPosts(),
    getAgents(),
  ]);

  // /favorites and /compare are deliberately left out: both are noindex'd (see their own
  // `robots` metadata) since they show no unique content to an anonymous crawler, only
  // whatever the visitor has stored in their own browser.
  const staticRoutes = [
    "",
    "/listings",
    "/nigerian-buyers",
    "/neighbourhoods",
    "/resources",
    "/resources/buyers-guide",
    "/resources/sellers-guide",
    "/buy",
    "/sell",
    "/home-valuation",
    "/book-a-viewing",
    "/sold",
    "/reviews",
    "/tools/mortgage-calculator",
    "/tools/land-transfer-tax",
    "/open-houses",
    "/insights",
    "/team",
    "/about",
    "/press",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/accessibility",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: STATIC_CONTENT_LAST_UPDATED,
    ...languageAlternates(path),
  }));

  // Listings, neighbourhoods and agents carry no real modified-date field in either the static
  // data or the CMS mapping (see src/lib/content/*.ts) — omitting `lastModified` for them is
  // more honest than fabricating one, since Next/Google treat a missing value as "unknown," not
  // "never," and `lastModified` is optional on every sitemap entry.
  //
  // `images` is the image-sitemap extension: it points Google at the hero photo of each detail
  // page, which is what makes those photos eligible for image search rather than only the page.
  const propertyRoutes = properties.map((p) => ({
    url: `${SITE_URL}/listings/${p.slug}`,
    images: [`${SITE_URL}${resolveImageSrc(p.img)}`],
    ...languageAlternates(`/listings/${p.slug}`),
  }));
  const neighborhoodRoutes = neighbourhoods.map((n) => ({
    url: `${SITE_URL}/neighbourhoods/${n.slug}`,
    images: [`${SITE_URL}${resolveImageSrc(n.heroImg)}`],
    ...languageAlternates(`/neighbourhoods/${n.slug}`),
  }));
  const teamRoutes = agents.map((a) => ({
    url: `${SITE_URL}/team/${a.slug}`,
    ...languageAlternates(`/team/${a.slug}`),
  }));

  // Posts are the one content type with a genuine date already attached.
  const postRoutes = posts
    .map((p) => {
      const parsed = new Date(p.date);
      return {
        url: `${SITE_URL}/insights/${p.slug}`,
        lastModified: Number.isNaN(parsed.getTime()) ? undefined : parsed,
        images: p.heroImg ? [`${SITE_URL}${resolveImageSrc(p.heroImg)}`] : undefined,
        ...languageAlternates(`/insights/${p.slug}`),
      };
    });

  return [...staticRoutes, ...propertyRoutes, ...neighborhoodRoutes, ...postRoutes, ...teamRoutes];
}
