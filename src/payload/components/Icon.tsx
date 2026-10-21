/** Collapsed-nav icon for /admin (wired via admin.components.graphics.Icon in payload.config.ts).
 * The dark rounded tile, not the transparent mark: the admin is locked to the light theme (see
 * payload.config.ts), while the nav is near-black, so the tile carries its own built-in black
 * background and reads consistently on either surface. */
export default function Icon() {
  // eslint-disable-next-line @next/next/no-img-element -- see Logo.tsx
  return <img src="/brand/sliiqque-logo.png" alt="SLIIQQUE" width={24} height={24} style={{ borderRadius: 6 }} />;
}
