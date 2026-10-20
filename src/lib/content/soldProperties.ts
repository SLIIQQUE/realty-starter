import { SOLD_PROPERTIES, type SoldProperty } from "@/data/soldProperties";
import { getCmsClient, isCmsConfigured } from "./payloadClient";

export type { SoldProperty };

export async function getSoldProperties(): Promise<SoldProperty[]> {
  if (!isCmsConfigured()) return SOLD_PROPERTIES;
  try {
    const payload = await getCmsClient();
    const result = await payload.find({ collection: "sold-properties", limit: 0, depth: 1 });
    return result.docs.map(mapSoldPropertyDoc);
  } catch (err) {
    console.error("[content/soldProperties] CMS read failed, falling back to static data:", err);
    return SOLD_PROPERTIES;
  }
}

/**
 * Best-effort mapping from the Payload "SoldProperties" collection to the site's
 * existing static `SoldProperty` shape (see src/data/soldProperties.ts).
 */
function mapSoldPropertyDoc(doc: any): SoldProperty {
  const photo =
    doc.photo && typeof doc.photo === "object" && "url" in doc.photo ? (doc.photo.url as string) : "";

  return {
    addressArea: doc.addressArea ?? "",
    saleMonth: doc.saleMonth ?? "",
    soldPrice: typeof doc.soldPrice === "number" ? `$${doc.soldPrice.toLocaleString("en-CA")}` : "",
    propertyType: doc.propertyType ?? "",
    photo,
    note: doc.note ?? "",
  };
}
