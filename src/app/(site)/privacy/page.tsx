import type { Metadata } from "next";
import SplitHeading from "@/components/SplitHeading";
import { BRAND } from "@/data/brand";
import { getLocale } from "@/lib/i18n/getLocale";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Privacy Policy";
const DESCRIPTION = `How ${BRAND.siteName} handles personal data submitted through this concept site, in line with Canadian privacy law (PIPEDA).`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/privacy", { languages: true }),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/privacy" }),
};

export default async function PrivacyPolicyPage() {
  const locale = await getLocale();
  const t = locale === "fr" ? fr : en;

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <article className="legal">
            <SplitHeading as="h1">
              {t.legal.privacyTitleMain} <em>{t.legal.privacyTitleEm}</em>
            </SplitHeading>
            {locale === "fr" && <p className="locale-notice">{t.legal.notTranslatedNotice}</p>}
            <p style={{ textAlign: "center" }}>
              <strong>Status:</strong> v0.1 draft, written to reflect the Personal Information Protection and
              Electronic Documents Act (PIPEDA) and, for Quebec residents, Quebec&apos;s Act respecting the
              protection of personal information in the private sector (Law 25). Review with qualified Canadian
              counsel before relying on it for a live client deployment.
            </p>
            <p>
              This is a concept marketing site built by {BRAND.studioName} Studio ({BRAND.hq}) to
              demonstrate a Canadian real-estate website template. This policy explains how personal data
              submitted through this site&apos;s contact, valuation, viewing-request, and newsletter forms is
              handled. See the footer and the {" "}<a href="/about">About</a> page for the demo agent/brokerage
              framing. No real client data is collected by a real brokerage here.
            </p>

            <h3>1. Who is responsible</h3>
            <p>
              {BRAND.studioName} Studio, {BRAND.hq}, is responsible for the personal data described here. Our
              privacy contact is {BRAND.founder}: {BRAND.email}.
            </p>

            <h3>2. Data we collect</h3>
            <ul>
              <li>Contact form data: name, email, phone (optional), what you&apos;re looking to do, and your message.</li>
              <li>Home valuation and viewing-request data: a property address, property details, preferred dates, and your contact information.</li>
              <li>Newsletter data: your email address and listing-alert criteria, with your express opt-in consent.</li>
              <li>Consent records: a timestamp and the exact consent text you agreed to when submitting a form.</li>
              <li>Lead source data: the page you submitted from, referring site, and any campaign (UTM) parameters.</li>
              <li>Saved favorites and comparisons: stored only in your browser&apos;s local storage, never sent to us.</li>
              <li>Technical data: basic device and browser information if analytics are enabled on a given deployment, and only after you accept the cookie notice.</li>
            </ul>

            <h3>3. How we use it</h3>
            <p>
              Submitted forms are delivered by email through Resend, an email delivery provider, so the agent can
              respond to your enquiry, and are recorded with their consent text and source so we can demonstrate
              the lead-tracking features of this template. Newsletter addresses are used only to send the double
              opt-in confirmation and the updates you signed up for, and every email includes an unsubscribe link
              as required by Canada&apos;s Anti-Spam Legislation (CASL). We do not sell personal data.
            </p>

            <h3>4. Who we share it with</h3>
            <p>
              Only providers that help run this site: hosting, Resend for email delivery, and (only where a
              deployment has configured one) a CRM webhook the client has authorized. We may disclose data where
              the law requires it.
            </p>

            <h3>5. How long we keep it</h3>
            <p>Enquiry and valuation request data: up to 2 years after our last contact. Newsletter addresses: until you unsubscribe.</p>

            <h3>6. Your rights</h3>
            <p>
              Under PIPEDA (and Law 25 for Quebec residents) you can ask to access, correct, or delete your data,
              or withdraw consent at any time, by contacting {BRAND.email}.
            </p>

            <h3>7. Cookies</h3>
            <p>
              This site shows a cookie notice before loading any non-essential cookie (including analytics) and
              records your consent choice. It stores no third-party advertising trackers.
            </p>

            <h3>8. Contact</h3>
            <p>
              {BRAND.studioName} Studio · Attn: {BRAND.founder} · {BRAND.hq} · {BRAND.email} · {BRAND.phone}.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
