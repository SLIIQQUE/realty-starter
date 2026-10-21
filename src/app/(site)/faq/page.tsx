import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import Accordion from "@/components/Accordion";
import JsonLd from "@/components/JsonLd";
import { getFaqs } from "@/lib/content/faqs";
import { faqSchema, pageAlternates, pageSocial } from "@/lib/seo";
import { BRAND } from "@/data/brand";
import { getLocale } from "@/lib/i18n/getLocale";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";

const TITLE = "Toronto Real Estate FAQs";
const DESCRIPTION =
  "Answers on buying and selling in Toronto, buying remotely from Nigeria, costs, timelines, and what this concept site is.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/faq"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/faq" }),
};

export default async function FaqsPage() {
  const locale = await getLocale();
  const t = locale === "fr" ? fr : en;
  const faqs = await getFaqs();
  const ITEMS = faqs.map((f) => ({ q: f.question, a: f.answer }));

  return (
    <main>
      <JsonLd data={[faqSchema(ITEMS)]} />
      <section className="page-hero page-hero--center">
        <div className="container">
          <div className="stack">
            <Reveal as="p" className="eyebrow">
              {t.faq.eyebrow}
            </Reveal>
            <SplitHeading as="h2" className="h2" style={{ maxWidth: 560, marginTop: 10 }}>
              <em>{t.faq.headingEm}</em> {t.faq.headingSuffix}
            </SplitHeading>
            <Reveal as="p" className="lead" style={{ maxWidth: 420, fontSize: 14, lineHeight: "18.2px" }}>
              {t.faq.lead}
            </Reveal>
          </div>
          {locale === "fr" && <p className="locale-notice">{t.legal.notTranslatedNotice}</p>}
          <Reveal as="div" className="faq-page acc" style={{ textAlign: "left" }}>
            <Accordion items={ITEMS} />
          </Reveal>
          <Reveal as="div" className="faq-cta" style={{ textAlign: "left" }}>
            <div>
              <p className="eyebrow eyebrow--white">Still curious</p>
              <h2 className="h2s">
                Still have <span>questions?</span>
              </h2>
              <p>If your question isn&apos;t here, reach out directly; the SLIIQQUE team replies within 24 hours.</p>
            </div>
            <div className="faq-cta__right">
              <p className="t-sm">{BRAND.email}</p>
              <p className="t-sm">WhatsApp</p>
              <p className="ph">
                <a href={BRAND.whatsappHref}>{BRAND.whatsappNumber}</a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
