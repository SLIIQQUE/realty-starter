import type { AdminViewServerProps } from "payload";
import Link from "next/link";
import { Gutter } from "@payloadcms/ui";

import {
  AlertIcon,
  ArrowRight,
  ArrowUpRight,
  CheckIcon,
  HomeIcon,
  InboxIcon,
  MailIcon,
  PenIcon,
  PlusIcon,
  QuoteIcon,
  SparkIcon,
  TrendIcon,
} from "../Icons";

type AdminUser = {
  email?: string;
  name?: string;
  role?: string;
};

type MediaRef = {
  alt?: string;
  url?: string;
};

type ListingDoc = {
  beds?: number | null;
  city?: string | null;
  gallery?: Array<{ image?: MediaRef | number | null }> | null;
  id: number | string;
  price?: number | null;
  province?: string | null;
  status?: string | null;
  title?: string | null;
  updatedAt?: string;
};

type LeadDoc = {
  createdAt?: string;
  email?: string | null;
  id: number | string;
  name?: string | null;
  status?: string | null;
  type?: string | null;
};

type AnyDoc = Record<string, unknown> & { id?: number | string };

const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Closed"] as const;

const currency = new Intl.NumberFormat("en-CA", {
  currency: "CAD",
  maximumFractionDigits: 0,
  style: "currency",
});

const compactCurrency = new Intl.NumberFormat("en-CA", {
  currency: "CAD",
  maximumFractionDigits: 1,
  notation: "compact",
  style: "currency",
});

const shortDate = new Intl.DateTimeFormat("en-CA", {
  day: "numeric",
  month: "short",
});

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function firstName(name?: string) {
  if (!name) return "there";
  return name.trim().split(/\s+/)[0] || "there";
}

function relativeDate(value?: string) {
  if (!value) return "—";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "—";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return shortDate.format(new Date(value));
}

function statusTone(status?: string | null) {
  const normalized = (status ?? "").toLowerCase();
  if (["available", "new listing", "qualified", "confirmed"].includes(normalized)) return "positive";
  if (["pending", "contacted", "new"].includes(normalized)) return "warm";
  if (["sold", "closed"].includes(normalized)) return "neutral";
  return "neutral";
}

function imageUrl(listing: ListingDoc) {
  const first = listing.gallery?.[0]?.image;
  if (first && typeof first === "object" && "url" in first && first.url) {
    return first.url;
  }
  return null;
}

