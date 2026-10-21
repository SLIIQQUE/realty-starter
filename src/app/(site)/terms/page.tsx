import type { Metadata } from "next";
import SplitHeading from "@/components/SplitHeading";
import { BRAND } from "@/data/brand";
import { getLocale } from "@/lib/i18n/getLocale";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Terms of Use";
const DESCRIPTION =
  "Terms for using this Toronto real estate concept site, including the REALTOR® and MLS® trademark notice.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/terms"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/terms" }),
};

export default async function TermsConditionsPage() {
  const locale = await getLocale();
  const t = locale === "fr" ? fr : en;

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <article className="legal">
            <SplitHeading as="h1">
              {t.legal.termsTitleMain} <em>{t.legal.termsTitleEm}</em>
            </SplitHeading>
            {locale === "fr" && <p className="locale-notice">{t.legal.notTranslatedNotice}</p>}
            <p style={{ textAlign: "center" }}>
              <strong>Status:</strong> v0.1 draft. Review with qualified Canadian counsel and the brokerage of
              record before relying on it for a live client deployment.
            </p>

            <h3>1. What this site is</h3>
            <p>
              This is a concept marketing site built by {BRAND.studioName} Studio ({BRAND.hq}) to
              demonstrate a Canadian real-estate website template. {BRAND.studioName} does not hold a real-estate
              licence, is not a brokerage, and the agent, brokerage name, licence number, and properties shown are
              fictional sample content, not a real registrant, real inventory, or active offers for sale.
            </p>

            <h3>2. No real-estate, financial, tax or legal advice</h3>
            <p>
              Nothing on this site constitutes real-estate, financial, tax, or legal advice. The mortgage and land
              transfer tax calculators provide estimates only, carry an &quot;estimate only&quot; disclaimer on the
              page, and are not a loan offer, rate quote, or binding tax calculation. Confirm figures with a
              lender, lawyer, or the relevant provincial ministry. The home valuation flow is a lead-capture form
              reviewed by a person, not an automated appraisal or a binding opinion of value.
            </p>

            <h3>3. Trademark notice (REALTOR®/MLS®)</h3>
            <p>{BRAND.trademarkNotice}</p>

            <h3>4. Brokerage disclosure</h3>
            <p>
              On a real deployment of this template, the agent operates under {BRAND.agent.brokerage}, licensed by{" "}
              {BRAND.agent.regulatorName}, licence {BRAND.agent.licenceNumber}. The brokerage of record must review
              and approve this site and its advertising wording before launch.
            </p>

            <h3>5. Using this site</h3>
            <p>
              You may browse this site and submit forms for the purposes described on each page. Favorites and
              comparisons are stored only in your own browser.
            </p>

            <h3>6. Intellectual property</h3>
            <p>
              The {BRAND.studioName} name, logo, and brand assets belong to {BRAND.studioName}. Sample property
              photography is used under the Framer template licence it was originally sourced from and is not{" "}
              {BRAND.studioName}&apos;s own photography.
            </p>

            <h3>7. Limitation of liability</h3>
            <p>
              This site is provided as a concept demonstration, without warranties of any kind, to the extent
              permitted by law.
            </p>

            <h3>8. Contact</h3>
            <p>
              {BRAND.studioName} Studio · {BRAND.hq} · {BRAND.email} · {BRAND.phone}.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
