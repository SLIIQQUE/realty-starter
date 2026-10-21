"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/data/brand";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n/getLocale";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import { LogoMarkFooter } from "./Logo";

type FooterProps = { locale?: Locale };

const PAGE_LINK_HREFS = [
  "/",
  "/listings",
  "/sold",
  "/neighbourhoods",
  "/nigerian-buyers",
  "/about",
  "/reviews",
  "/resources",
  "/insights",
  "/faq",
  "/contact",
] as const;

const PAGE_LINK_KEYS: Record<(typeof PAGE_LINK_HREFS)[number], keyof typeof en.footer.linkLabels> = {
  "/": "home",
  "/listings": "listings",
  "/sold": "sold",
  "/neighbourhoods": "neighbourhoods",
  "/nigerian-buyers": "fromNigeria",
  "/about": "about",
  "/reviews": "reviews",
  "/resources": "resources",
  "/insights": "insights",
  "/faq": "faq",
  "/contact": "contact",
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Footer({ locale = "en" }: FooterProps) {
  const pathname = usePathname();
  const t = locale === "fr" ? fr : en;
  const prefix = locale === "fr" ? "/fr" : "";

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cards">
          <div className="footer-cta">
            <div>
              <Link href={prefix || "/"} className="logo logo--footer" aria-label={BRAND.siteName}>
                <span className="logo__mark">
                  <LogoMarkFooter />
                </span>
                <span>SLIIQQUE</span>
              </Link>
            </div>
            <div>
              <p className="eyebrow">{t.footer.lettersTalk}</p>
              <h3 style={{ maxWidth: 313 }}>{t.footer.ctaHeading}</h3>
              <Link className="btn btn--copper btn--block" style={{ marginTop: 50 }} href={`${prefix}/contact`}>
                <span className="btn__roll">
                  <span>{t.footer.ctaButton}</span>
                  <span>{t.footer.ctaButton}</span>
                </span>
              </Link>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h5>{t.footer.pages}</h5>
              {PAGE_LINK_HREFS.map((rawHref) => {
                const href = `${prefix}${rawHref}`;
                return (
                  <Link key={rawHref} href={href} aria-current={isActive(pathname, href) ? "page" : undefined}>
                    {t.footer.linkLabels[PAGE_LINK_KEYS[rawHref]]}
                  </Link>
                );
              })}
            </div>
            <div className="footer-col">
              <h5>{t.footer.legal}</h5>
              <Link href={`${prefix}/privacy`} aria-current={isActive(pathname, `${prefix}/privacy`) ? "page" : undefined}>
                {t.footer.legalLabels.privacyPolicy}
              </Link>
              <Link href={`${prefix}/terms`} aria-current={isActive(pathname, `${prefix}/terms`) ? "page" : undefined}>
                {t.footer.legalLabels.termsOfUse}
              </Link>
              <Link
                href={`${prefix}/accessibility`}
                aria-current={isActive(pathname, `${prefix}/accessibility`) ? "page" : undefined}
              >
                {t.footer.legalLabels.accessibility}
              </Link>
            </div>
            <div className="footer-col">
              <h5>{t.footer.contact}</h5>
              <a href={`mailto:${BRAND.email}`} onClick={() => trackEvent("click_to_email", {})}>
                {BRAND.email}
              </a>
              <a href={BRAND.phoneHref} onClick={() => trackEvent("click_to_call", {})}>
                {BRAND.phone}
              </a>
              <p>{BRAND.hq}</p>
              <a href={BRAND.parentSiteUrl} rel="noopener">
                {BRAND.studioName} Studio ↗
              </a>
            </div>
          </div>
        </div>

        {/* Disclosure panel (spec §5.8/§8.9): concept notice, agent/brokerage/licence/regulator and
            REALTOR®/MLS® trademark wording. Lives in the global Footer, so it appears on every page.
            Grouped into labelled columns so a dense legal block stays scannable. */}
        <section className="legal-panel" aria-labelledby="legal-panel-title">
          <div className="legal-panel__head">
            <p className="eyebrow eyebrow--white50" id="legal-panel-title">
              Legal &amp; disclosures
            </p>
            <p className="legal-panel__status">
              <span className="legal-panel__dot" aria-hidden="true" />
              Demonstration site
            </p>
          </div>

          <div className="legal-panel__grid">
            <div className="legal-panel__col">
              <h6>About this site</h6>
              <p>{BRAND.conceptNotice}</p>
            </div>

            <div className="legal-panel__col">
              <h6>Agent &amp; brokerage</h6>
              <dl className="legal-panel__facts">
                <div>
                  <dt>Representative</dt>
                  <dd>
                    {BRAND.agent.name}, {BRAND.agent.title}
                  </dd>
                </div>
                <div>
                  <dt>Brokerage</dt>
                  <dd>{BRAND.agent.brokerage}</dd>
                </div>
                <div>
                  <dt>Licence</dt>
                  <dd>{BRAND.agent.licenceNumber}</dd>
                </div>
                <div>
                  <dt>Regulator</dt>
                  <dd>
                    <a href={BRAND.agent.regulatorUrl} rel="noopener noreferrer" target="_blank">
                      {BRAND.agent.regulatorName}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="legal-panel__col">
              <h6>Trademarks</h6>
              <p>{BRAND.trademarkNotice}</p>
            </div>
          </div>

          <div className="legal-panel__foot">
            <p>
              Sample properties shown are fictional and for demonstration only. © {new Date().getFullYear()}{" "}
              {BRAND.studioName}. All rights reserved.
            </p>
          </div>
        </section>

        <hr className="hairline-w" />
        <div className="footer-bottom">
          <p>
            {t.footer.designedBy}{" "}
            <a href={BRAND.parentSiteUrl} rel="noopener">
              {BRAND.studioName} Studio
            </a>
          </p>
          <div className="socials">
            <a href={BRAND.social.instagram} aria-label="Instagram">
              <svg viewBox="0 0 24 24">
                <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm5 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.2 6.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
              </svg>
            </a>
            <a href={BRAND.social.x} aria-label="X">
              <svg viewBox="0 0 24 24">
                <path d="M17.8 3h3l-6.6 7.5L22 21h-6.1l-4.8-6.3L5.6 21h-3l7-8L2 3h6.2l4.3 5.7zm-1 16.2h1.7L7.3 4.7H5.5z" />
              </svg>
            </a>
            <a href={BRAND.whatsappHref} aria-label="WhatsApp">
              <svg viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 6.9 12.1l-.3.5.6 2.3-2.4-.7-.5.3A8 8 0 1 1 12 4zm-3.1 3.9c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.1 1.8 2.9 4.5 4 2.2.9 2.7.7 3.1.7.6 0 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.4-.3-.1-1.9-.9-2.1-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.2-.6-.4-.5-.6-.5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
