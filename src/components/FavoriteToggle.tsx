"use client";

import { useFavorites } from "./FavoritesContext";

export default function FavoriteToggle({ slug, label }: { slug: string; label: string }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(slug);

  return (
    <button
      type="button"
      className="favorite-toggle"
      aria-pressed={active}
      aria-label={active ? `Remove ${label} from saved properties` : `Save ${label}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8}>
        <path d="M12 20.5s-7.5-4.6-10-9.3C.4 7.8 2 4 5.6 4c2 0 3.6 1.1 4.4 2.6C10.8 5.1 12.4 4 14.4 4 18 4 19.6 7.8 18 11.2c-2.5 4.7-6 9.3-6 9.3z" />
      </svg>
    </button>
  );
}
