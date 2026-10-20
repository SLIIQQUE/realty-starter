import { TOPIC_FAQS, type TopicFaq } from "@/data/faqs";
import { getCmsClient, isCmsConfigured } from "./payloadClient";
import { lexicalToParagraphs } from "./richText";

export type Faq = TopicFaq;

export async function getFaqs(): Promise<Faq[]> {
  if (!isCmsConfigured()) return TOPIC_FAQS;
  try {
    const payload = await getCmsClient();
    const result = await payload.find({ collection: "faqs", limit: 0, sort: "displayOrder" });
    return result.docs.map(mapFaqDoc);
  } catch (err) {
    console.error("[content/faqs] CMS read failed, falling back to static data:", err);
    return TOPIC_FAQS;
  }
}

/**
 * Best-effort mapping from the Payload "FAQs" collection to the site's
 * existing static `TopicFaq` shape. Approximate by design: never exercised
 * until a real `DATABASE_URI` is configured.
 */
function mapFaqDoc(doc: any): Faq {
  return {
    question: doc.question ?? "",
    answer: lexicalToParagraphs(doc.answer).join("\n\n"),
    topic: doc.topic ?? "Buying",
    displayOrder: doc.displayOrder ?? 0,
  };
}
