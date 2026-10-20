"use client";

import { MAX_COMPARE, useCompare } from "./CompareContext";

export default function CompareToggle({ slug }: { slug: string }) {
  const { isComparing, toggle, compareList } = useCompare();
  const active = isComparing(slug);
  const disabled = !active && compareList.length >= MAX_COMPARE;

  return (
    <button
      type="button"
      className="compare-toggle"
      aria-pressed={active}
      disabled={disabled}
      title={disabled ? `Compare up to ${MAX_COMPARE} properties at a time` : active ? "Remove from comparison" : "Add to comparison"}
      aria-label={active ? "Remove from comparison" : "Add to comparison"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
    >
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M4 4h7v16H4zM13 4h7v16h-7z" />
      </svg>
    </button>
  );
}
