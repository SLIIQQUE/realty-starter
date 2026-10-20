/**
 * Every image-bearing field returned by src/lib/content/* is either a bare static filename
 * (e.g. "priya-mehta-headshot.jpg", resolved against /images/, when the CMS isn't configured)
 * or an already-absolute CMS media URL (e.g. "/api/media/file/...", once it is). Callers
 * shouldn't need to know which they have — resolve it once, here.
 */
export function resolveImageSrc(value: string | undefined | null): string {
  if (!value) return "";
  return value.startsWith("/") || /^https?:\/\//.test(value) ? value : `/images/${value}`;
}
