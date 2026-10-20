import type { Metadata } from "next";
import { Suspense } from "react";
import SplitHeading from "@/components/SplitHeading";
import ViewingRequestForm from "@/components/ViewingRequestForm";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Book a Viewing";
const DESCRIPTION = "Request a private viewing for any listing, or a general consultation with SLIIQQUE.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/book-a-viewing"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/book-a-viewing" }),
};

export default function BookAViewingPage() {
  return (
    <main>
      <section className="page-hero page-hero--center">
        <div className="container">
          <div className="stack">
            <p className="eyebrow">Book a viewing</p>
            <SplitHeading as="h1">
              See it in <em>person.</em>
            </SplitHeading>
            <p className="lead">
              Tell us a few preferred times and how many people are coming, and we&apos;ll confirm a viewing that
              works for you.
            </p>
          </div>
          <div style={{ marginTop: 50, maxWidth: 700, marginLeft: "auto", marginRight: "auto", textAlign: "left" }}>
            <Suspense fallback={null}>
              <ViewingRequestForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
