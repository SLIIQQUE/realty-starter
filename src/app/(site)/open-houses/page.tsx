import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import PropertyStackCard from "@/components/PropertyStackCard";
import { getListings } from "@/lib/content/listings";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Open Houses";
const DESCRIPTION = "Sample properties with a scheduled open house.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/open-houses"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/open-houses" }),
};

export default async function OpenHousesPage() {
  const properties = await getListings();
  const withOpenHouses = properties.filter((p) => p.openHouses.length > 0);

  return (
    <main>
      <section className="page-hero page-hero--center">
        <div className="container">
          <div className="stack">
            <Reveal as="p" className="eyebrow">
              This week
            </Reveal>
            <SplitHeading as="h1">Upcoming open houses.</SplitHeading>
            <Reveal as="p" className="lead" style={{ maxWidth: 520 }}>
              Sample open house times for the concept portfolio: no RSVP needed, this is demonstration content.
            </Reveal>
          </div>
          {withOpenHouses.length === 0 ? (
            <p className="muted" style={{ marginTop: 60 }}>
              No open houses scheduled right now.
            </p>
          ) : (
            <div className="prop-grid" style={{ marginTop: 60 }}>
              {withOpenHouses.map((p) => (
                <div key={p.slug}>
                  <PropertyStackCard property={p} />
                  <p className="t-sm" style={{ marginTop: 12, color: "var(--c-accent)" }}>
                    {p.openHouses.map((oh) => `${oh.date} · ${oh.time}`).join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
