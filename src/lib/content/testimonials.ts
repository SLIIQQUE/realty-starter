import { getCmsClient, isCmsConfigured } from "./payloadClient";

export type Testimonial = {
  name: string;
  role: "buyer" | "seller";
  quote: string;
  source: string;
  date: string;
  photo: string;
  permissionRecorded: boolean;
};

async function staticFallback(): Promise<Testimonial[]> {
  try {
    const mod = await import("@/data/testimonials");
    return mod.TESTIMONIALS;
  } catch {
    // src/data/testimonials.ts hasn't landed yet: safe to return nothing.
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isCmsConfigured()) return staticFallback();
  try {
    const payload = await getCmsClient();
    const result = await payload.find({ collection: "testimonials", limit: 0, depth: 1 });
    return result.docs.map(mapTestimonialDoc);
  } catch (err) {
    console.error("[content/testimonials] CMS read failed, falling back to static data:", err);
    return staticFallback();
  }
}

/**
 * Best-effort mapping from the Payload "Testimonials" collection to this
 * module's `Testimonial` shape. Approximate by design: never exercised
 * until a real `DATABASE_URI` is configured.
 */
function mapTestimonialDoc(doc: any): Testimonial {
  const photo =
    doc.photo && typeof doc.photo === "object" && "url" in doc.photo ? (doc.photo.url as string) : "";

  return {
    name: doc.name ?? "",
    role: doc.role === "seller" ? "seller" : "buyer",
    quote: doc.quote ?? "",
    source: doc.source ?? "",
    date: doc.date ?? "",
    photo,
    permissionRecorded: Boolean(doc.permissionRecorded),
  };
}
