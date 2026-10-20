"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { resolveImageSrc } from "@/lib/content/image";

/**
 * Drop-in replacement for `next/image` in `fill` mode, for images now sourced from the
 * Payload/Postgres CMS instead of a bundled static file (so a real network/DB round trip can
 * precede the image actually being available). Renders a skeleton that exactly fills the same
 * box the image does (it's a sibling of the `<img>`, not a wrapper, so it inherits whatever
 * `position: relative` card/hero container is already there) using the site's own design
 * tokens, then fades to the real image on load. No layout shift either way.
 *
 * Attaches plain native `load`/`error` listeners via `ref` rather than using next/image's own
 * `onLoad` prop, so this doesn't depend on any particular internal Next.js event-relay mechanism.
 *
 * `src` accepts either shape the content layer can hand it: a bare static filename (e.g.
 * "priya-mehta-headshot.jpg", resolved against /images/) when the CMS isn't configured, or an
 * already-absolute CMS media URL (e.g. "/api/media/file/...") once it is — callers never need
 * to know which they have (see src/lib/content/image.ts, also used directly by plain
 * `next/image` call sites that are too small/fixed-size to warrant a skeleton).
 */
export default function ImageWithSkeleton({ className, src, alt, ...props }: ImageProps) {
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    if (!imgEl) return;

    if (imgEl.complete && imgEl.naturalWidth > 0) {
      setLoaded(true);
      return;
    }

    const onLoad = () => setLoaded(true);
    const onError = () => setLoaded(true); // don't leave the skeleton stuck forever on a broken image either
    imgEl.addEventListener("load", onLoad);
    imgEl.addEventListener("error", onError);
    return () => {
      imgEl.removeEventListener("load", onLoad);
      imgEl.removeEventListener("error", onError);
    };
  }, [imgEl, src]);

  return (
    <>
      <span className={`img-skeleton${loaded ? " img-skeleton--done" : ""}`} aria-hidden="true" />
      <Image
        {...props}
        ref={setImgEl}
        alt={alt}
        src={typeof src === "string" ? resolveImageSrc(src) : src}
        className={[className, "img-fade", loaded ? "img-fade--in" : ""].filter(Boolean).join(" ")}
      />
    </>
  );
}