export default async function AdminDashboard({ payload, user }: AdminViewServerProps) {
  const adminUser = (user ?? {}) as AdminUser;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86_400_000).toISOString();

  const [
    activeListings,
    newListingsThisMonth,
    totalLeads,
    newLeads,
    confirmedSubscribers,
    unconfirmedSubscribers,
    soldProperties,
    recentListings,
    recentLeads,
    allLeads,
    listingsHealth,
    postsHealth,
    testimonialsHealth,
    postCount,
    testimonialCount,
  ] = await Promise.all([
    payload.count({
      collection: "listings",
      where: { status: { in: ["Available", "New Listing"] } },
    }),
    payload.count({
      collection: "listings",
      where: { createdAt: { greater_than_equal: monthStart } },
    }),
    payload.count({ collection: "leads" }),
    payload.count({
      collection: "leads",
      where: { createdAt: { greater_than_equal: thirtyDaysAgo } },
    }),
    payload.count({
      collection: "subscribers",
      where: { confirmed: { equals: true } },
    }),
    payload.count({
      collection: "subscribers",
      where: { confirmed: { equals: false } },
    }),
    payload.find({
      collection: "sold-properties",
      depth: 0,
      limit: 500,
      select: { soldPrice: true },
    }),
    payload.find({
      collection: "listings",
      depth: 1,
      limit: 5,
      sort: "-updatedAt",
    }),
    payload.find({
      collection: "leads",
      depth: 0,
      limit: 4,
      sort: "-createdAt",
    }),
    payload.find({
      collection: "leads",
      depth: 0,
      limit: 500,
      pagination: false,
      select: { status: true },
    }),
    payload.find({
      collection: "listings",
      depth: 0,
      limit: 200,
      pagination: false,
      select: { gallery: true, price: true },
    }),
    payload.find({
      collection: "posts",
      depth: 0,
      limit: 200,
      pagination: false,
      select: { heroImage: true },
    }),
    payload.find({
      collection: "testimonials",
      depth: 0,
      limit: 200,
      pagination: false,
      select: { permissionRecorded: true },
    }),
    payload.count({ collection: "posts" }),
    payload.count({ collection: "testimonials" }),
  ]);

  const recentListingDocs = recentListings.docs as unknown as ListingDoc[];
  const recentLeadDocs = recentLeads.docs as unknown as LeadDoc[];

  const soldVolume = soldProperties.docs.reduce((sum, doc) => {
    const value = Number((doc as { soldPrice?: number | null }).soldPrice ?? 0);
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  const leadStatusCounts = LEAD_STATUSES.reduce<Record<string, number>>((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {});
  for (const lead of allLeads.docs as Array<{ status?: string | null }>) {
    if (lead.status && lead.status in leadStatusCounts) {
      leadStatusCounts[lead.status] += 1;
    }
  }
  const leadTotal = Object.values(leadStatusCounts).reduce((sum, count) => sum + count, 0);

  const missingPhotos = (listingsHealth.docs as AnyDoc[]).filter(
    (doc) => !Array.isArray(doc.gallery) || doc.gallery.length === 0,
  ).length;
  const missingPrices = (listingsHealth.docs as AnyDoc[]).filter(
    (doc) => doc.price === null || doc.price === undefined || doc.price === "",
  ).length;
  const missingHeroes = (postsHealth.docs as AnyDoc[]).filter((doc) => !doc.heroImage).length;
  const missingPermissions = (testimonialsHealth.docs as AnyDoc[]).filter(
    (doc) => doc.permissionRecorded !== true,
  ).length;

  const stats = [
    {
      href: "/admin/collections/listings",
      icon: <HomeIcon size={19} />,
      label: "Active listings",
      note: `${newListingsThisMonth.totalDocs} added this month`,
      value: String(activeListings.totalDocs),
    },
    {
      href: "/admin/collections/leads",
      icon: <InboxIcon size={19} />,
      label: "Leads · last 30 days",
      note: `${totalLeads.totalDocs} total in the pipeline`,
      value: String(newLeads.totalDocs),
    },
    {
      href: "/admin/collections/sold-properties",
      icon: <TrendIcon size={19} />,
      label: "Closed volume",
      note: `${soldProperties.totalDocs} recorded sales`,
      value: compactCurrency.format(soldVolume),
    },
    {
      href: "/admin/collections/subscribers",
      icon: <MailIcon size={19} />,
      label: "Newsletter",
      note: `${unconfirmedSubscribers.totalDocs} awaiting confirmation`,
      value: confirmedSubscribers.totalDocs.toLocaleString("en-CA"),
    },
  ];

  const quickActions = [
    {
      description: "Publish a new property to the portfolio",
      href: "/admin/collections/listings/create",
      icon: <HomeIcon size={18} />,
      label: "Add a listing",
    },
    {
      description: "Write an insight or market update",
      href: "/admin/collections/posts/create",
      icon: <PenIcon size={18} />,
      label: "New insight",
    },
    {
      description: "Capture a client story with consent",
      href: "/admin/collections/testimonials/create",
      icon: <QuoteIcon size={18} />,
      label: "Add a testimonial",
    },
    {
      description: "Contact details, SEO and social links",
      href: "/admin/globals/site-settings",
      icon: <SparkIcon size={18} />,
      label: "Site settings",
    },
  ];

  const attention = [
    {
      count: missingPhotos,
      href: "/admin/collections/listings",
      label: "Listings without photos",
    },
    {
      count: missingPrices,
      href: "/admin/collections/listings",
      label: "Listings without a price",
    },
    {
      count: missingHeroes,
      href: "/admin/collections/posts",
      label: "Insights without a hero image",
    },
    {
      count: missingPermissions,
      href: "/admin/collections/testimonials",
      label: "Testimonials without consent",
    },
  ];

  return (
    <Gutter className="sliiq-dash">
      <section className="sliiq-hero">
        <div aria-hidden="true" className="sliiq-hero__glow" />
        <div className="sliiq-hero__main">
          <p className="sliiq-eyebrow">
            SLIIQQUE Realty Studio <span aria-hidden="true">·</span> Toronto &amp; GTA
          </p>
          <h1>
            {greeting()}, {firstName(adminUser.name)}.
          </h1>
          <p className="sliiq-hero__lede">
            Here is the pulse of the portfolio: what is live, who is enquiring, and what needs
            your attention before the next showing.
          </p>
          <div className="sliiq-hero__actions">
            <Link className="sliiq-button sliiq-button--primary" href="/admin/collections/listings/create">
              <PlusIcon size={16} />
              New listing
            </Link>
            <Link className="sliiq-button" href="/admin/collections/leads">
              Review leads
            </Link>
            <a className="sliiq-button sliiq-button--quiet" href="/" rel="noreferrer" target="_blank">
              View site
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <div className="sliiq-hero__aside">
          <div className="sliiq-hero__status">
            <span className="sliiq-pulse" />
            <span>
              <strong>CMS connected</strong>
              <small>Content is syncing with the live site</small>
            </span>
          </div>
          <div className="sliiq-hero__date">
            <span>{now.toLocaleDateString("en-CA", { weekday: "long" })}</span>
            <strong>
              {now.toLocaleDateString("en-CA", { day: "numeric", month: "long", year: "numeric" })}
            </strong>
          </div>
        </div>
      </section>

      <section aria-label="Key numbers" className="sliiq-stats">
        {stats.map((stat) => (
          <a className="sliiq-stat" href={stat.href} key={stat.label}>
            <span className="sliiq-stat__icon">{stat.icon}</span>
            <span className="sliiq-stat__value">{stat.value}</span>
            <span className="sliiq-stat__label">{stat.label}</span>
            <span className="sliiq-stat__note">{stat.note}</span>
          </a>
        ))}
      </section>

      <div className="sliiq-grid">
        <div className="sliiq-grid__main">
          <section className="sliiq-card sliiq-pipeline">
            <header className="sliiq-card__header">
              <div>
                <p className="sliiq-card__eyebrow">Pipeline</p>
                <h2>Lead flow</h2>
              </div>
              <Link className="sliiq-text-link" href="/admin/collections/leads">
                Open pipeline <ArrowRight size={14} />
              </Link>
            </header>

            <div className="sliiq-pipeline__bar" role="img" aria-label={`${leadTotal} total leads`}>
              {leadTotal > 0 ? (
                LEAD_STATUSES.map((status) => {
                  const width = (leadStatusCounts[status] / leadTotal) * 100;
                  if (width === 0) return null;
                  return (
                    <span
                      className={`sliiq-pipeline__segment is-${status.toLowerCase()}`}
                      key={status}
                      style={{ width: `${width}%` }}
                    />
                  );
                })
              ) : (
                <span className="sliiq-pipeline__empty-bar" />
              )}
            </div>

            <div className="sliiq-pipeline__legend">
              {LEAD_STATUSES.map((status) => (
                <div className="sliiq-pipeline__item" key={status}>
                  <span className={`sliiq-dot is-${status.toLowerCase()}`} />
                  <span className="sliiq-pipeline__count">{leadStatusCounts[status]}</span>
                  <span className="sliiq-pipeline__label">{status}</span>
                </div>
              ))}
            </div>

            {leadTotal === 0 ? (
              <p className="sliiq-pipeline__empty">
                No enquiries yet. Leads from the contact, valuation and viewing forms will appear
                here the moment they arrive.
              </p>
            ) : (
              <div className="sliiq-pipeline__recent">
                {recentLeadDocs.map((lead) => (
                  <a
                    className="sliiq-pipeline__recent-row"
                    href={`/admin/collections/leads/${lead.id}`}
                    key={lead.id}
                  >
                    <span className="sliiq-pipeline__recent-avatar">
                      {(lead.email ?? lead.name ?? "?").slice(0, 1).toUpperCase()}
                    </span>
                    <span className="sliiq-pipeline__recent-copy">
                      <strong>{lead.name || lead.email || "Unnamed enquiry"}</strong>
                      <small>{lead.type ? `${lead.type} enquiry` : "Website enquiry"}</small>
                    </span>
                    <span className={`sliiq-pill is-${statusTone(lead.status)}`}>
                      {lead.status ?? "New"}
                    </span>
                    <span className="sliiq-pipeline__recent-date">
                      {relativeDate(lead.createdAt)}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </section>

          <section className="sliiq-card sliiq-portfolio">
            <header className="sliiq-card__header">
              <div>
                <p className="sliiq-card__eyebrow">Portfolio</p>
                <h2>Latest listings</h2>
              </div>
              <Link className="sliiq-text-link" href="/admin/collections/listings">
                View all <ArrowRight size={14} />
              </Link>
            </header>

            {recentListingDocs.length === 0 ? (
              <div className="sliiq-empty">
                <span className="sliiq-empty__icon">
                  <HomeIcon size={22} />
                </span>
                <h3>No listings yet</h3>
                <p>Add the first property and it will appear here, on the site, and in search.</p>
                <Link className="sliiq-button sliiq-button--primary" href="/admin/collections/listings/create">
                  <PlusIcon size={16} />
                  Add a listing
                </Link>
              </div>
            ) : (
              <div className="sliiq-listings">
                {recentListingDocs.map((listing) => {
                  const image = imageUrl(listing);
                  return (
                    <a
                      className="sliiq-listing-row"
                      href={`/admin/collections/listings/${listing.id}`}
                      key={listing.id}
                    >
                      <span className="sliiq-listing-row__media">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt="" src={image} />
                        ) : (
                          <HomeIcon size={18} />
                        )}
                      </span>
                      <span className="sliiq-listing-row__copy">
                        <strong>{listing.title}</strong>
                        <small>
                          {[listing.city, listing.province].filter(Boolean).join(", ") ||
                            "Location to add"}
                        </small>
                      </span>
                      <span className={`sliiq-pill is-${statusTone(listing.status)}`}>
                        {listing.status ?? "Draft"}
                      </span>
                      <span className="sliiq-listing-row__price">
                        {typeof listing.price === "number" ? currency.format(listing.price) : "—"}
                      </span>
                      <span className="sliiq-listing-row__updated">
                        {relativeDate(listing.updatedAt)}
                      </span>
                    </a>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="sliiq-grid__side">
          <section className="sliiq-card sliiq-actions">
            <header className="sliiq-card__header">
              <div>
                <p className="sliiq-card__eyebrow">Shortcuts</p>
                <h2>Quick actions</h2>
              </div>
            </header>
            <div className="sliiq-actions__list">
              {quickActions.map((action) => (
                <a className="sliiq-action" href={action.href} key={action.label}>
                  <span className="sliiq-action__icon">{action.icon}</span>
                  <span className="sliiq-action__copy">
                    <strong>{action.label}</strong>
                    <small>{action.description}</small>
                  </span>
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
          </section>

          <section className="sliiq-card sliiq-attention">
            <header className="sliiq-card__header">
              <div>
                <p className="sliiq-card__eyebrow">Content health</p>
                <h2>Needs attention</h2>
              </div>
              <span className="sliiq-attention__badge">
                {attention.reduce((sum, item) => sum + item.count, 0)}
              </span>
            </header>
            <div className="sliiq-attention__list">
              {attention.map((item) => (
                <a className="sliiq-attention__row" href={item.href} key={item.label}>
                  <span
                    className={`sliiq-attention__icon${item.count === 0 ? " is-done" : ""}`}
                  >
                    {item.count === 0 ? <CheckIcon size={13} /> : <AlertIcon size={13} />}
                  </span>
                  <span>{item.label}</span>
                  <strong>{item.count === 0 ? "Done" : item.count}</strong>
                </a>
              ))}
            </div>
          </section>

          <section className="sliiq-card sliiq-library">
            <header className="sliiq-card__header">
              <div>
                <p className="sliiq-card__eyebrow">Library</p>
                <h2>Editorial</h2>
              </div>
              <Link className="sliiq-text-link" href="/admin/collections/posts">
                Manage <ArrowRight size={14} />
              </Link>
            </header>
            <div className="sliiq-library__stats">
              <Link href="/admin/collections/posts">
                <strong>{postCount.totalDocs}</strong>
                <span>Insights</span>
              </Link>
              <Link href="/admin/collections/testimonials">
                <strong>{testimonialCount.totalDocs}</strong>
                <span>Stories</span>
              </Link>
              <Link href="/admin/collections/media">
                <strong>Media</strong>
                <span>Library</span>
              </Link>
            </div>
          </section>
        </aside>
      </div>

      <footer className="sliiq-dash__footer">
        <span>SLIIQQUE Realty Studio · Admin</span>
        <span>
          Last refreshed{" "}
          {now.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" })}
        </span>
      </footer>
    </Gutter>
  );
}
