"use client";

import Link from "next/link";
import { useFavorites } from "./FavoritesContext";

export default function FavoritesButton() {
  const { favorites } = useFavorites();

  return (
    <Link href="/favorites" className="favorites-btn" aria-label={`Saved properties (${favorites.length})`}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill={favorites.length ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8}>
        <path d="M12 20.5s-7.5-4.6-10-9.3C.4 7.8 2 4 5.6 4c2 0 3.6 1.1 4.4 2.6C10.8 5.1 12.4 4 14.4 4 18 4 19.6 7.8 18 11.2c-2.5 4.7-6 9.3-6 9.3z" />
      </svg>
      {favorites.length > 0 && <span className="favorites-btn__count">{favorites.length}</span>}
    </Link>
  );
}
