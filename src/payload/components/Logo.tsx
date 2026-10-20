/** Login-page logo for /admin (wired via admin.components.graphics.Logo in payload.config.ts).
 * The transparent line-art mark, not the dark tile: the login card sits on a light surface
 * (--theme-elevation-0, white, per src/payload/admin-theme.css), the same context this mark is
 * designed for on the marketing site. */
export default function Logo() {
  // eslint-disable-next-line @next/next/no-img-element -- Payload's admin bundles its own
  // runtime outside Next's App Router image pipeline; a plain img keeps this component dependency-free.
  return <img src="/brand/sliiqque-mark.png" alt="SLIIQQUE" width={140} height={87} style={{ objectFit: "contain" }} />;
}
