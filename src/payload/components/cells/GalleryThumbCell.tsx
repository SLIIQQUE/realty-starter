"use client";

import type { DefaultCellComponentProps } from "payload";

import { useEffect, useState } from "react";

import { ImageIcon } from "../Icons";

type MediaInfo = {
  alt?: string;
  url?: string;
};

type GalleryRow = {
  image?: MediaInfo | number | null;
  id?: number | string;
};

/**
 * Admin list cells only receive upload IDs (the table is intentionally shallow),
 * so resolve the first gallery image through the public media endpoint and memoise
 * it for the lifetime of the tab. Same media item is often reused across rows.
 */
const mediaCache = new Map<number, Promise<MediaInfo | null>>();

function fetchMedia(id: number): Promise<MediaInfo | null> {
  const cached = mediaCache.get(id);
  if (cached) return cached;

  const request = fetch(`/api/media/${id}?depth=0`, {
    headers: { Accept: "application/json" },
  })
    .then((response) => (response.ok ? response.json() : null))
    .then((doc: MediaInfo | null) =>
      doc && typeof doc.url === "string" ? { alt: doc.alt, url: doc.url } : null,
    )
    .catch(() => null);

  mediaCache.set(id, request);
  return request;
}

function firstImageRef(rows: unknown): MediaInfo | number | null {
  if (!Array.isArray(rows)) return null;
  for (const row of rows as GalleryRow[]) {
    const image = row?.image;
    if (typeof image === "number") return image;
    if (image && typeof image === "object" && image.url) return image;
  }
  return null;
}

function optimized(url: string) {
  return `/_next/image?url=${encodeURIComponent(url)}&w=96&q=75`;
}

/** Small rounded thumbnail for a listing's first gallery image. */
export default function GalleryThumbCell({ cellData, rowData }: DefaultCellComponentProps) {
  const ref = firstImageRef(cellData) ?? firstImageRef(rowData?.gallery);
  const inline = ref && typeof ref === "object" ? ref : null;
  const mediaID = typeof ref === "number" ? ref : null;

  const [media, setMedia] = useState<MediaInfo | null>(inline);

  useEffect(() => {
    if (inline || mediaID === null) return;
    let active = true;
    fetchMedia(mediaID).then((result) => {
      if (active) setMedia(result);
    });
    return () => {
      active = false;
    };
  }, [inline, mediaID]);

  const url = media?.url;

  return (
    <span className={`sliiq-thumb${url ? " has-image" : ""}`}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={media?.alt ?? ""}
          decoding="async"
          loading="lazy"
          onError={(event) => {
            // Next's optimizer is unavailable for a handful of legacy files.
            const image = event.currentTarget;
            if (image.dataset.fallback === "true") return;
            image.dataset.fallback = "true";
            image.src = url;
          }}
          src={optimized(url)}
        />
      ) : (
        <ImageIcon size={16} />
      )}
    </span>
  );
}
