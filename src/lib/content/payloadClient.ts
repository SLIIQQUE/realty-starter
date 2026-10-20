/**
 * Shared helper for every file in `src/lib/content/`. The site works with
 * zero database configured: as long as `DATABASE_URI` is unset, every
 * content-area function below falls back to the static arrays in
 * `src/data/*.ts`, unchanged. Once `DATABASE_URI` (and `PAYLOAD_SECRET`) are
 * set, these functions read from Payload's Local API instead.
 */

export function isCmsConfigured(): boolean {
  return Boolean(process.env.DATABASE_URI);
}

/**
 * Lazily imports `payload` and the root config so that neither is pulled
 * into the bundle (or evaluated) for a build/request that never needs the
 * CMS. Only call this after checking `isCmsConfigured()`.
 */
export async function getCmsClient() {
  const [{ getPayload }, configModule] = await Promise.all([
    import("payload"),
    import("@payload-config"),
  ]);
  return getPayload({ config: configModule.default });
}
