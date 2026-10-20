import type { CollectionConfig } from "payload";

export const TaxRules: CollectionConfig = {
  slug: "tax-rules",
  labels: { plural: "Tax rules", singular: "Tax rule" },
  admin: {
    group: "Settings",
    useAsTitle: "province",
    defaultColumns: ["province", "municipality", "lastUpdated"],
    description: "Land transfer tax brackets and rebates behind the calculators.",
    listSearchableFields: ["province", "municipality", "sourceNote"],
  },
  fields: [
    { name: "province", type: "text", required: true },
    { name: "municipality", type: "text" },
    {
      name: "bracketTable",
      type: "array",
      fields: [
        { name: "upTo", type: "number", label: "Up to (leave blank for no cap)" },
        { name: "rate", type: "number", required: true },
      ],
    },
    {
      name: "firstTimeBuyerRebate",
      type: "group",
      fields: [
        { name: "maxRebate", type: "number" },
        { name: "description", type: "text" },
      ],
    },
    { name: "lastUpdated", type: "date" },
    { name: "sourceNote", type: "textarea" },
  ],
};
