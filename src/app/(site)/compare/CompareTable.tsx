"use client";

import Image from "next/image";
import Link from "next/link";
import { useCompare } from "@/components/CompareContext";
import { propertiesBySlug, fmtBath } from "@/data/properties";

const ROWS: { label: string; render: (p: ReturnType<typeof propertiesBySlug.get>) => string }[] = [
  { label: "Price", render: (p) => p?.price ?? "" },
  { label: "Status", render: (p) => p?.status ?? "" },
  { label: "Neighborhood", render: (p) => p?.loc ?? "" },
  { label: "Bedrooms", render: (p) => String(p?.bed ?? "") },
  { label: "Bathrooms", render: (p) => (p ? fmtBath(p.bath) : "") },
  { label: "Square feet", render: (p) => p?.sqft ?? "" },
  { label: "Property type", render: (p) => p?.ptype ?? "" },
  { label: "Year built", render: (p) => p?.year ?? "" },
  { label: "Lot size", render: (p) => p?.lot ?? "" },
  { label: "Parking", render: (p) => p?.park ?? "" },
  { label: "Standout feature", render: (p) => p?.feat ?? "" },
];

export default function CompareTable() {
  const { compareList, toggle } = useCompare();
  const properties = compareList.map((slug) => propertiesBySlug.get(slug)).filter(Boolean);

  if (properties.length === 0) {
    return (
      <p className="muted">
        Nothing to compare yet. Browse the{" "}
        <Link href="/listings" style={{ color: "var(--c-accent)" }}>
          properties page
        </Link>{" "}
        and use the compare icon on any card.
      </p>
    );
  }

  return (
    <div className="compare-table-wrap">
      <table className="compare-table">
        <thead>
          <tr>
            <th></th>
            {properties.map((p) => (
              <th key={p!.slug}>
                <Image src={`/images/${p!.img}`} alt={p!.name} width={160} height={110} />
                <span>{p!.name}</span>
                <button onClick={() => toggle(p!.slug)} aria-label={`Remove ${p!.name}`}>
                  Remove
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {properties.map((p) => (
                <td key={p!.slug}>{row.render(p)}</td>
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row"></th>
            {properties.map((p) => (
              <td key={p!.slug}>
                <Link className="btn btn--forest" href={`/listings/${p!.slug}`}>
                  <span className="btn__roll">
                    <span>View property</span>
                    <span>View property</span>
                  </span>
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
