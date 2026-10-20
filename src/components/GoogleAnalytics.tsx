"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY } from "./CookieConsent";

/**
 * Loads GA4 only when NEXT_PUBLIC_GA_ID is set AND the visitor has accepted the cookie notice
 * (spec §5.6: "Consent handling ... analytics consent respected"), so a deployment without
 * analytics configured loads zero third-party scripts, and one with it configured still doesn't
 * load the tag before consent is given.
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    function check() {
      try {
        setConsented(localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted");
      } catch {
        setConsented(false);
      }
    }
    check();
    window.addEventListener(COOKIE_CONSENT_EVENT, check);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, check);
  }, []);

  if (!gaId || !consented) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
