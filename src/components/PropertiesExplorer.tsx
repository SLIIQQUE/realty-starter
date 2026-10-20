"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Property } from "@/data/properties";
import type { Neighbourhood } from "@/lib/content/neighbourhoods";
import PropertyStackCard from "./PropertyStackCard";
import PropertyMapLoader from "./PropertyMapLoader";

const STATUSES = ["All", "Available", "New Listing", "Pending", "Sold"] as const;
const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;
type SortValue = (typeof SORTS)[number]["value"];

function priceToNumber(price: string) {
  return Number(price.replace(/[^0-9]/g, ""));
}

function fmtCAD(n: number) {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
}

type AlertStatus = "idle" | "sending" | "sent" | "error";

export default function PropertiesExplorer({
  properties,
  neighbourhoods,
}: {
  properties: Property[];
  neighbourhoods: Neighbourhood[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<(typeof STATUSES)[number]>(
    (searchParams.get("status") as (typeof STATUSES)[number]) || "All"
  );
  const [area, setArea] = useState(searchParams.get("area") || "all");
  const [ptype, setPtype] = useState(searchParams.get("ptype") || "all");
  const [minBeds, setMinBeds] = useState(Number(searchParams.get("beds")) || 0);
  const [minBaths, setMinBaths] = useState(Number(searchParams.get("baths")) || 0);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [sort, setSort] = useState<SortValue>((searchParams.get("sort") as SortValue) || "newest");
  const [view, setView] = useState<"grid" | "map">("grid");

  const [alertEmail, setAlertEmail] = useState("");
  const [alertConsent, setAlertConsent] = useState(false);
  const [alertStatus, setAlertStatus] = useState<AlertStatus>("idle");

  const neighbourhoodOptions = useMemo(
    () => [{ slug: "all", name: "All neighbourhoods" }, ...neighbourhoods.map((n) => ({ slug: n.slug, name: n.name }))],
    [neighbourhoods]
  );
  const propertyTypes = useMemo(() => ["all", ...Array.from(new Set(properties.map((p) => p.ptype)))], [properties]);

  /** Mirrors the active filters into the URL's query string (shallow, no scroll) so results
   *  can be shared and indexed, e.g. ?area=yorkville&status=Available&sort=price-asc. */
  const syncUrl = useCallback(
    (next: Record<string, string>) => {
      const params = new URLSearchParams();
      Object.entries(next).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "All" && value !== "0" && value !== "newest") {
          params.set(key, value);
        }
      });
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  function updateFilters(partial: {
    status?: string;
    area?: string;
    ptype?: string;
    beds?: number;
    baths?: number;
    minPrice?: string;
    maxPrice?: string;
    q?: string;
    sort?: string;
  }) {
    const next = {
      status: partial.status ?? status,
      area: partial.area ?? area,
      ptype: partial.ptype ?? ptype,
      beds: String(partial.beds ?? minBeds),
      baths: String(partial.baths ?? minBaths),
      minPrice: partial.minPrice ?? minPrice,
      maxPrice: partial.maxPrice ?? maxPrice,
      q: partial.q ?? query,
      sort: partial.sort ?? sort,
    };
    syncUrl(next);
  }

  const areaName = area === "all" ? null : neighbourhoodOptions.find((n) => n.slug === area)?.name ?? null;

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    let list = properties.filter((p) => {
      if (status !== "All" && p.status !== status) return false;
      if (areaName && p.loc !== areaName) return false;
      if (ptype !== "all" && p.ptype !== ptype) return false;
      if (p.bed < minBeds) return false;
      if (p.bath < minBaths) return false;
      const priceNum = priceToNumber(p.price);
      if (min !== null && priceNum < min) return false;
      if (max !== null && priceNum > max) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const haystack = `${p.name} ${p.loc} ${p.ptype} ${p.features.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-desc":
          return priceToNumber(b.price) - priceToNumber(a.price);
        case "price-asc":
          return priceToNumber(a.price) - priceToNumber(b.price);
        default:
          return 0;
      }
    });

    return list;
  }, [properties, status, areaName, ptype, minBeds, minBaths, minPrice, maxPrice, query, sort]);

  const hasActiveFilters =
    query || status !== "All" || area !== "all" || ptype !== "all" || minBeds > 0 || minBaths > 0 || minPrice || maxPrice;

  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (status !== "All") parts.push(`Status: ${status}`);
    if (areaName) parts.push(areaName);
    if (ptype !== "all") parts.push(ptype);
    if (minBeds > 0) parts.push(`${minBeds}+ beds`);
    if (minBaths > 0) parts.push(`${minBaths}+ baths`);
    if (minPrice) parts.push(`min ${fmtCAD(Number(minPrice))}`);
    if (maxPrice) parts.push(`max ${fmtCAD(Number(maxPrice))}`);
    if (query.trim()) parts.push(`"${query.trim()}"`);
    return parts.length ? parts.join(", ") : "all sample listings";
  }, [status, areaName, ptype, minBeds, minBaths, minPrice, maxPrice, query]);

  async function handleAlertSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAlertStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: alertEmail, consent: alertConsent, criteria: filterSummary }),
      });
      if (!res.ok) throw new Error("Something went wrong.");
      setAlertStatus("sent");
    } catch {
      setAlertStatus("error");
    }
  }

  return (
    <div className="explorer">
      <div className="explorer__filters reveal is-in">
        <input
          className="input explorer__search"
          type="search"
          placeholder="Search by name, neighbourhood, or feature..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            updateFilters({ q: e.target.value });
          }}
          aria-label="Search properties"
        />
        <select
          className="input"
          value="sale"
          onChange={() => undefined}
          aria-label="Transaction type"
          title="This sample portfolio currently lists for-sale properties only"
        >
          <option value="sale">For Sale</option>
        </select>
        <select
          className="input"
          value={area}
          onChange={(e) => {
            setArea(e.target.value);
            updateFilters({ area: e.target.value });
          }}
          aria-label="Filter by neighbourhood"
        >
          {neighbourhoodOptions.map((n) => (
            <option key={n.slug} value={n.slug}>
              {n.name}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={ptype}
          onChange={(e) => {
            setPtype(e.target.value);
            updateFilters({ ptype: e.target.value });
          }}
          aria-label="Filter by property type"
        >
          <option value="all">All property types</option>
          {propertyTypes
            .filter((t) => t !== "all")
            .map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
        </select>
        <select
          className="input"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as typeof status);
            updateFilters({ status: e.target.value });
          }}
          aria-label="Filter by status"
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          className="input"
          value={minBeds}
          onChange={(e) => {
            const v = Number(e.target.value);
            setMinBeds(v);
            updateFilters({ beds: v });
          }}
          aria-label="Minimum bedrooms"
        >
          <option value={0}>Any beds</option>
          {[2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n}+ beds
            </option>
          ))}
        </select>
        <select
          className="input"
          value={minBaths}
          onChange={(e) => {
            const v = Number(e.target.value);
            setMinBaths(v);
            updateFilters({ baths: v });
          }}
          aria-label="Minimum bathrooms"
        >
          <option value={0}>Any baths</option>
          {[2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+ baths
            </option>
          ))}
        </select>
        <input
          className="input"
          type="number"
          inputMode="numeric"
          placeholder="Min price (CAD)"
          min={0}
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            updateFilters({ minPrice: e.target.value });
          }}
          aria-label="Minimum price in CAD"
          style={{ minWidth: 150 }}
        />
        <input
          className="input"
          type="number"
          inputMode="numeric"
          placeholder="Max price (CAD)"
          min={0}
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            updateFilters({ maxPrice: e.target.value });
          }}
          aria-label="Maximum price in CAD"
          style={{ minWidth: 150 }}
        />
        <select
          className="input"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as SortValue);
            updateFilters({ sort: e.target.value });
          }}
          aria-label="Sort properties"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <div className="view-toggle" role="group" aria-label="View">
          <button aria-pressed={view === "grid"} onClick={() => setView("grid")}>
            Grid
          </button>
          <button aria-pressed={view === "map"} onClick={() => setView("map")}>
            Map
          </button>
        </div>
      </div>

      <p className="t-sm muted explorer__count">
        {filtered.length} {filtered.length === 1 ? "property" : "properties"}
        {hasActiveFilters ? " match your filters" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="explorer__empty">
          <p className="muted">No properties match these filters yet. Try widening your search.</p>
          <div className="alert-signup">
            {alertStatus === "sent" ? (
              <p className="t-sm" style={{ color: "var(--c-ink)" }}>
                Thanks, you&apos;re on the list. We&apos;ll follow up by email when something matching these
                criteria comes up.
              </p>
            ) : (
              <>
                <p className="t-sm muted">
                  Get listing alerts for: <strong>{filterSummary}</strong>
                </p>
                <form onSubmit={handleAlertSubmit} className="alert-signup__form">
                  <input
                    className="input"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    aria-label="Email for listing alerts"
                  />
                  <button className="btn-submit" type="submit" disabled={alertStatus === "sending" || !alertConsent}>
                    {alertStatus === "sending" ? "Sending..." : "Notify me"}
                  </button>
                  <div className="consent-field alert-signup__consent">
                    <label>
                      <input
                        type="checkbox"
                        required
                        name="consent"
                        checked={alertConsent}
                        onChange={(e) => setAlertConsent(e.target.checked)}
                      />
                      <span>
                        I agree to be contacted about matching listings. See the{" "}
                        <Link href="/privacy">Privacy Policy</Link>.
                      </span>
                    </label>
                  </div>
                  {alertStatus === "error" && (
                    <p className="t-xs" style={{ color: "#f87171" }}>
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      ) : view === "grid" ? (
        <div className="prop-grid explorer__grid">
          {filtered.map((p) => (
            <PropertyStackCard key={p.slug} property={p} />
          ))}
        </div>
      ) : (
        <PropertyMapLoader properties={filtered} />
      )}

      {view === "grid" && filtered.length > 0 && (
        <p className="t-xs muted explorer__hint">
          Showing {filtered.length} of {properties.length} sample properties.
        </p>
      )}
    </div>
  );
}
