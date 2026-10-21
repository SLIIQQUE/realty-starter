import type { Metadata } from "next";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import SplitHeading from "@/components/SplitHeading";
import RollButton from "@/components/RollButton";
import FavoriteToggle from "@/components/FavoriteToggle";
import CompareToggle from "@/components/CompareToggle";
import MortgageCalculator from "@/components/MortgageCalculator";
import ListingEnquiryForm from "@/components/ListingEnquiryForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { realEstateListingSchema, pageAlternates, pageSocial, SITE_URL } from "@/lib/seo";
import { resolveImageSrc } from "@/lib/content/image";
import { fmtBath } from "@/data/properties";
import { getListings, getListingBySlug, type Listing } from "@/lib/content/listings";
import { IconArea, IconBath, IconBed, IconLock, IconPin, IconPool } from "@/components/icons";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const properties = await getListings();
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getListingBySlug(slug);
  if (!property) return {};
  const title = `${property.name}, ${property.loc}`;
  const description = `${property.name} in ${property.loc}: ${property.bed} bed, ${property.bath} bath, ${property.sqft} sq ft, listed at ${property.price} (${property.status}). Photos, features and viewing details for this sample Toronto listing.`;
  return {
    title,
    description,
    alternates: pageAlternates(`/listings/${property.slug}`),
    ...pageSocial({
      title,
      description,
      path: `/listings/${property.slug}`,
      image: property.img ? `${SITE_URL}${resolveImageSrc(property.img)}` : undefined,
      imageAlt: `${property.name}, ${property.loc}, Toronto`,
    }),
  };
}

