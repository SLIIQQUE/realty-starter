"use client";

import Link from "next/link";
import { useFavorites } from "@/components/FavoritesContext";
import { propertiesBySlug } from "@/data/properties";
import PropertyStackCard from "@/components/PropertyStackCard";

export default function FavoritesList() {
  const { favorites } = useFavorites();
  const properties = favorites.map((slug) => propertiesBySlug.get(slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (properties.length === 0) {
    return (
      <div className="explorer">
        <p className="muted">
          No saved properties yet. Browse the{" "}
          <Link href="/listings" style={{ color: "var(--c-accent)" }}>
            properties page
          </Link>{" "}
          and tap the heart icon on any card to save it here.
        </p>
      </div>
    );
  }

  return (
    <div className="prop-grid" style={{ marginTop: 60 }}>
      {properties.map((p) => (
        <PropertyStackCard key={p.slug} property={p} />
      ))}
    </div>
  );
}
