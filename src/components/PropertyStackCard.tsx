import ImageWithSkeleton from "./ImageWithSkeleton";
import Link from "next/link";
import type { Property } from "@/data/properties";
import { fmtBath } from "@/data/properties";
import FavoriteToggle from "./FavoriteToggle";
import CompareToggle from "./CompareToggle";

/** The card used in the properties-page grid. Badge defaults to the property's real status. */
export default function PropertyStackCard({ property, badge }: { property: Property; badge?: string }) {
  return (
    <Link className="prop-stack" href={`/listings/${property.slug}`}>
      <div className="prop-stack__img">
        <ImageWithSkeleton
          src={property.img}
          alt={property.name}
          fill
          sizes="(max-width: 809px) 100vw, 50vw"
        />
        <span className="pill badge-tl">{badge ?? property.status}</span>
        <FavoriteToggle slug={property.slug} label={property.name} />
        <CompareToggle slug={property.slug} />
      </div>
      <div className="prop-stack__body">
        <p className="eyebrow">{property.loc}</p>
        <h4>{property.name}</h4>
        <div className="prop-stack__meta">
          <span>{property.price}</span>
          <span>{property.bed} Bed</span>
          <span>{fmtBath(property.bath)} Bath</span>
          <span>{property.sqft} Sq Ft</span>
        </div>
      </div>
    </Link>
  );
}
