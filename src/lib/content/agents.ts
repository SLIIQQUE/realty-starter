import { AGENTS, agentsBySlug, type Agent } from "@/data/agents";
import { getCmsClient, isCmsConfigured } from "./payloadClient";
import { lexicalToParagraphs } from "./richText";

export type { Agent };

export async function getAgents(): Promise<Agent[]> {
  if (!isCmsConfigured()) return AGENTS;
  try {
    const payload = await getCmsClient();
    const result = await payload.find({ collection: "agents", limit: 0, depth: 2, sort: "displayOrder" });
    return result.docs.map(mapAgentDoc);
  } catch (err) {
    console.error("[content/agents] CMS read failed, falling back to static data:", err);
    return AGENTS;
  }
}

export async function getAgentBySlug(slug: string): Promise<Agent | undefined> {
  if (!isCmsConfigured()) return agentsBySlug.get(slug);
  try {
    const payload = await getCmsClient();
    const result = await payload.find({
      collection: "agents",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    });
    const doc = result.docs[0];
    return doc ? mapAgentDoc(doc) : undefined;
  } catch (err) {
    console.error("[content/agents] CMS read failed, falling back to static data:", err);
    return agentsBySlug.get(slug);
  }
}

/**
 * Best-effort mapping from the Payload "Agents" collection to the site's existing
 * static `Agent` shape (see src/data/agents.ts).
 */
function mapAgentDoc(doc: any): Agent {
  const mediaUrl = (value: unknown): string =>
    value && typeof value === "object" && "url" in (value as Record<string, unknown>)
      ? (((value as Record<string, unknown>).url as string) ?? "")
      : "";

  return {
    slug: doc.slug ?? "",
    name: doc.name ?? "",
    photo: mediaUrl(doc.photo),
    gallery: doc.gallery?.map((row: { image?: unknown }) => mediaUrl(row?.image)).filter(Boolean) ?? [],
    title: doc.title ?? "",
    bio: lexicalToParagraphs(doc.bio).join("\n\n"),
    licenceNumber: doc.licenceNumber ?? "",
    regulator: doc.regulator ?? "",
    brokerage: doc.brokerage ?? "",
    languages: doc.languages?.map((row: { value?: string }) => row?.value).filter(Boolean) ?? [],
    designations: doc.designations?.map((row: { value?: string }) => row?.value).filter(Boolean) ?? [],
    phone: doc.phone ?? "",
    email: doc.email ?? "",
    socialLinks: {
      instagram: doc.socialLinks?.instagram,
      x: doc.socialLinks?.x,
      linkedin: doc.socialLinks?.linkedin,
    },
    displayOrder: doc.displayOrder ?? 0,
  };
}
