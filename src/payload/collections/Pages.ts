import type { Block, CollectionConfig } from "payload";
import { seoField } from "../fields/shared";

const HeroBlock: Block = {
  slug: "hero",
  fields: [
    { name: "heading", type: "text" },
    { name: "subheading", type: "text" },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "ctaLabel", type: "text" },
    { name: "ctaHref", type: "text" },
  ],
};

const TextBlock: Block = {
  slug: "text",
  fields: [{ name: "content", type: "richText" }],
};

const ImageBlock: Block = {
  slug: "image",
  fields: [
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "caption", type: "text" },
  ],
};

const CtaBlock: Block = {
  slug: "cta",
  fields: [
    { name: "heading", type: "text" },
    { name: "buttonLabel", type: "text" },
    { name: "buttonHref", type: "text" },
  ],
};

const FaqBlock: Block = {
  slug: "faq",
  fields: [
    { name: "heading", type: "text" },
    { name: "faqs", type: "relationship", relationTo: "faqs", hasMany: true },
  ],
};

const TestimonialsBlock: Block = {
  slug: "testimonials",
  fields: [
    { name: "heading", type: "text" },
    { name: "testimonials", type: "relationship", relationTo: "testimonials", hasMany: true },
  ],
};

const ListingsBlock: Block = {
  slug: "listings",
  fields: [
    { name: "heading", type: "text" },
    { name: "listings", type: "relationship", relationTo: "listings", hasMany: true },
  ],
};

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    group: "Growth",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
    description: "Composable landing pages built from hero, text, image and CTA blocks.",
    listSearchableFields: ["title", "slug"],
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    {
      name: "blocks",
      type: "blocks",
      blocks: [HeroBlock, TextBlock, ImageBlock, CtaBlock, FaqBlock, TestimonialsBlock, ListingsBlock],
    },
    seoField,
  ],
};
