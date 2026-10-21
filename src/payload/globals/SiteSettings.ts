import type { GlobalConfig } from "payload";
import { socialLinksField, textArrayField } from "../fields/shared";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    group: "Settings",
    description: "Contact details, compliance copy, SEO defaults and analytics IDs.",
  },
  fields: [
    { name: "siteName", type: "text" },
    { name: "logo", type: "upload", relationTo: "media" },
    { name: "phone", type: "text", label: "WhatsApp number" },
    { name: "email", type: "text" },
    { name: "address", type: "text" },
    { name: "hours", type: "text" },
    socialLinksField,
    { name: "footerText", type: "textarea" },
    { name: "complianceText", type: "textarea" },
    {
      name: "defaultSeo",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
      ],
    },
    {
      name: "analyticsIds",
      type: "group",
      fields: [{ name: "gaId", type: "text", label: "GA4 measurement ID" }],
    },
    {
      name: "languageSettings",
      type: "group",
      fields: [
        { name: "defaultLocale", type: "text" },
        textArrayField("supportedLocales", "Supported locales"),
      ],
    },
  ],
};
