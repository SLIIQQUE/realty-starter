import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { BRAND } from "@/data/brand";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Press & Media";
const DESCRIPTION =
  "SLIIQQUE Studio facts, brand background and logo assets for press and partner use.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/press"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/press" }),
};

export default function PressPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <article className="legal">
            <SplitHeading as="h1">Press &amp; Media</SplitHeading>
            <p style={{ textAlign: "center" }}>
              This concept site is built by {BRAND.studioName} Studio. The facts below are about the studio, not
              about this demo&apos;s fictional real-estate content.
            </p>

            <h3>Studio facts</h3>
            <ul>
              <li>Name: {BRAND.studioName}</li>
              <li>Founded: {BRAND.founded}, {BRAND.hq}</li>
              <li>Founder: {BRAND.founder}</li>
              <li>
                What the studio does: creative production, product &amp; engineering, under one brand, see{" "}
                <a href={BRAND.parentSiteUrl}>{BRAND.parentSiteUrl.replace("https://", "")}</a>
              </li>
            </ul>

            <h3>Logo assets</h3>
            <p>For press and partner use. Please don&apos;t alter the mark&apos;s proportions or colors.</p>
            <div style={{ display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap", marginTop: 20 }}>
              <div style={{ background: "#fff", borderRadius: 16, padding: 24 }}>
                <Image src="/brand/sliiqque-mark.png" width={120} height={75} alt="SLIIQQUE mark, black" />
              </div>
              <div style={{ background: "var(--c-surface-raised)", borderRadius: 16, padding: 24 }}>
                <Image src="/brand/sliiqque-icon-white.png" width={120} height={75} alt="SLIIQQUE mark, white" />
              </div>
            </div>

            <h3>Contact</h3>
            <p>
              Press inquiries: <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
