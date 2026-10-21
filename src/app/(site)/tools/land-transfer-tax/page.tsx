import type { Metadata } from "next";
import SplitHeading from "@/components/SplitHeading";
import LandTransferTaxCalculator from "@/components/LandTransferTaxCalculator";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Ontario & Toronto Land Transfer Tax";
const DESCRIPTION =
  "Estimate Ontario, Toronto and BC land transfer tax on a purchase price, including first-time buyer rebates and the municipal levy.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/tools/land-transfer-tax"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/tools/land-transfer-tax", ogImage: "tools" }),
};

export default function LandTransferTaxCalculatorPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <article className="legal">
            <SplitHeading as="h1">
              Land transfer tax <em>calculator</em>
            </SplitHeading>
            <p style={{ textAlign: "center" }}>
              Estimate the provincial and (where applicable) municipal land transfer tax on a purchase, using the
              real marginal bracket structure for Ontario, Toronto, and British Columbia, plus any first-time
              buyer rebate you may qualify for.
            </p>
          </article>
          <div style={{ maxWidth: 900, margin: "40px auto 0" }}>
            <LandTransferTaxCalculator />
          </div>
        </div>
      </section>
    </main>
  );
}
