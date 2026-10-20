import type { CollectionConfig } from "payload";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    group: "Growth",
    useAsTitle: "name",
    defaultColumns: ["name", "role", "date", "permissionRecorded", "updatedAt"],
    description: "Client stories, kept with the consent record attached.",
    listSearchableFields: ["name", "quote", "source"],
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      options: ["buyer", "seller"],
      admin: { position: "sidebar" },
    },
    { name: "quote", type: "textarea" },
    { name: "source", type: "text" },
    // Free-text ("August 2026"), not a real calendar date — matches the static
    // Testimonial.date data (and the page that renders it) already in use.
    { name: "date", type: "text", admin: { position: "sidebar" } },
    { name: "photo", type: "upload", relationTo: "media", admin: { position: "sidebar" } },
    {
      name: "permissionRecorded",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
  ],
};
