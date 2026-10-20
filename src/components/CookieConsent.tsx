"use client";

import { useEffect, useState } from "react";

export const COOKIE_CONSENT_KEY = "sliiqque-re-cookie-consent";
export const COOKIE_CONSENT_EVENT = "sliiqque-re-cookie-consent-changed";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_CONSENT_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable (private mode, etc.): skip the banner rather than block rendering.
    }
  }, []);

  function dismiss(choice: "accepted" | "declined") {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    } catch {
      // ignore
    }
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      style={{
        position: "fixed",
        left: 20,
        right: 20,
        bottom: 20,
        zIndex: 50,
        maxWidth: 560,
        margin: "0 auto",
        background: "var(--c-surface-raised)",
        color: "var(--c-white)",
        borderRadius: "var(--r-card)",
        padding: 24,
        boxShadow: "0 20px 50px rgba(0,0,0,.4)",
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p className="t-sm" style={{ color: "var(--c-white-70)", flex: "1 1 280px" }}>
        This site uses essential cookies and, if you contact us, stores what you submit so we can respond. No
        third-party ad trackers.
      </p>
      <div style={{ display: "flex", gap: 10, flex: "0 0 auto" }}>
        <button className="btn btn--ghost-light" onClick={() => dismiss("declined")}>
          Decline
        </button>
        <button className="btn btn--forest" onClick={() => dismiss("accepted")}>
          Accept
        </button>
      </div>
    </div>
  );
}
