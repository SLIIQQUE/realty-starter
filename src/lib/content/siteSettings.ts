import { BRAND } from "@/data/brand";
import { getCmsClient, isCmsConfigured } from "./payloadClient";

export type SiteSettings = {
  siteName: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  socialLinks: { instagram?: string; x?: string; whatsapp?: string };
  footerText: string;
  complianceText: string;
  defaultSeo: { title: string; description: string };
  analyticsIds: { gaId?: string };
  languageSettings: { defaultLocale: string; supportedLocales: string[] };
};

/**
 * Shapes `@/data/brand`'s `BRAND` into the CMS "Site Settings" global shape
 * so callers get a consistent type whether or not a database is configured.
 * (If `@/data/siteSettings`'s `SITE_SETTINGS`, a closer-shaped model of the
 * same CMS global, is present, prefer it; otherwise fall back to reshaping
 * BRAND directly so this always compiles regardless of that file's state.)
 */
async function staticFallback(): Promise<SiteSettings> {
  try {
    const mod = await import("@/data/siteSettings");
    const s = mod.SITE_SETTINGS;
    return {
      siteName: s.siteName,
      logo: s.logo,
      phone: s.phone,
      email: s.email,
      address: s.address,
      hours: s.hours,
      socialLinks: s.socialLinks,
      footerText: s.footerText,
      complianceText: s.complianceText,
      defaultSeo: s.defaultSeo,
      analyticsIds: s.analyticsIds,
      languageSettings: s.languageSettings,
    };
  } catch {
    return {
      siteName: BRAND.siteName,
      logo: "",
      phone: BRAND.whatsappNumber,
      email: BRAND.email,
      address: BRAND.officeAddress,
      hours: BRAND.hours,
      socialLinks: { instagram: BRAND.social.instagram, x: BRAND.social.x },
      footerText: BRAND.tagline,
      complianceText: BRAND.conceptNotice,
      defaultSeo: { title: `${BRAND.siteName}: ${BRAND.tagline}`, description: BRAND.conceptNotice },
      analyticsIds: {},
      languageSettings: { defaultLocale: "en-CA", supportedLocales: ["en-CA"] },
    };
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isCmsConfigured()) return staticFallback();
  try {
    const payload = await getCmsClient();
    const doc = await payload.findGlobal({ slug: "site-settings" });
    return mapSiteSettingsDoc(doc);
  } catch (err) {
    console.error("[content/siteSettings] CMS read failed, falling back to static data:", err);
    return staticFallback();
  }
}

/**
 * Best-effort mapping from the Payload "SiteSettings" global to this
 * module's `SiteSettings` shape. Approximate by design: never exercised
 * until a real `DATABASE_URI` is configured.
 */
function mapSiteSettingsDoc(doc: any): SiteSettings {
  const logo =
    doc.logo && typeof doc.logo === "object" && "url" in doc.logo ? (doc.logo.url as string) : "";

  return {
    siteName: doc.siteName ?? "",
    logo,
    phone: doc.phone ?? "",
    email: doc.email ?? "",
    address: doc.address ?? "",
    hours: doc.hours ?? "",
    socialLinks: {
      instagram: doc.socialLinks?.instagram,
      x: doc.socialLinks?.x,
      whatsapp: doc.socialLinks?.whatsapp,
    },
    footerText: doc.footerText ?? "",
    complianceText: doc.complianceText ?? "",
    defaultSeo: { title: doc.defaultSeo?.title ?? "", description: doc.defaultSeo?.description ?? "" },
    analyticsIds: { gaId: doc.analyticsIds?.gaId },
    languageSettings: {
      defaultLocale: doc.languageSettings?.defaultLocale ?? "en-CA",
      supportedLocales:
        doc.languageSettings?.supportedLocales
          ?.map((row: { value?: string }) => row?.value)
          .filter(Boolean) ?? [],
    },
  };
}
