"use client";

/**
 * Lead-source capture (spec §5.2: "store page, referrer and UTM parameters with each lead").
 * Captured once per browser session on first landing (so a later page visit before the form
 * submit doesn't overwrite the original referrer/campaign) and read back when any form submits.
 */
const STORAGE_KEY = "sliiqque-re-attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

export type Attribution = {
  landingPage: string;
  referrer: string;
  utm: Partial<Record<(typeof UTM_KEYS)[number], string>>;
};

export function captureAttributionOnce(): void {
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const utm: Attribution["utm"] = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) utm[key] = value;
    }

    const attribution: Attribution = {
      landingPage: window.location.pathname,
      referrer: document.referrer || "direct",
      utm,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // sessionStorage unavailable (private mode, etc.): attribution is best-effort, not required.
  }
}

export function getAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Attribution;
  } catch {
    // fall through to the default below
  }
  return { landingPage: typeof window !== "undefined" ? window.location.pathname : "", referrer: "direct", utm: {} };
}
