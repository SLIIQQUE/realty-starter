import type { CollectionConfig } from "payload";

export const Redirects: CollectionConfig = {
  slug: "redirects",
  admin: {
    group: "Settings",
    useAsTitle: "from",
    defaultColumns: ["from", "to", "type", "updatedAt"],
    description: "Permanent and temporary URL redirects for retired pages.",
    listSearchableFields: ["from", "to"],
  },
  fields: [
    { name: "from", type: "text", required: true },
    { name: "to", type: "text", required: true },
    {
      name: "type",
      type: "select",
      defaultValue: "301",
      options: ["301", "302"],
    },
  ],
};
