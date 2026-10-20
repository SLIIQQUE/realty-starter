"use client";

import Link from "next/link";
import { useCompare } from "./CompareContext";
import { propertiesBySlug } from "@/data/properties";

export default function CompareBar() {
  const { compareList, toggle, clear } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="compare-bar">
      <div className="container compare-bar__inner">
        <div className="compare-bar__items">
          {compareList.map((slug) => {
            const property = propertiesBySlug.get(slug);
            if (!property) return null;
            return (
              <span key={slug} className="compare-bar__chip">
                {property.name}
                <button aria-label={`Remove ${property.name} from comparison`} onClick={() => toggle(slug)}>
                  ×
                </button>
              </span>
            );
          })}
        </div>
        <div className="compare-bar__actions">
          <button className="btn btn--ghost-light" onClick={clear}>
            Clear
          </button>
          <Link className="btn btn--copper" href="/compare">
            Compare ({compareList.length})
          </Link>
        </div>
      </div>
    </div>
  );
}
