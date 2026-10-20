/** Collapsed-nav icon for /admin (wired via admin.components.graphics.Icon in payload.config.ts).
 * The dark rounded tile, not the transparent mark: Payload's nav sits directly on whatever page
 * background is active (light or dark — see admin-theme.css), and the tile carries its own
 * built-in black background, so it reads consistently either way. */
export default function Icon() {
  // eslint-disable-next-line @next/next/no-img-element -- see Logo.tsx
  return <img src="/brand/sliiqque-logo.png" alt="SLIIQQUE" width={24} height={24} style={{ borderRadius: 6 }} />;
}
