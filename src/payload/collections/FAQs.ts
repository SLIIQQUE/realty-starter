import type { CollectionConfig } from "payload";

export const FAQs: CollectionConfig = {
  slug: "faqs",
  admin: {
    group: "Growth",
    useAsTitle: "question",
    defaultColumns: ["question", "topic", "displayOrder", "updatedAt"],
    description: "Reusable answers for listing pages, neighbourhoods and the FAQ page.",
    listSearchableFields: ["question", "answer", "topic"],
  },
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "richText" },
    { name: "topic", type: "text", admin: { position: "sidebar" } },
    { name: "displayOrder", type: "number", admin: { position: "sidebar" } },
  ],
};
