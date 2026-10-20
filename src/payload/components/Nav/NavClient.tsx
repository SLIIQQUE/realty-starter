"use client";

import { Logout, useNav } from "@payloadcms/ui";
import { formatAdminURL } from "payload/shared";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ArrowUpRight, CloseIcon, GridIcon, NavIcon } from "../Icons";

type NavEntity = {
  label: string;
  slug: string;
  type: string;
};

type NavGroup = {
  entities: NavEntity[];
  label: string;
};

type NavUser = {
  email: string;
  name: string;
  role: string;
};

type Props = {
  adminRoute: string;
  groups: NavGroup[];
  user?: NavUser;
};

const GROUP_ORDER = ["Portfolio", "Growth", "Pipeline", "Library", "Settings"];

/** Editorial ordering — Payload returns entities alphabetically by default. */
const ENTITY_ORDER = [
  "listings",
  "sold-properties",
  "neighbourhoods",
  "agents",
  "posts",
  "pages",
  "testimonials",
  "faq",
  "media",
  "leads",
  "subscribers",
  "site-settings",
  "redirects",
  "tax-rules",
  "users",
];

function orderGroups(groups: NavGroup[]) {
  return [...groups]
    .sort((a, b) => {
      const ai = GROUP_ORDER.indexOf(a.label);
      const bi = GROUP_ORDER.indexOf(b.label);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    })
    .map((group) => ({
      ...group,
      entities: [...group.entities].sort((a, b) => {
        const ai = ENTITY_ORDER.indexOf(a.slug);
        const bi = ENTITY_ORDER.indexOf(b.slug);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      }),
    }));
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SL";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function NavClient({ adminRoute, groups, user }: Props) {
  const pathname = usePathname();
  const { hydrated, navOpen, navRef, setNavOpen, shouldAnimate } = useNav();

  // `/admin` is a prefix of every admin URL, so the dashboard needs an exact
  // match or it would render as active on every collection and global screen.
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const dashboardHref = adminRoute;
  const isDashboard = pathname === dashboardHref || pathname === `${dashboardHref}/`;
  const closeOnMobile = () => setNavOpen(false);

  return (
    <aside
      className={[
        "nav",
        "sliiq-nav",
        navOpen && "nav--nav-open",
        shouldAnimate && "nav--nav-animate",
        hydrated && "nav--nav-hydrated",
      ]
        .filter(Boolean)
        .join(" ")}
      inert={!navOpen ? true : undefined}
    >
      <div className="nav__scroll" ref={navRef}>
        <div className="sliiq-nav__inner">
          <div className="sliiq-nav__top">
            <Link className="sliiq-nav__brand" href={dashboardHref} onClick={closeOnMobile}>
              <span className="sliiq-nav__mark">
                {/* Payload's admin bundles outside Next's image pipeline. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" height={30} src="/brand/sliiqque-mark.png" width={48} />
              </span>
              <span className="sliiq-nav__brand-copy">
                <span className="sliiq-nav__brand-name">SLIIQQUE</span>
                <span className="sliiq-nav__brand-sub">Realty Studio</span>
              </span>
            </Link>
            <button
              aria-label="Close navigation"
              className="sliiq-nav__close"
              onClick={() => setNavOpen(false)}
              type="button"
            >
              <CloseIcon size={18} />
            </button>
          </div>

          <p className="sliiq-nav__kicker">Content operating system</p>

          <nav aria-label="Admin navigation" className="sliiq-nav__nav">
            <Link
              className={`sliiq-nav__link sliiq-nav__link--overview${
                isDashboard ? " is-active" : ""
              }`}
              href={dashboardHref}
              onClick={closeOnMobile}
            >
              <span className="sliiq-nav__icon">
                <GridIcon size={17} />
              </span>
              <span>Overview</span>
            </Link>

            {orderGroups(groups).map((group) => (
              <div className="sliiq-nav__group" key={group.label}>
                <p className="sliiq-nav__group-label">{group.label}</p>
                {group.entities.map((entity) => {
                  const href = formatAdminURL({
                    adminRoute,
                    path:
                      entity.type === "globals"
                        ? `/globals/${entity.slug}`
                        : `/collections/${entity.slug}`,
                  });

                  return (
                    <Link
                      className={`sliiq-nav__link${isActive(href) ? " is-active" : ""}`}
                      href={href}
                      key={`${entity.type}-${entity.slug}`}
                      onClick={closeOnMobile}
                    >
                      <span className="sliiq-nav__icon">
                        <NavIcon size={17} slug={entity.slug} />
                      </span>
                      <span>{entity.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="sliiq-nav__bottom">
            <a
              className="sliiq-nav__site-link"
              href="/"
              rel="noreferrer"
              target="_blank"
            >
              <span>
                <span className="sliiq-nav__site-dot" />
                View live site
              </span>
              <ArrowUpRight size={15} />
            </a>

            {user ? (
              <div className="sliiq-nav__account">
                <Link className="sliiq-nav__account-link" href={`${adminRoute}/account`}>
                  <span className="sliiq-nav__avatar">{initials(user.name)}</span>
                  <span className="sliiq-nav__account-copy">
                    <span className="sliiq-nav__account-name">{user.name}</span>
                    <span className="sliiq-nav__account-role">{user.role}</span>
                  </span>
                </Link>
                <Logout />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}
