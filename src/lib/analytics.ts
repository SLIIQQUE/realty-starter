"use client";

/**
 * Conversion-event helper (spec §5.6: form submit, WhatsApp click, email click, valuation
 * start/finish, viewing request). No-ops when GA4 isn't loaded (no NEXT_PUBLIC_GA_ID, or the
 * visitor hasn't accepted the cookie notice yet) so this is always safe to call.
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
