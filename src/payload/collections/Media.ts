import type { CollectionConfig } from "payload";

/**
 * Standard Payload upload collection backing every `upload` field in this
 * config (photos, galleries, logos, hero images, floor plans, …).
 */
export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  labels: { plural: "Media library", singular: "Media item" },
  admin: {
    group: "Library",
    defaultColumns: ["filename", "alt", "updatedAt"],
    description: "Photography, floor plans and brand assets used across the site.",
    listSearchableFields: ["filename", "alt", "caption"],
  },
  upload: true,
  fields: [
    { name: "alt", type: "text", required: true },
    { name: "caption", type: "text" },
    { name: "credit", type: "text" },
  ],
};
