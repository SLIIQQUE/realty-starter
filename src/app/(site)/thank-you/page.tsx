import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/getLocale";
import ThankYouContent from "./ThankYouContent";
import { pageAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: pageAlternates("/thank-you", { languages: true }),
  // Post-submission confirmation page, not a destination anyone should find via search.
  robots: { index: false, follow: true },
};

export default async function ThankYouPage() {
  const locale = await getLocale();
  return <ThankYouContent locale={locale} />;
}
