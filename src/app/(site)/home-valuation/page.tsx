import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import ValuationForm from "@/components/ValuationForm";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Toronto Home Valuation";
const DESCRIPTION =
  "Request a considered home valuation for a Toronto or GTA property, reviewed against local comparables by a person rather than a model.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/home-valuation"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/home-valuation", ogImage: "valuation" }),
};

export default function ValuationPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="contact">
            <div>
              <Reveal as="p" className="eyebrow">
                Home valuation
              </Reveal>
              <SplitHeading as="h1">
                What could your home be <em>worth?</em>
              </SplitHeading>
              <Reveal as="p" className="lead">
                Share a few details and the request goes to a person, not an automated pricing model; honest
                valuations take local comps and context a formula can&apos;t see.
              </Reveal>
              <Reveal as="div">
                <ValuationForm />
              </Reveal>
            </div>
            <Reveal as="aside">
              <div className="side-card side-card--sand">
                <p className="eyebrow">Why not an instant number?</p>
                <p className="t-sm" style={{ color: "var(--c-muted)", marginTop: 16 }}>
                  Automated valuation models can be off by a wide margin on unique or high-value homes. This concept
                  intentionally routes requests to a human review step instead of pretending to give you one.
                </p>
              </div>
              <div className="side-card" style={{ marginTop: 20 }}>
                <p className="eyebrow">What happens next</p>
                <p className="t-sm muted" style={{ marginTop: 16 }}>
                  The SLIIQQUE team reviews your submission and replies by email. On a real deployment, this is where
                  comparable sales, local market data, and an agent walkthrough would come in.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
