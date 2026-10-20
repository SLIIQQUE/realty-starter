import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import CompareTable from "./CompareTable";
import { MAX_COMPARE } from "@/components/CompareContext";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Compare Properties";
const DESCRIPTION = "Compare up to three saved properties side by side.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/compare"),
  robots: { index: false, follow: true },
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/compare" }),
};

export default function ComparePage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="stack">
            <Reveal as="p" className="eyebrow">
              Side by side
            </Reveal>
            <SplitHeading as="h1">Compare properties.</SplitHeading>
            <Reveal as="p" className="lead" style={{ maxWidth: 560 }}>
              Compare up to {MAX_COMPARE} properties at a time. Your selection is saved in this browser.
            </Reveal>
          </div>
          <div style={{ marginTop: 60 }}>
            <CompareTable />
          </div>
        </div>
      </section>
    </main>
  );
}
