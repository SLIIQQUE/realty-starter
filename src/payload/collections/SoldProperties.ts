import type { CollectionConfig } from "payload";

export const SoldProperties: CollectionConfig = {
  slug: "sold-properties",
  labels: { plural: "Sold homes", singular: "Sold home" },
  admin: {
    group: "Portfolio",
    useAsTitle: "addressArea",
    defaultColumns: ["addressArea", "saleMonth", "soldPrice", "propertyType", "updatedAt"],
    description: "The sales record used for the sold gallery and proof of results.",
    listSearchableFields: ["addressArea", "saleMonth", "note"],
  },
  fields: [
    { name: "addressArea", type: "text", required: true },
    {
      name: "saleMonth",
      type: "text",
      admin: { position: "sidebar" },
    },
    {
      name: "soldPrice",
      type: "number",
      label: "Sold price (CAD)",
      admin: {
        position: "sidebar",
        components: { Cell: "/src/payload/components/cells/PriceCell#default" },
      },
    },
    { name: "propertyType", type: "text" },
    { name: "photo", type: "upload", relationTo: "media", admin: { position: "sidebar" } },
    { name: "note", type: "textarea" },
  ],
};
