import type { Metadata } from "next";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import { getNeighbourhoods } from "@/lib/content/neighbourhoods";
import JsonLd from "@/components/JsonLd";
import { itemListSchema, pageAlternates, pageSocial, SITE_URL } from "@/lib/seo";

const TITLE = "Toronto Neighbourhood Guides";
const DESCRIPTION =
  "Guides to six Toronto neighbourhoods, covering transit, schools and market context for Yorkville, Rosedale, Forest Hill, Leslieville, Liberty Village and The Beaches.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: pageAlternates("/neighbourhoods"),
  ...pageSocial({ title: TITLE, description: DESCRIPTION, path: "/neighbourhoods", ogImage: "neighbourhoods" }),
};

export default async function NeighborhoodsPage() {
  const neighbourhoods = await getNeighbourhoods();

  return (
    <main>
      <JsonLd
        data={[
          itemListSchema(
            "Toronto neighbourhood guides",
            neighbourhoods.map((n) => ({ name: n.name, url: `/neighbourhoods/${n.slug}` })),
            SITE_URL,
            "/neighbourhoods"
          ),
        ]}
      />
      <section className="page-hero page-hero--center">
        <div className="container">
          <div className="stack">
            <Reveal as="p" className="eyebrow">
              Toronto &amp; the GTA
            </Reveal>
            <SplitHeading as="h1">Neighbourhoods in the concept portfolio.</SplitHeading>
            <Reveal as="p" className="lead" style={{ maxWidth: 560 }}>
              Commute times, schools, and what each street actually feels like.
            </Reveal>
          </div>
          <div className="hood-grid hood-grid--flat">
            {neighbourhoods.map((n) => (
              <Link key={n.slug} href={`/neighbourhoods/${n.slug}`} className="card-img hood-grid--flat__card">
                <ImageWithSkeleton
                  className="bg"
                  src={n.heroImg}
                  alt=""
                  fill
                  sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 33vw"
                />
                <div className="card-img__inner" style={{ justifyContent: "flex-end" }}>
                  <p className="card-img__loc">{n.region}</p>
                  <h4 className="card-img__title">{n.name}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
