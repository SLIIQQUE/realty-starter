"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Property } from "@/data/properties";
import { fmtBath } from "@/data/properties";

const pinIcon = L.divIcon({
  className: "map-pin",
  html: `<span class="map-pin__dot"></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function popupHtml(p: Property) {
  return `<div class="map-popup"><strong>${p.name}</strong><span>${p.loc}</span><span>${p.price} · ${p.bed} bd · ${fmtBath(p.bath)} ba</span><a href="/listings/${p.slug}">View property</a></div>`;
}

/**
 * Plain Leaflet, imperatively managed, not react-leaflet's <MapContainer>.
 * React 18 Strict Mode double-invokes mount effects in dev, and Leaflet's own
 * `L.map(container)` throws "Map container is already initialized" if a second
 * init runs against a container that still carries the first instance's
 * internal `_leaflet_id`. This effect guards against that explicitly and always
 * tears the instance down on cleanup, so it's correct under Strict Mode and
 * under the grid/map toggle's real mount/unmount cycles alike.
 */
export default function PropertyMap({ properties }: { properties: Property[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || properties.length === 0) return;

    const map = L.map(container, { scrollWheelZoom: false });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    properties.forEach((p) => {
      L.marker([p.lat, p.lng], { icon: pinIcon }).addTo(map).bindPopup(popupHtml(p));
    });

    if (properties.length === 1) {
      map.setView([properties[0].lat, properties[0].lng], 12);
    } else {
      const bounds = L.latLngBounds(properties.map((p) => [p.lat, p.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [properties]);

  if (properties.length === 0) {
    return <div className="map-empty">No properties match these filters yet.</div>;
  }

  return <div ref={containerRef} className="property-map" />;
}
