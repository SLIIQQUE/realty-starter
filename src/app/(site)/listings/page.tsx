import type { Metadata } from "next";
import { Suspense } from "react";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";
import PropertiesExplorer from "@/components/PropertiesExplorer";
import { getListings } from "@/lib/content/listings";
import { getNeighbourhoods } from "@/lib/content/neighbourhoods";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Listings";
const DESCRIPTION = "Search, filter, and map sample Toronto and GTA concept listings.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/listings"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/listings" }),
};

export default async function PropertiesPage() {
  const [properties, neighbourhoods] = await Promise.all([getListings(), getNeighbourhoods()]);

  return (
    <main>
      <section className="page-hero page-hero--center page-hero--listing">
        <div className="container">
          <div className="stack">
            <Reveal as="p" className="eyebrow">
              Toronto &amp; GTA Concept Portfolio · $1.8M–$6.5M CAD
            </Reveal>
            <SplitHeading as="h1">Search the concept portfolio.</SplitHeading>
            <Reveal as="p" className="lead" style={{ maxWidth: 800 }}>
              Filter by status, neighbourhood, property type, price, beds, and baths, switch between a grid and a
              map, and save or compare properties as you go. Everything below is sample content built to
              demonstrate the experience.
            </Reveal>
          </div>

          <Suspense fallback={<p className="muted" style={{ marginTop: 60 }}>Loading listings…</p>}>
            <PropertiesExplorer properties={properties} neighbourhoods={neighbourhoods} />
          </Suspense>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <div className="row">
            <div>
              <p className="eyebrow eyebrow--white50">Want this for a real business</p>
              <SplitHeading as="h2" className="h2s">
                SLIIQQUE builds sites like this for <em>real brokerages and agents.</em>
              </SplitHeading>
              <p>
                This search, filtering, map view, favorites, and comparison tooling can be built around your real
                listings and brand. Reach out to talk through what that would look like.
              </p>
            </div>
            <RollButton href="/contact" variant="ghost-light">
              Talk to SLIIQQUE
            </RollButton>
          </div>
        </div>
      </section>
    </main>
  );
}
