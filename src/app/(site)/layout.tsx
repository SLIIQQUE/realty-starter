import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import JsonLd from "@/components/JsonLd";
import { FavoritesProvider } from "@/components/FavoritesContext";
import { CompareProvider } from "@/components/CompareContext";
import CompareBar from "@/components/CompareBar";
import StickyMobileBar from "@/components/StickyMobileBar";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AttributionCapture from "@/components/AttributionCapture";
import { organizationSchema, pageGeo, pageSocial, SITE_URL, websiteSchema, realEstateAgentSchema } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/getLocale";
import { BRAND } from "@/data/brand";
import "@/styles/fonts.css";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/components.css";
import "@/styles/pages.css";

export const viewport: Viewport = { themeColor: "#F2EFE6", width: "device-width", initialScale: 1 };

const TITLE = "Toronto Real Estate & GTA Homes for Sale";
const DESCRIPTION =
  "Curated Toronto and GTA listings, neighbourhood guides, and Canadian mortgage and land transfer tax calculators, plus remote buying support for Nigerian buyers.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${TITLE} | ${BRAND.siteName}`, template: `%s | ${BRAND.siteName}` },
  description: DESCRIPTION,
  applicationName: BRAND.siteName,
  authors: [{ name: BRAND.founder }],
  creator: BRAND.studioName,
  publisher: BRAND.studioName,
  category: "Real estate",
  alternates: { canonical: SITE_URL },
  formatDetection: { telephone: true, email: true, address: false },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  other: pageGeo("canada"),
  ...pageSocial({
    title: `${TITLE} | ${BRAND.siteName}`,
    description: DESCRIPTION,
    path: "/",
    ogImage: "home",
  }),
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className="no-js" suppressHydrationWarning>
      <body>
        {/* Removes the no-js fallback class the instant JS is available; mirrors main.js's first line. */}
        <Script id="no-js" strategy="beforeInteractive">
          {"document.documentElement.classList.remove('no-js');"}
        </Script>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <JsonLd data={[organizationSchema(), websiteSchema(SITE_URL), realEstateAgentSchema(SITE_URL)]} />
        <GoogleAnalytics />
        <AttributionCapture />
        <FavoritesProvider>
          <CompareProvider>
            <Header locale={locale} />
            <div id="main-content">{children}</div>
            <Footer locale={locale} />
            <CookieConsent />
            <CompareBar />
            <StickyMobileBar />
          </CompareProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
