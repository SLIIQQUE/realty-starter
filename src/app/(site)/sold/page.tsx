import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";
import { getSoldProperties } from "@/lib/content/soldProperties";
import { resolveImageSrc } from "@/lib/content/image";
import { pageAlternates, pageSocial } from "@/lib/seo";

const TITLE = "Recent Sales";
const DESCRIPTION = "Recent sample sales from the Toronto and GTA concept portfolio, shown here as social proof.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/sold"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/sold" }),
};

export default async function SoldPage() {
  const soldProperties = await getSoldProperties();

  return (
    <main>
      <section className="page-hero page-hero--center">
        <div className="container">
          <div className="stack">
            <Reveal as="p" className="eyebrow">
              Sold listings
            </Reveal>
            <SplitHeading as="h1">Recent sales, straight numbers.</SplitHeading>
            <Reveal as="p" className="lead" style={{ maxWidth: 620 }}>
              A sample of recent sales from the concept portfolio: social proof for how Priya and the SLIIQQUE
              team work, built entirely from fictional demo data.
            </Reveal>
          </div>

          <Reveal as="div" className="sold-list" style={{ marginTop: 60, textAlign: "left" }}>
            {soldProperties.map((p) => (
              <div className="sold-row" key={`${p.addressArea}-${p.saleMonth}`}>
                <div className="sold-row__thumb">
                  <Image src={resolveImageSrc(p.photo)} alt="" width={100} height={100} />
                </div>
                <div className="sold-row__name">
                  <h4>{p.addressArea}</h4>
                  <p className="eyebrow">{p.propertyType}</p>
                </div>
                <p className="sold-row__price">{p.soldPrice}</p>
                <p className="sold-row__desc">
                  {p.note} Sold {p.saleMonth}.
                </p>
                <span className="tag">Sold</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <div className="row">
            <div>
              <p className="eyebrow eyebrow--white50">Thinking of selling</p>
              <SplitHeading as="h2" className="h2s">
                Get a <em>home valuation</em> from Priya.
              </SplitHeading>
              <p>
                No automated instant number, just a human review of comparable sales in your neighbourhood.
              </p>
            </div>
            <RollButton href="/home-valuation" variant="ghost-light">
              Request a valuation
            </RollButton>
          </div>
        </div>
      </section>
    </main>
  );
}
