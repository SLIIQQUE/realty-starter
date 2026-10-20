import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/properties", destination: "/listings", permanent: true },
      { source: "/properties/:slug", destination: "/listings/:slug", permanent: true },
      { source: "/neighborhoods", destination: "/neighbourhoods", permanent: true },
      { source: "/neighborhoods/:slug", destination: "/neighbourhoods/:slug", permanent: true },
      { source: "/valuation", destination: "/home-valuation", permanent: true },
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:slug", destination: "/insights/:slug", permanent: true },
      { source: "/faqs", destination: "/faq", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-conditions", destination: "/terms", permanent: true },
    ];
  },
  // Security headers (spec §5.7/§8.10). CSP is intentionally permissive on img-src/connect-src
  // since the map view pulls OpenStreetMap tiles and the mortgage/analytics scripts are loaded
  // conditionally from a small, known set of hosts.
  async headers() {
    // Next's dev-mode Fast Refresh runtime applies hot updates via eval(), and the dev client
    // talks to the dev server over a same-origin websocket — both are blocked by the strict
    // production CSP below, which silently breaks ALL client-side hydration in `next dev` (every
    // useEffect/useState/event handler on every page, not just one component) without ever
    // showing a visible error on the page itself, only a CSP violation in the console. Production
    // builds don't use eval-based HMR, so the strict policy is unaffected there.
    const isDev = process.env.NODE_ENV === "development";
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com"
      : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com";
    const connectSrc = isDev
      ? "connect-src 'self' ws: https://www.google-analytics.com https://*.tile.openstreetmap.org"
      : "connect-src 'self' https://www.google-analytics.com https://*.tile.openstreetmap.org";

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              scriptSrc,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              connectSrc,
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

// Wraps the config for the Payload admin UI / REST / GraphQL routes under
// src/app/(payload). This only configures bundler aliasing and headers for
// those routes; it does not open a database connection or require
// DATABASE_URI/PAYLOAD_SECRET at build or boot time.
export default withPayload(nextConfig, { devBundleServerPackages: false });
