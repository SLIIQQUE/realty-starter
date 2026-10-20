import { NEIGHBORHOODS, neighborhoodsBySlug, type NeighborhoodPage } from "@/data/neighborhoods";
import { getCmsClient, isCmsConfigured } from "./payloadClient";
import { lexicalToParagraphs } from "./richText";

export type Neighbourhood = NeighborhoodPage;

export async function getNeighbourhoods(): Promise<Neighbourhood[]> {
  if (!isCmsConfigured()) return NEIGHBORHOODS;
  try {
    const payload = await getCmsClient();
    const result = await payload.find({ collection: "neighbourhoods", limit: 0, depth: 2 });
    return result.docs.map(mapNeighbourhoodDoc);
  } catch (err) {
    console.error("[content/neighbourhoods] CMS read failed, falling back to static data:", err);
    return NEIGHBORHOODS;
  }
}

export async function getNeighbourhoodBySlug(slug: string): Promise<Neighbourhood | undefined> {
  if (!isCmsConfigured()) return neighborhoodsBySlug.get(slug);
  try {
    const payload = await getCmsClient();
    const result = await payload.find({
      collection: "neighbourhoods",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });
    const doc = result.docs[0];
    return doc ? mapNeighbourhoodDoc(doc) : undefined;
  } catch (err) {
    console.error("[content/neighbourhoods] CMS read failed, falling back to static data:", err);
    return neighborhoodsBySlug.get(slug);
  }
}

/**
 * Best-effort mapping from the Payload "Neighbourhoods" collection to the
 * site's existing static `NeighborhoodPage` shape. Approximate by design:
 * never exercised until a real `DATABASE_URI` is configured.
 */
function mapNeighbourhoodDoc(doc: any): Neighbourhood {
  const heroImg =
    doc.heroImage && typeof doc.heroImage === "object" && "url" in doc.heroImage
      ? (doc.heroImage.url as string)
      : "";

  return {
    slug: doc.slug ?? "",
    name: doc.name ?? "",
    region: doc.city ?? "",
    heroImg,
    blurb: doc.summary ?? "",
    longDescription: lexicalToParagraphs(doc.longDescription),
    stats: doc.stats?.map((s: { label?: string; value?: string }) => [s?.label ?? "", s?.value ?? ""]) ?? [],
    lat: doc.mapData?.lat ?? 0,
    lng: doc.mapData?.lng ?? 0,
  };
}
