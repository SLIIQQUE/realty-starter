/* eslint-disable no-console */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getCmsClient, isCmsConfigured } from "@/lib/content/payloadClient";
import { AGENTS } from "@/data/agents";
import { TESTIMONIALS } from "@/data/testimonials";
import { PROPERTIES } from "@/data/properties";
import { NEIGHBORHOODS } from "@/data/neighborhoods";
import { POSTS } from "@/data/content";
import { TOPIC_FAQS } from "@/data/faqs";
import { SOLD_PROPERTIES } from "@/data/soldProperties";

/**
 * One-time (safe to re-run — upserts by slug/name) migration of every static-data image and
 * record in src/data/*.ts into the Payload/Postgres CMS. See the "Move static images/content
 * into the Payload/Neon CMS" plan. Protected by the same shared-secret header pattern as
 * /api/leads/export — never expose this token client-side.
 */

// Matches the 6-image list previously hardcoded in insights/page.tsx (one distinct image per
// post; the home page's 3-post preview only ever reads the first 3 of these).
const POST_HERO_IMAGES = [
  "YakBQUTrOeOG0sP4BryPbWMzhUg.jpg",
  "bszTW1u4QW54iYFG2R7pIPzqon4.jpg",
  "Pj9uv5laqDRjON76kpHxGvMJ5ko.jpg",
  "XYRf4RZvzWJ9msgmqyhKmKj2Lo.jpg",
  "qrlJc4vsKUvEXcbKW4lB1A6DZtU.jpg",
  "jb7LfoHr7Hn32s97adnDQZFO5o.jpg",
];

function mimeTypeFor(filename: string): string {
  if (filename.endsWith(".png")) return "image/png";
  if (filename.endsWith(".svg")) return "image/svg+xml";
  if (filename.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

/** Turns a plain paragraph array into the minimal Lexical JSON shape Payload's richText field expects. */
function paragraphsToLexical(paragraphs: string[]) {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: paragraphs.map((text) => ({
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr" as const,
        children: [{ type: "text", text, format: 0, style: "", mode: "normal", detail: 0, version: 1 }],
      })),
    },
  };
}

