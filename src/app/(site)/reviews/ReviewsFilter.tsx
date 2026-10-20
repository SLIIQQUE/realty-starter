"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Testimonial } from "@/lib/content/testimonials";
import { resolveImageSrc } from "@/lib/content/image";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "buyer", label: "Buyers" },
  { value: "seller", label: "Sellers" },
] as const;
type FilterValue = (typeof FILTERS)[number]["value"];

export default function ReviewsFilter({ testimonials }: { testimonials: Testimonial[] }) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(
    () => (filter === "all" ? testimonials : testimonials.filter((t) => t.role === filter)),
    [testimonials, filter]
  );

  return (
    <div>
      <div className="view-toggle" role="group" aria-label="Filter reviews" style={{ marginLeft: 0 }}>
        {FILTERS.map((f) => (
          <button key={f.value} aria-pressed={filter === f.value} onClick={() => setFilter(f.value)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="reviews-grid">
        {filtered.map((t) => (
          <div className="quote-box reviews-card" key={`${t.name}-${t.date}`}>
            <Image
              className="quote-box__mark reviews-card__avatar"
              src={resolveImageSrc(t.photo)}
              alt=""
              width={50}
              height={50}
            />
            <div>
              <p>&quot;{t.quote}&quot;</p>
              <p className="t-xs muted reviews-card__meta">
                {t.name} · {t.role === "buyer" ? "Buyer" : "Seller"} · {t.source}, {t.date}
              </p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="muted">No reviews in this category yet.</p>}
      </div>
    </div>
  );
}
