import { PROPERTIES, propertiesBySlug, type Property } from "@/data/properties";
import { getCmsClient, isCmsConfigured } from "./payloadClient";
import { lexicalToParagraphs } from "./richText";

/**
 * Plain TS type (not a Payload-generated type) so the rest of the app can
 * import this without depending on `payload generate:types` having run.
 * It mirrors the site's existing static `Property` shape (the shape every
 * listing page/component already renders) so callers don't need to branch
 * on where the data came from.
 */
export type Listing = Property;

export async function getListings(): Promise<Listing[]> {
  if (!isCmsConfigured()) return PROPERTIES;
  try {
    const payload = await getCmsClient();
    const result = await payload.find({ collection: "listings", limit: 0, depth: 2 });
    return result.docs.map(mapListingDoc);
  } catch (err) {
    console.error("[content/listings] CMS read failed, falling back to static data:", err);
    return PROPERTIES;
  }
}

export async function getListingBySlug(slug: string): Promise<Listing | undefined> {
  if (!isCmsConfigured()) return propertiesBySlug.get(slug);
  try {
    const payload = await getCmsClient();
    const result = await payload.find({
      collection: "listings",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });
    const doc = result.docs[0];
    return doc ? mapListingDoc(doc) : undefined;
  } catch (err) {
    console.error("[content/listings] CMS read failed, falling back to static data:", err);
    return propertiesBySlug.get(slug);
  }
}

/**
 * Best-effort mapping from the Payload "Listings" collection (see
 * payload.config.ts) to the site's existing static `Property` shape. The two
 * field sets don't line up 1:1 (e.g. `price` is a number in the CMS and a
 * formatted string here); this is never exercised until a real
 * `DATABASE_URI` is configured, so it's intentionally approximate and worth
 * revisiting once pages migrate to consume `Listing` directly instead of
 * `Property`.
 */
function mapListingDoc(doc: any): Listing {
  const mediaUrl = (value: unknown): string | undefined =>
    value && typeof value === "object" && "url" in (value as Record<string, unknown>)
      ? ((value as Record<string, unknown>).url as string)
      : undefined;

  const gallery: string[] =
    doc.gallery?.map((row: { image?: unknown }) => mediaUrl(row?.image)).filter(Boolean) ?? [];

  return {
    slug: doc.slug ?? "",
    name: doc.title ?? "",
    loc: [doc.address, doc.city].filter(Boolean).join(", "),
    lat: doc.lat ?? 0,
    lng: doc.lng ?? 0,
    price: typeof doc.price === "number" ? `$${doc.price.toLocaleString("en-CA")}` : "",
    bed: doc.beds ?? 0,
    bath: doc.baths ?? 0,
    sqft: doc.size ?? "",
    feat: doc.features?.[0]?.value ?? "",
    sold: doc.status === "Sold",
    status: doc.status ?? "Available",
    ptype: doc.propertyType ?? "",
    year: doc.yearBuilt ?? "",
    lot: doc.lotSize ?? "",
    park: doc.parking ?? "",
    img: gallery[0] ?? "",
    img2: gallery[1] ?? "",
    thumbs: gallery.slice(2),
    about: lexicalToParagraphs(doc.description),
    features: doc.features?.map((row: { value?: string }) => row?.value).filter(Boolean) ?? [],
    hood:
      doc.neighbourhood && typeof doc.neighbourhood === "object"
        ? {
            name: doc.neighbourhood.name ?? doc.city ?? doc.area ?? "",
            region: doc.neighbourhood.city ?? doc.province ?? "",
            blurb: doc.neighbourhood.summary ?? "",
            stats:
              doc.neighbourhood.stats?.map((s: { label?: string; value?: string }) => [
                s?.label ?? "",
                s?.value ?? "",
              ]) ?? [],
          }
        : { name: doc.city ?? doc.area ?? "", region: doc.province ?? "", blurb: "", stats: [] },
    openHouses:
      doc.openHouseDates?.map((row: { date?: string; time?: string }) => ({
        date: row?.date ?? "",
        time: row?.time ?? "",
      })) ?? [],
    tourUrl: doc.videoUrl || undefined,
  };
}