export async function POST(request: Request) {
  const token = request.headers.get("x-export-token");
  if (!token || token !== process.env.ADMIN_EXPORT_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "DATABASE_URI is not set" }, { status: 400 });
  }

  const payload = await getCmsClient();
  const summary: Record<string, { created: number; updated: number; skipped: number }> = {};
  const bump = (key: string, field: "created" | "updated" | "skipped") => {
    summary[key] ??= { created: 0, updated: 0, skipped: 0 };
    summary[key][field]++;
  };

  const mediaCache = new Map<string, number | string>();

  async function uploadMedia(filename: string, alt: string): Promise<number | string | null> {
    if (mediaCache.has(filename)) return mediaCache.get(filename)!;

    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: filename } },
      limit: 1,
    });
    if (existing.docs[0]) {
      mediaCache.set(filename, existing.docs[0].id);
      return existing.docs[0].id;
    }

    const filePath = path.join(process.cwd(), "public", "images", filename);
    if (!fs.existsSync(filePath)) {
      console.error(`[seed] missing image file, skipping: ${filename}`);
      return null;
    }
    const data = fs.readFileSync(filePath);
    const doc = await payload.create({
      collection: "media",
      data: { alt },
      file: { data, mimetype: mimeTypeFor(filename), name: filename, size: data.length },
    });
    mediaCache.set(filename, doc.id);
    return doc.id;
  }

  async function upsert(collection: string, whereField: string, whereValue: string, data: Record<string, unknown>) {
    const existing = await payload.find({ collection, where: { [whereField]: { equals: whereValue } }, limit: 1 });
    if (existing.docs[0]) {
      await payload.update({ collection, id: existing.docs[0].id, data });
      bump(collection, "updated");
      return existing.docs[0].id;
    }
    const created = await payload.create({ collection, data });
    bump(collection, "created");
    return created.id;
  }

  // ---- Agents (+ their photo/gallery) ----
  for (const agent of AGENTS) {
    const photoId = agent.photo ? await uploadMedia(agent.photo, `${agent.name} headshot`) : null;
    const gallery = [];
    for (const file of agent.gallery ?? []) {
      const id = await uploadMedia(file, `${agent.name} photo`);
      if (id) gallery.push({ image: id });
    }
    await upsert("agents", "slug", agent.slug, {
      name: agent.name,
      slug: agent.slug,
      photo: photoId,
      gallery,
      title: agent.title,
      bio: paragraphsToLexical(agent.bio.split("\n\n")),
      licenceNumber: agent.licenceNumber,
      regulator: agent.regulator,
      brokerage: agent.brokerage,
      languages: agent.languages.map((value) => ({ value })),
      designations: agent.designations.map((value) => ({ value })),
      phone: agent.phone,
      email: agent.email,
      socialLinks: agent.socialLinks,
      displayOrder: agent.displayOrder,
    });
  }
  const priyaId = (await payload.find({ collection: "agents", where: { slug: { equals: "priya-mehta" } }, limit: 1 }))
    .docs[0]?.id;

  // ---- Testimonials ----
  for (const t of TESTIMONIALS) {
    const photoId = t.photo ? await uploadMedia(t.photo, `${t.name} photo`) : null;
    await upsert("testimonials", "name", t.name, {
      name: t.name,
      role: t.role,
      quote: t.quote,
      source: t.source,
      date: t.date,
      photo: photoId,
      permissionRecorded: t.permissionRecorded,
    });
  }

  // ---- Neighbourhoods (seeded before Listings, which relate to them) ----
  const neighbourhoodIdByName = new Map<string, number | string>();
  for (const n of NEIGHBORHOODS) {
    const heroImageId = n.heroImg ? await uploadMedia(n.heroImg, `${n.name} neighbourhood`) : null;
    const id = await upsert("neighbourhoods", "slug", n.slug, {
      name: n.name,
      slug: n.slug,
      city: n.region,
      heroImage: heroImageId,
      summary: n.blurb,
      longDescription: paragraphsToLexical(n.longDescription),
      stats: n.stats.map(([label, value]) => ({ label, value })),
      mapData: { lat: n.lat, lng: n.lng },
    });
    neighbourhoodIdByName.set(n.name, id);
  }

  // ---- Listings ----
  for (const p of PROPERTIES) {
    const galleryFiles = [p.img, p.img2, ...p.thumbs].filter(Boolean);
    const gallery = [];
    for (const file of galleryFiles) {
      const id = await uploadMedia(file, `${p.name} photo`);
      if (id) gallery.push({ image: id });
    }
    const [city = "Toronto", province = "Ontario"] = p.hood.region.split(",").map((s) => s.trim());
    const price = Number(p.price.replace(/[^0-9]/g, "")) || undefined;

    await upsert("listings", "slug", p.slug, {
      title: p.name,
      slug: p.slug,
      status: p.status,
      price,
      propertyType: p.ptype,
      address: "",
      city,
      province,
      area: p.loc,
      lat: p.lat,
      lng: p.lng,
      beds: p.bed,
      baths: p.bath,
      size: p.sqft,
      lotSize: p.lot,
      yearBuilt: p.year,
      parking: p.park,
      neighbourhood: neighbourhoodIdByName.get(p.hood.name) ?? null,
      description: paragraphsToLexical(p.about),
      features: p.features.map((value) => ({ value })),
      gallery,
      videoUrl: p.tourUrl ?? "",
      agent: priyaId ?? null,
      openHouseDates: p.openHouses.map((oh) => ({ date: oh.date, time: oh.time })),
      publishedDate: new Date().toISOString(),
    });
  }

  // ---- Posts ----
  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const heroImageId = await uploadMedia(POST_HERO_IMAGES[i % POST_HERO_IMAGES.length], `${post.title} hero`);
    const parsedDate = new Date(post.date);
    await upsert("posts", "slug", post.slug, {
      title: post.title,
      slug: post.slug,
      category: post.category,
      heroImage: heroImageId,
      excerpt: post.excerpt,
      body: paragraphsToLexical(post.body),
      publishDate: Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate.toISOString(),
    });
  }

  // ---- FAQs (seeded from the richer, topic-grouped TOPIC_FAQS) ----
  for (const faq of TOPIC_FAQS) {
    await upsert("faqs", "question", faq.question, {
      question: faq.question,
      answer: paragraphsToLexical([faq.answer]),
      topic: faq.topic,
      displayOrder: faq.displayOrder,
    });
  }

  // ---- Sold properties ----
  for (const s of SOLD_PROPERTIES) {
    const photoId = s.photo ? await uploadMedia(s.photo, `${s.addressArea} sold photo`) : null;
    await upsert("sold-properties", "addressArea", s.addressArea, {
      addressArea: s.addressArea,
      saleMonth: s.saleMonth,
      soldPrice: Number(s.soldPrice.replace(/[^0-9]/g, "")) || undefined,
      propertyType: s.propertyType,
      photo: photoId,
      note: s.note,
    });
  }

  return NextResponse.json({ success: true, summary });
}
