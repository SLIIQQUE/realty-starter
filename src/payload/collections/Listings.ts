import type { CollectionConfig } from "payload";
import { seoField, textArrayField } from "../fields/shared";

export const Listings: CollectionConfig = {
  slug: "listings",
  admin: {
    group: "Portfolio",
    useAsTitle: "title",
    defaultColumns: ["gallery", "title", "status", "price", "city", "updatedAt"],
    description: "Every live, pending and sold property in the portfolio.",
    listSearchableFields: ["title", "address", "city", "slug"],
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "Available",
      options: ["Available", "New Listing", "Pending", "Sold"],
      admin: {
        position: "sidebar",
        components: { Cell: "/src/payload/components/cells/StatusCell#default" },
      },
    },
    {
      name: "price",
      type: "number",
      label: "Price (CAD)",
      admin: {
        position: "sidebar",
        components: { Cell: "/src/payload/components/cells/PriceCell#default" },
      },
    },
    {
      name: "listingType",
      type: "select",
      defaultValue: "Sale",
      options: ["Sale", "Lease"],
      admin: { position: "sidebar" },
    },
    { name: "propertyType", type: "text" },
    { name: "address", type: "text" },
    { name: "city", type: "text" },
    { name: "province", type: "text" },
    { name: "postalCode", type: "text" },
    { name: "area", type: "text" },
    { name: "lat", type: "number" },
    { name: "lng", type: "number" },
    { name: "beds", type: "number" },
    { name: "baths", type: "number" },
    { name: "size", type: "text" },
    { name: "lotSize", type: "text" },
    { name: "yearBuilt", type: "text" },
    { name: "taxes", type: "text" },
    { name: "fees", type: "text" },
    { name: "parking", type: "text" },
    { name: "neighbourhood", type: "relationship", relationTo: "neighbourhoods" },
    { name: "description", type: "richText" },
    textArrayField("features", "Features"),
    {
      name: "gallery",
      type: "array",
      fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
      admin: {
        components: { Cell: "/src/payload/components/cells/GalleryThumbCell#default" },
      },
    },
    { name: "videoUrl", type: "text" },
    {
      name: "floorPlans",
      type: "array",
      fields: [{ name: "file", type: "upload", relationTo: "media", required: true }],
    },
    {
      name: "agent",
      type: "relationship",
      relationTo: "agents",
      admin: { position: "sidebar" },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
    {
      name: "openHouseDates",
      type: "array",
      fields: [
        // Free-text, not a real calendar date ("Sat, Nov 8") — matches how the static
        // Property.openHouses data (and the page that renders it) already treats this.
        { name: "date", type: "text" },
        { name: "time", type: "text" },
      ],
    },
    seoField,
    { name: "publishedDate", type: "date", admin: { position: "sidebar" } },
    { name: "soldDate", type: "date", admin: { position: "sidebar" } },
  ],
};
