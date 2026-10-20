import type { CollectionConfig } from "payload";
import { seoField, textArrayField } from "../fields/shared";

export const Neighbourhoods: CollectionConfig = {
  slug: "neighbourhoods",
  admin: {
    group: "Portfolio",
    useAsTitle: "name",
    defaultColumns: ["name", "city", "updatedAt"],
    description: "The local guides that sit behind every listing and area page.",
    listSearchableFields: ["name", "city", "summary"],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "city", type: "text", admin: { position: "sidebar" } },
    { name: "heroImage", type: "upload", relationTo: "media", admin: { position: "sidebar" } },
    { name: "summary", type: "textarea" },
    { name: "longDescription", type: "richText" },
    {
      name: "stats",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "value", type: "text", required: true },
      ],
    },
    textArrayField("lifestyleTags", "Lifestyle tags"),
    {
      name: "marketSnapshot",
      type: "group",
      fields: [
        { name: "priceRange", type: "text" },
        { name: "propertyTypes", type: "text" },
        { name: "lastUpdated", type: "date" },
      ],
    },
    { name: "amenities", type: "richText" },
    {
      name: "mapData",
      type: "group",
      fields: [
        { name: "lat", type: "number" },
        { name: "lng", type: "number" },
      ],
    },
    {
      name: "faq",
      type: "array",
      fields: [
        { name: "question", type: "text" },
        { name: "answer", type: "textarea" },
      ],
    },
    seoField,
  ],
};
