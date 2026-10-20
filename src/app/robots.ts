import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // /admin and /api/* can never be indexed anyway (Payload's admin UI sends its own noindex;
    // the API routes return non-HTML/JSON responses), so disallowing them here keeps crawlers
    // from spending crawl budget requesting them in the first place rather than relying solely
    // on the per-page noindex meta tag to keep them out of the index after the fact.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
