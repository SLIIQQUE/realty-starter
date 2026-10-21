/**
 * Models the CMS "Site Settings" collection described in the Canada Realtor
 * Vertical build spec (§6). This file's job is to model the CMS shape, not
 * invent new facts: values are pulled from src/data/brand.ts (BRAND) where
 * a fact already exists there. Colour values are NOT duplicated here; see
 * the design tokens in src/app/tokens.css (or equivalent) as the source of
 * truth for the site's colour palette.
 */
import { BRAND } from "./brand";

export type SiteSettings = {
  siteName: string;
  logo: string;
  colours: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  socialLinks: { instagram?: string; x?: string };
  footerText: string;
  complianceText: string;
  defaultSeo: { title: string; description: string };
  analyticsIds: { gaId?: string };
  languageSettings: { defaultLocale: string; supportedLocales: string[] };
};

export const SITE_SETTINGS: SiteSettings = {
  siteName: BRAND.siteName,
  logo: "/brand",
  colours: "See design tokens in src/app/tokens.css, not duplicated here.",
  phone: BRAND.whatsappNumber,
  email: BRAND.email,
  address: BRAND.officeAddress,
  hours: BRAND.hours,
  socialLinks: {
    instagram: BRAND.social.instagram,
    x: BRAND.social.x,
  },
  footerText: BRAND.tagline,
  complianceText: BRAND.conceptNotice,
  defaultSeo: {
    title: `${BRAND.siteName}: ${BRAND.tagline}`,
    description: BRAND.conceptNotice,
  },
  analyticsIds: {
    // No analytics configured for this concept demo.
    gaId: undefined,
  },
  languageSettings: {
    defaultLocale: "en-CA",
    supportedLocales: ["en-CA", "fr-CA"],
  },
};
