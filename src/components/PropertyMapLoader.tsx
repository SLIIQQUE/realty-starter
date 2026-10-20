"use client";

import dynamic from "next/dynamic";
import type { Property } from "@/data/properties";

const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => <div className="map-empty">Loading map...</div>,
});

export default function PropertyMapLoader({ properties }: { properties: Property[] }) {
  return <PropertyMap properties={properties} />;
}
