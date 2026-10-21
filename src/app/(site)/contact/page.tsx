import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import ContactForm from "@/components/ContactForm";
import Accordion, { type AccordionItem } from "@/components/Accordion";
import { IconClock, IconLock, IconPin, IconWhatsApp } from "@/components/icons";
import { BRAND } from "@/data/brand";
import { getFaqs } from "@/lib/content/faqs";
import { getLocale } from "@/lib/i18n/getLocale";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Contact & WhatsApp";
const DESCRIPTION =
  "Reach the SLIIQQUE Toronto real estate concept on WhatsApp or by email and form, or ask about a remote buying consultation from Nigeria.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/contact"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/contact" }),
};

export default async function ContactPage() {
  const locale = await getLocale();
  const t = locale === "fr" ? fr : en;
  const faqs = await getFaqs();
  const CONTACT_FAQS: AccordionItem[] = faqs.slice(0, 4).map((f) => ({ q: f.question, a: f.answer }));

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="contact">
            <div>
              <Reveal as="p" className="eyebrow">
                {t.contact.eyebrow}
              </Reveal>
              <SplitHeading as="h1">
                {t.contact.headingMain} <em>{t.contact.headingEm}</em>
              </SplitHeading>
              <Reveal as="p" className="lead">
                {t.contact.leadTemplate.replace("{name}", BRAND.agent.name)}
              </Reveal>
              <Reveal as="div">
                {/* ContactForm itself stays English, not localized in this pass. */}
                <ContactForm />
              </Reveal>
            </div>
            <Reveal as="aside">
              <div className="agent-card">
                <span className="agent__av" style={{ background: "transparent" }}>
                  <Image src="/brand/sliiqque-icon-white.png" width={740} height={458} alt="" />
                </span>
                <h5>{BRAND.agent.name}</h5>
                <p className="role">
                  {BRAND.agent.title} · {BRAND.agent.brokerage}
                </p>
                <p className="q">&quot;WhatsApp or email; I reply the same way you reach out.&quot;</p>
                <p className="resp">{BRAND.hours}</p>
              </div>
              <div className="office-card">
                <p className="eyebrow">{t.contact.officeDetails}</p>
                <div className="office-row">
                  <span className="office-row__icon">
                    <IconPin />
                  </span>
                  <div>
                    <span className="eyebrow">{t.contact.officeLabel}</span>
                    <span className="v">{BRAND.officeAddress}</span>
                  </div>
                </div>
                <div className="office-row">
                  <span className="office-row__icon">
                    <IconClock />
                  </span>
                  <div>
                    <span className="eyebrow">{t.contact.hoursLabel}</span>
                    <span className="v">{BRAND.hours}</span>
                  </div>
                </div>
                <div className="office-row">
                  <span className="office-row__icon">
                    <IconWhatsApp />
                  </span>
                  <div>
                    <span className="eyebrow">{t.contact.whatsappLabel}</span>
                    <span className="v">
                      <a href={BRAND.whatsappHref}>{BRAND.whatsappNumber}</a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="privacy-note" style={{ marginTop: 20 }}>
                <IconLock />
                <p>
                  <strong>{t.contact.privacyStrong}</strong>
                  {t.contact.privacyText} <a href="/privacy">{t.contact.privacyLinkText}</a>.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="faq-split" style={{ marginTop: 100 }}>
            <div className="faq-split__left">
              <Reveal as="p" className="eyebrow">
                {t.contact.beforeEyebrow}
              </Reveal>
              <SplitHeading as="h2" className="h2s">
                {t.contact.quickAnswersHeading}
              </SplitHeading>
            </div>
            <Reveal as="div" className="acc">
              <Accordion items={CONTACT_FAQS} />
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
