import type { CollectionConfig } from "payload";
import { seoField, textArrayField } from "../fields/shared";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    group: "Growth",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "author", "publishDate", "updatedAt"],
    description: "Market notes, neighbourhood stories and buying guides.",
    listSearchableFields: ["title", "excerpt", "category", "author"],
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "author", type: "text", admin: { position: "sidebar" } },
    { name: "category", type: "text", admin: { position: "sidebar" } },
    textArrayField("tags", "Tags"),
    { name: "heroImage", type: "upload", relationTo: "media" },
    { name: "excerpt", type: "textarea" },
    { name: "body", type: "richText" },
    { name: "readTime", type: "text", admin: { position: "sidebar" } },
    { name: "publishDate", type: "date", admin: { position: "sidebar" } },
    seoField,
  ],
};
