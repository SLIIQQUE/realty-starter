"use client";

import { Suspense, useEffect } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SplitHeading from "@/components/SplitHeading";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n/getLocale";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

type LeadType = "contact" | "valuation" | "viewing" | "newsletter" | "listing-enquiry";

const LEAD_TYPE_KEYS: Record<LeadType, keyof Omit<typeof en.thankYou, "backToHome" | "browseListings">> = {
  contact: "contact",
  valuation: "valuation",
  viewing: "viewing",
  newsletter: "newsletter",
  "listing-enquiry": "listingEnquiry",
};

function isLeadType(value: string): value is LeadType {
  return value in LEAD_TYPE_KEYS;
}

function ThankYouContent({ locale }: { locale: Locale }) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";
  const t = locale === "fr" ? fr : en;
  const copy = isLeadType(type) ? t.thankYou[LEAD_TYPE_KEYS[type]] : t.thankYou.default;
  const title: ReactNode = (
    <>
      {copy.titleMain} <em>{copy.titleEm}</em>
    </>
  );

  useEffect(() => {
    trackEvent("generate_lead", { lead_type: type || "unknown" });
    // Fire once per page view, intentionally not re-tracking on param changes within this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prefix = locale === "fr" ? "/fr" : "";

  return (
    <main>
      <section className="page-hero page-hero--center">
        <div className="container">
          <div className="stack">
            <p className="eyebrow">{copy.eyebrow}</p>
            <SplitHeading as="h1">{title}</SplitHeading>
            <p className="lead">{copy.body}</p>
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn btn--forest" href={prefix || "/"}>
              <span className="btn__roll">
                <span>{t.thankYou.backToHome}</span>
                <span>{t.thankYou.backToHome}</span>
              </span>
            </Link>
            <Link className="btn btn--ghost" href={`${prefix}/listings`}>
              <span className="btn__roll">
                <span>{t.thankYou.browseListings}</span>
                <span>{t.thankYou.browseListings}</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ThankYouContentWrapper({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={null}>
      <ThankYouContent locale={locale} />
    </Suspense>
  );
}
