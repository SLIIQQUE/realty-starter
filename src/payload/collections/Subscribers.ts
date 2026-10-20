import type { CollectionConfig } from "payload";

export const Subscribers: CollectionConfig = {
  slug: "subscribers",
  admin: {
    group: "Pipeline",
    useAsTitle: "email",
    defaultColumns: ["email", "confirmed", "unsubscribed", "createdAt"],
    description: "Double opt-in newsletter list. Confirmed addresses are safe to email.",
    listSearchableFields: ["email", "criteria"],
  },
  fields: [
    { name: "email", type: "text", required: true },
    { name: "criteria", type: "textarea" },
    { name: "consentTimestamp", type: "date" },
    { name: "confirmed", type: "checkbox", defaultValue: false },
    { name: "unsubscribed", type: "checkbox", defaultValue: false },
  ],
};
