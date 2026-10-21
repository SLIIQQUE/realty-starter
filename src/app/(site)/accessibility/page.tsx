import type { Metadata } from "next";
import SplitHeading from "@/components/SplitHeading";
import { BRAND } from "@/data/brand";
import { getLocale } from "@/lib/i18n/getLocale";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Accessibility Statement";
const DESCRIPTION =
  "SLIIQQUE's commitment to an accessible Toronto real estate site, and how to report an accessibility issue.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/accessibility"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/accessibility" }),
};

export default async function AccessibilityPage() {
  const locale = await getLocale();
  const t = locale === "fr" ? fr : en;

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <article className="legal">
            <SplitHeading as="h1">
              {t.legal.accessibilityTitleMain} <em>{t.legal.accessibilityTitleEm}</em>
            </SplitHeading>
            {locale === "fr" && <p className="locale-notice">{t.legal.notTranslatedNotice}</p>}
            <p style={{ textAlign: "center" }}>
              <strong>Status:</strong> v0.1 draft, targeting WCAG 2.1 Level AA. Review with an accessibility
              specialist before relying on it for a live client deployment.
            </p>
            <p>
              {BRAND.studioName} Studio wants this site to be usable by everyone, including people who use a
              keyboard, a screen reader, voice control, or who need reduced motion or higher contrast. This
              statement describes what we&apos;ve built in and how to tell us if something doesn&apos;t work for
              you.
            </p>

            <h3>1. What we&apos;ve built in</h3>
            <ul>
              <li>A &quot;skip to content&quot; link at the top of every page for keyboard users.</li>
              <li>Visible focus states on every interactive element: links, buttons, form fields, and menu toggles.</li>
              <li>Labelled form fields with clear error messages, not colour alone.</li>
              <li>Descriptive alt text on meaningful images; decorative images are hidden from screen readers.</li>
              <li>Colour contrast checked against WCAG 2.1 AA for body text and interactive elements.</li>
              <li>Respect for your operating system&apos;s reduced-motion preference: animations are minimized or removed when you&apos;ve asked for that.</li>
              <li>A logical heading order and one H1 per page, so screen-reader users can navigate by heading.</li>
            </ul>

            <h3>2. Known limitations</h3>
            <p>
              This is a concept/demo build. Some third-party embeds (the map view, for example) may not fully
              match our own accessibility standard. We test with a screen reader on the home page and at least one
              form, but have not completed a full third-party audit of every page.
            </p>

            <h3>3. Tell us about a problem</h3>
            <p>
              If you find a page or feature on this site that&apos;s difficult to use with assistive technology,
              please contact us at {BRAND.email} or {BRAND.phone}, and describe the page and the issue you ran
              into. We aim to acknowledge accessibility reports within two business days.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
