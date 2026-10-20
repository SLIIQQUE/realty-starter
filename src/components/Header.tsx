"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BRAND } from "@/data/brand";
import type { Locale } from "@/lib/i18n/getLocale";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import FavoritesButton from "./FavoritesButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { LogoMark } from "./Logo";

type HeaderProps = { locale?: Locale };

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header({ locale = "en" }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = locale === "fr" ? fr : en;
  const prefix = locale === "fr" ? "/fr" : "";

  const NAV = [
    { href: "/", label: t.nav.home },
    { href: "/listings", label: t.nav.listings },
    { href: "/neighbourhoods", label: t.nav.neighbourhoods },
    { href: "/resources", label: t.nav.resources },
    { href: "/insights", label: t.nav.insights },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="site-header">
      {/* Concept demo topbar strip. Disabled for now.
      <div className="concept-bar">
        <div className="container concept-bar__inner">
          <span className="concept-bar__badge">Concept demo</span>
          <span className="concept-bar__text">
            A real-estate marketing concept by {BRAND.studioName}: sample listings, not a licensed brokerage.
          </span>
        </div>
      </div>
      */}
      <div className="container">
        <nav className="nav" aria-label="Primary">
          <Link className="nav__logo" href={prefix || "/"} aria-label={`${BRAND.siteName}, home`}>
            <span className="logo">
              <span className="logo__mark">
                <LogoMark />
              </span>
            </span>
          </Link>
          <div className="nav__links">
            {NAV.map((item) => {
              const href = `${prefix}${item.href}`;
              return (
                <Link key={item.href} href={href} aria-current={isActive(pathname, href) ? "page" : undefined}>
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="nav__actions">
            <LanguageSwitcher locale={locale} />
            <FavoritesButton />
            <Link className="btn btn--copper" href={`${prefix}/contact`}>
              <span className="btn__roll">
                <span>{t.nav.bookConsultation}</span>
                <span>{t.nav.bookConsultation}</span>
              </span>
            </Link>
            <button
              className="nav__menu"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8}>
                {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </nav>
      </div>
      {open && (
        <div className="nav-mobile">
          <div className="container nav-mobile__links">
            {NAV.map((item) => {
              const href = `${prefix}${item.href}`;
              return (
                <Link
                  key={item.href}
                  href={href}
                  aria-current={isActive(pathname, href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link className="btn btn--copper btn--block" href={`${prefix}/contact`} onClick={() => setOpen(false)}>
              <span className="btn__roll">
                <span>{t.nav.bookConsultation}</span>
                <span>{t.nav.bookConsultation}</span>
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
