"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/getLocale";

type LanguageSwitcherProps = {
  locale: Locale;
};

/**
 * `usePathname()` reports the browser-visible URL, not the middleware-rewritten internal path;
 * Next's rewrite is transparent to it. So on `/fr/about` this still returns `/fr/about`, which is
 * exactly what we need to compute the other language's URL (verified against the dev server; see
 * the task report for the curl checks).
 */
export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname() || "/";

  const isFrench = pathname === "/fr" || pathname.startsWith("/fr/");
  const enHref = isFrench ? pathname.slice("/fr".length) || "/" : pathname;
  const frHref = isFrench ? pathname : pathname === "/" ? "/fr" : `/fr${pathname}`;

  return (
    <div className="lang-switch" aria-label="Language">
      <Link href={enHref} aria-current={locale === "en" ? "page" : undefined}>
        EN
      </Link>
      <span aria-hidden="true">/</span>
      <Link href={frHref} aria-current={locale === "fr" ? "page" : undefined}>
        FR
      </Link>
    </div>
  );
}
