import type { CollectionConfig } from "payload";

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    group: "Pipeline",
    useAsTitle: "email",
    defaultColumns: ["name", "email", "type", "status", "createdAt"],
    description: "Every enquiry from the website, from first touch to close.",
    listSearchableFields: ["name", "email", "message", "sourcePage"],
  },
  fields: [
    {
      name: "type",
      type: "select",
      required: true,
      options: ["contact", "listing", "valuation", "viewing", "newsletter"],
      admin: {
        position: "sidebar",
        components: { Cell: "/src/payload/components/cells/LeadTypeCell#default" },
      },
    },
    { name: "name", type: "text" },
    { name: "email", type: "text" },
    { name: "phone", type: "text" },
    { name: "message", type: "textarea" },
    { name: "listingRef", type: "relationship", relationTo: "listings" },
    { name: "sourcePage", type: "text" },
    { name: "referrer", type: "text" },
    {
      name: "utm",
      type: "group",
      fields: [
        { name: "source", type: "text" },
        { name: "medium", type: "text" },
        { name: "campaign", type: "text" },
      ],
    },
    { name: "consentText", type: "textarea" },
    { name: "consentTimestamp", type: "date" },
    {
      name: "status",
      type: "select",
      defaultValue: "New",
      options: ["New", "Contacted", "Qualified", "Closed"],
      admin: {
        position: "sidebar",
        components: { Cell: "/src/payload/components/cells/StatusCell#default" },
      },
    },
    { name: "assignedTo", type: "text", admin: { position: "sidebar" } },
    { name: "notes", type: "textarea" },
    {
      name: "createdDate",
      type: "date",
      defaultValue: () => new Date().toISOString(),
      admin: { position: "sidebar" },
    },
  ],
};
