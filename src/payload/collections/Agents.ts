import type { CollectionConfig } from "payload";
import { socialLinksField, textArrayField } from "../fields/shared";

export const Agents: CollectionConfig = {
  slug: "agents",
  admin: {
    group: "Portfolio",
    useAsTitle: "name",
    defaultColumns: ["name", "title", "email", "updatedAt"],
    description: "The people behind the brokerage, their credentials and contact details.",
    listSearchableFields: ["name", "title", "email"],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "photo", type: "upload", relationTo: "media", admin: { position: "sidebar" } },
    {
      name: "gallery",
      type: "array",
      fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
    },
    { name: "title", type: "text" },
    { name: "bio", type: "richText" },
    { name: "licenceNumber", type: "text" },
    { name: "regulator", type: "text" },
    { name: "brokerage", type: "text" },
    textArrayField("languages", "Languages"),
    textArrayField("designations", "Designations"),
    { name: "phone", type: "text", label: "WhatsApp number" },
    { name: "email", type: "text" },
    socialLinksField,
    { name: "displayOrder", type: "number", admin: { position: "sidebar" } },
  ],
};