function getRecents(property: Listing, allProperties: Listing[]): Listing[] {
  const pool = property.sold
    ? allProperties.filter((q) => !q.sold && q.slug !== property.slug)
    : allProperties.filter((q) => q.slug !== property.slug);
  return pool.slice(0, 2);
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [property, allProperties] = await Promise.all([getListingBySlug(slug), getListings()]);
  if (!property) notFound();

  const recents = getRecents(property, allProperties);
  const priceLabel = property.sold ? "Sold price" : "Asking price";
  const kv: [string, string][] = [
    ["Price", property.price],
    ["Status", property.status],
    ["Property type", property.ptype],
    ["Year built", property.year],
    ["Lot size", property.lot],
    ["Parking", property.park],
  ];

  return (
    <main>
      {/* Breadcrumbs below also emits its own BreadcrumbList JSON-LD via breadcrumbSchema(); this
          JsonLd call only adds the Product/Offer listing markup so we don't duplicate the trail. */}
      <JsonLd data={[realEstateListingSchema(property, SITE_URL)]} />
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs
            siteUrl={SITE_URL}
            items={[
              { name: "Home", href: "/" },
              { name: "Listings", href: "/listings" },
              { name: property.name, href: `/listings/${property.slug}` },
            ]}
          />
          <Reveal as="div" className="pd-gallery" style={{ marginTop: 20 }}>
            <div className="card-img">
              <ImageWithSkeleton
                className="bg"
                src={property.img}
                alt={property.name}
                fill
                priority
                sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 59vw"
              />
              <span className="pill pill--ink status">{property.status}</span>
              <button className="all-photos">All photos</button>
              <FavoriteToggle slug={property.slug} label={property.name} />
              <CompareToggle slug={property.slug} />
            </div>
            <div className="card-img">
              <ImageWithSkeleton
                className="bg"
                src={property.img2}
                alt=""
                fill
                sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 35vw"
              />
            </div>
          </Reveal>

          <div className="pd-head">
            <div>
              <p className="eyebrow">{property.loc}</p>
              <SplitHeading as="h1">{property.name}</SplitHeading>
              <ul className="pd-facts">
                <li>
                  <IconBed />
                  <b style={{ fontWeight: 500 }}>{property.bed}</b> <span className="muted">Bedrooms</span>
                </li>
                <li>
                  <IconBath />
                  <b style={{ fontWeight: 500 }}>{fmtBath(property.bath)}</b> <span className="muted">Bathrooms</span>
                </li>
                <li>
                  <IconArea />
                  <b style={{ fontWeight: 500 }}>{property.sqft}</b> <span className="muted">Sq Ft</span>
                </li>
                <li>
                  <IconPool />
                  <span className="muted">{property.feat}</span>
                </li>
              </ul>
            </div>
            <div className="pd-price">
              <p className="eyebrow eyebrow--muted">{priceLabel}</p>
              <p className="h2s">{property.price}</p>
              {property.sold ? (
                <p className="t-md muted" style={{ marginTop: 10 }}>
                  Sold
                </p>
              ) : (
                <div className="actions">
                  <RollButton href="#enquiry" variant="ghost">
                    Ask a question
                  </RollButton>
                  <RollButton href={`/book-a-viewing?listing=${property.slug}`} variant="forest">
                    Request viewing
                  </RollButton>
                </div>
              )}
            </div>
          </div>

          <hr className="pd-rule" />

          <div className="pd-body">
            <div className="pd-main">
              <div>
                <h3>About this property</h3>
                {property.about.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
              <div>
                <p className="eyebrow">Property features</p>
                <ul className="features">
                  {property.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow" style={{ marginBottom: 30 }}>
                  The neighbourhood
                </p>
                <div className="hood-card">
                  <div className="hood-card__head">
                    <span className="hood-card__icon">
                      <IconPin />
                    </span>
                    <div>
                      <h4>{property.hood.name}</h4>
                      <p className="t-sm" style={{ color: "var(--c-white-50)" }}>
                        {property.hood.region}
                      </p>
                    </div>
                  </div>
                  <p>{property.hood.blurb}</p>
                  <div className="hood-card__stats">
                    {property.hood.stats.map(([stat, label]) => (
                      <div key={label}>
                        <strong>{stat}</strong>
                        <span className="eyebrow eyebrow--white50">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <p className="eyebrow" style={{ marginBottom: 30 }}>
                  Gallery
                </p>
                <div className="thumbs">
                  {property.thumbs.map((thumb) => (
                    <div className="img" key={thumb}>
                      <ImageWithSkeleton src={thumb} alt="" fill sizes="(max-width: 809px) 100vw, 233px" />
                    </div>
                  ))}
                </div>
              </div>
              {!property.sold && (
                <div>
                  <p className="eyebrow" style={{ marginBottom: 30 }}>
                    Estimate your payment
                  </p>
                  <MortgageCalculator initialPrice={property.price} />
                </div>
              )}
            </div>
            <aside className="pd-side">
              <div className="side-card" id="enquiry">
                <p className="eyebrow">{property.sold ? "Sold" : "Interested in this property?"}</p>
                {property.sold ? (
                  <>
                    <h4 style={{ marginTop: 20, fontSize: 16, lineHeight: "20.8px", fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "-.16px" }}>
                      No longer available.
                    </h4>
                    <p className="t-sm muted" style={{ marginTop: 6 }}>
                      This sample property has been marked sold in the concept data. Browse active listings instead.
                    </p>
                    <RollButton href="/listings" variant="forest" block>
                      View active listings
                    </RollButton>
                  </>
                ) : (
                  <>
                    <h4 style={{ marginTop: 20, fontSize: 16, lineHeight: "20.8px", fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "-.16px" }}>
                      Ask about this property.
                    </h4>
                    <p className="t-sm muted" style={{ marginTop: 6 }}>
                      Share a few details: the SLIIQQUE team responds personally within 24 hours.
                    </p>
                    <ListingEnquiryForm listingSlug={property.slug} listingAddress={`${property.name}, ${property.loc}`} />
                    <RollButton href={`/book-a-viewing?listing=${property.slug}`} variant="ghost" block>
                      Or request a viewing instead
                    </RollButton>
                    <p className="t-sm muted fine">No obligation · Concept lead flow, reviewed by a person</p>
                  </>
                )}
              </div>
              {property.openHouses.length > 0 && (
                <div className="side-card side-card--sand">
                  <p className="eyebrow">Upcoming open house</p>
                  {property.openHouses.map((oh) => (
                    <p key={oh.date} className="t-md" style={{ marginTop: 16, color: "var(--c-ink)" }}>
                      {oh.date} · {oh.time}
                    </p>
                  ))}
                </div>
              )}
              <div className="side-card side-card--sand">
                <p className="eyebrow">Key details</p>
                <dl className="kv">
                  {kv.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="privacy-note">
                <IconLock />
                <p>
                  <strong>Your privacy is protected</strong>All enquiries are handled with discretion. Your details
                  are never shared with third parties.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sec-head">
            <SplitHeading as="h2">
              More from the <em>portfolio.</em>
            </SplitHeading>
            <RollButton href="/listings" variant="copper">
              View all properties
            </RollButton>
          </div>
          <Reveal as="div" className="prop-pair" style={{ marginTop: 60 }}>
            {recents.map((q) => (
              <Link className="card-img prop-sm" href={`/listings/${q.slug}`} key={q.slug}>
                <ImageWithSkeleton className="bg" src={q.img} alt="" fill sizes="(max-width: 809px) 100vw, 50vw" />
                <span className="pill badge-tl">{q.status}</span>
                <div className="card-img__inner" style={{ justifyContent: "flex-end" }}>
                  <p className="card-img__loc">{q.loc}</p>
                  <h4 className="card-img__title">{q.name}</h4>
                  <p className="card-img__price">{q.price}</p>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
