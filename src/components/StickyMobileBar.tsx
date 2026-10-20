"use client";

import { BRAND } from "@/data/brand";
import { trackEvent } from "@/lib/analytics";
import { IconPhone, IconMessage, IconMail } from "./icons";

/**
 * Fixed-bottom Call / Text / Email bar for phones (spec §4.1). Hidden above the project's
 * 809px mobile breakpoint via CSS only (src/styles/components.css), not JS, so there's no
 * layout flash. Sits below CompareBar (components.css nudges .compare-bar up on mobile so the
 * two never overlap).
 */
export default function StickyMobileBar() {
  return (
    <nav className="sticky-mobile-bar" aria-label="Quick contact">
      <div className="sticky-mobile-bar__inner">
        <a className="sticky-mobile-bar__link" href={BRAND.phoneHref} onClick={() => trackEvent("click_to_call", {})}>
          <IconPhone />
          Call
        </a>
        <a className="sticky-mobile-bar__link" href={BRAND.smsHref} onClick={() => trackEvent("click_to_text", {})}>
          <IconMessage />
          Text
        </a>
        <a
          className="sticky-mobile-bar__link"
          href={`mailto:${BRAND.email}`}
          onClick={() => trackEvent("click_to_email", {})}
        >
          <IconMail />
          Email
        </a>
      </div>
    </nav>
  );
}
