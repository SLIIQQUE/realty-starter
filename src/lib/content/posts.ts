import { POSTS, postsBySlug, type BlogPost } from "@/data/content";
import { getCmsClient, isCmsConfigured } from "./payloadClient";
import { lexicalToParagraphs } from "./richText";

export type Post = BlogPost;

export async function getPosts(): Promise<Post[]> {
  if (!isCmsConfigured()) return POSTS;
  try {
    const payload = await getCmsClient();
    const result = await payload.find({ collection: "posts", limit: 0, depth: 1 });
    return result.docs.map(mapPostDoc);
  } catch (err) {
    console.error("[content/posts] CMS read failed, falling back to static data:", err);
    return POSTS;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  if (!isCmsConfigured()) return postsBySlug.get(slug);
  try {
    const payload = await getCmsClient();
    const result = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    });
    const doc = result.docs[0];
    return doc ? mapPostDoc(doc) : undefined;
  } catch (err) {
    console.error("[content/posts] CMS read failed, falling back to static data:", err);
    return postsBySlug.get(slug);
  }
}

/**
 * Best-effort mapping from the Payload "Posts" collection to the site's
 * existing static `BlogPost` shape. Approximate by design: never exercised
 * until a real `DATABASE_URI` is configured.
 */
function mapPostDoc(doc: any): Post {
  const heroImg =
    doc.heroImage && typeof doc.heroImage === "object" && "url" in doc.heroImage
      ? (doc.heroImage.url as string)
      : undefined;

  let date = doc.publishDate ?? "";
  if (date) {
    const parsed = new Date(date);
    if (!Number.isNaN(parsed.getTime())) {
      date = parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
  }

  return {
    slug: doc.slug ?? "",
    category: doc.category ?? "",
    date,
    title: doc.title ?? "",
    excerpt: doc.excerpt ?? "",
    body: lexicalToParagraphs(doc.body),
    heroImg,
  };
}
