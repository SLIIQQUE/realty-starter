import type { Metadata } from "next";
import SplitHeading from "@/components/SplitHeading";
import MortgageCalculator from "@/components/MortgageCalculator";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Mortgage Calculator";
const DESCRIPTION = "Estimate your Canadian mortgage payment, with semi-annual compounding, bi-weekly options, and CMHC default insurance.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/tools/mortgage-calculator"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/tools/mortgage-calculator" }),
};

export default function MortgageCalculatorPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <article className="legal">
            <SplitHeading as="h1">
              Mortgage <em>calculator</em>
            </SplitHeading>
            <p style={{ textAlign: "center" }}>
              Built around Canadian mortgage rules: semi-annual compounding on fixed rates, monthly, bi-weekly,
              and accelerated bi-weekly payment options, and an estimate of CMHC mortgage default insurance when
              your down payment is under 20%.
            </p>
          </article>
          <div style={{ maxWidth: 900, margin: "40px auto 0" }}>
            <MortgageCalculator />
          </div>
        </div>
      </section>
    </main>
  );
}
