# SLIIQQUE Realty Starter

A reusable Canadian-realtor website template, built by SLIIQQUE Studio against the
[Real Estate Website Build Spec](../../../../Downloads/Real-Estate-Website-Build-Spec.md) (Presence / Authority
/ Command tiers). It started as a pixel-fidelity Next.js port of a third-party "Avery Estate" template under the
name `agent-brokerage-marketing`; this build renamed it, pivoted the sample content from an LA/USD concept to a
clearly-labeled Toronto/GTA demo persona ("Priya Mehta"), and implements every page, section and
production-checklist item the spec calls for.

**This is a concept/demo, not a real brokerage.** SLIIQQUE holds no real-estate licence; the agent, brokerage
name, licence number, and every listing/testimonial/sold-property shown are fictional. See `src/data/brand.ts`'s
`conceptNotice` and the banner at the top of every page for the exact framing.

See **`PRODUCTION-CHECKLIST.md`** for exactly what's implemented, what's wired but needs your own
credentials/accounts, and what's a manual agency step before a real client launch.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in what you need: see "Environment variables" below
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build/serve
```

The site runs with **zero environment variables set**. Forms return a clear "not configured" message instead
of silently failing, analytics/CMS/CRM features simply don't activate, and everything else works off the static
data in `src/data/`.

## Architecture

- **Route groups**: `src/app/(site)/` holds the entire marketing site (every page + its own `/api/*` form
  routes) with its own root layout; `src/app/(payload)/` holds the Payload CMS admin UI + REST/GraphQL API with
  *its own* root layout. This is Next.js's ["multiple root layouts"](https://nextjs.org/docs/app/building-your-application/routing/route-groups#creating-multiple-root-layouts)
  pattern, needed because Payload's admin renders its own `<html>`/`<body>`; route groups add no URL segment,
  so `src/app/(site)/about/page.tsx` still serves `/about`.
- **Design system**: hand-written CSS, no Tailwind. `src/styles/tokens.css` holds every colour/font/spacing
  variable; `base.css`/`components.css`/`pages.css` build on top of those tokens only: never hardcode a brand
  value in a component file.
- **Content layer**: every page reads from typed static arrays in `src/data/*.ts` (one file per spec §6 CMS
  collection: `properties`, `neighborhoods`, `agents`, `testimonials`, `soldProperties`, `taxRules`, etc.).
  `src/lib/content/*.ts` wraps these with the same function signatures Payload's Local API would use, so a page
  never needs to change when the CMS is switched on: see "Turning on the CMS" below.
- **i18n**: `/fr/...` is handled by `src/middleware.ts`, which rewrites the French-prefixed URL to the same page
  file and stamps an `x-locale` header; there's no duplicated `[locale]` route tree. `src/lib/i18n/getLocale.ts`
  reads that header server-side; `src/messages/{en,fr}.json` hold the translated strings for the representative
  subset of pages that are actually bilingual (nav/footer chrome everywhere, plus home/about/contact/legal/
  thank-you/FAQ headings; see `PRODUCTION-CHECKLIST.md` for the exact scope).
- **Leads**: every form (`ContactForm`, `ValuationForm`, `ViewingRequestForm`, `ListingEnquiryForm`, the footer
  newsletter form) shares the same pattern: honeypot field, per-IP rate limit (`src/lib/rateLimit.ts`), a
  required-but-unticked consent checkbox, attribution capture (`src/lib/attribution.ts`), a Resend email
  (`src/lib/email.ts`), an optional CRM webhook push (`src/lib/crm.ts`), and, once a database is connected, a
  persisted `leads` document in Payload. All five routes redirect to `/thank-you?type=...` on success, which
  fires a GA4 `generate_lead` event.

## What's implemented

Full page set per the spec's sitemap: home, about, contact, listings (+ detail, with gallery/map/mortgage
calculator/enquiry form/breadcrumbs/structured data), sold, neighbourhoods (+ detail, with market
snapshot/local FAQ), buy, sell, home valuation, book-a-viewing, insights (+ detail), reviews, team (+ profiles),
two Canadian calculators (mortgage with CMHC/bi-weekly rules, land transfer tax with real Ontario/Toronto/BC
brackets), resources/buyer+seller guides, open houses, favorites, compare, FAQ, privacy/terms/accessibility,
custom 404/500, sitemap/robots.

Plus: a real (optional) Payload CMS, a CSV lead export endpoint, a form health-check cron, working French
routing, security headers, consent-gated analytics with conversion events, and a compliance footer (agent,
brokerage, licence, regulator, REALTOR®/MLS® notice) on every page.

## Environment variables

See `.env.example` for the full list with inline comments. Nothing is required to run the demo; each var
unlocks one feature:

| Feature | Variable(s) |
|---|---|
| Transactional email (forms, newsletter) | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL` |
| Analytics | `NEXT_PUBLIC_GA_ID` |
| Search Console verification | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` |
| CRM webhook (Zapier/Follow Up Boss/etc.) | `CRM_WEBHOOK_URL` |
| Newsletter double opt-in signing | `SUBSCRIBER_TOKEN_SECRET` |
| CSV lead export auth | `ADMIN_EXPORT_TOKEN` |
| Payload CMS | `DATABASE_URI`, `PAYLOAD_SECRET` |

## Turning on the CMS

A real [Payload CMS](https://payloadcms.com) (v3) is scaffolded into this app (configured, but not required to
run). With no database configured, every page reads from the static files in `src/data/*.ts`.

1. Add to `.env.local`: `DATABASE_URI` (a Postgres connection string, e.g. from [Neon](https://neon.tech)) and
   `PAYLOAD_SECRET` (any long random string).
2. Run `npx payload migrate` to create the schema for every collection/global in `payload.config.ts`.
3. `npm run dev`, then visit `/admin` to create the first user.

Once `DATABASE_URI` is set, `src/lib/content/*.ts` and every lead API route switch to Payload's Local API
automatically: no code changes needed. The project runs React 19 (Payload 3's admin requires it), so `/admin`
renders correctly as soon as the database is connected.

### The admin workspace

`/admin` is themed end to end rather than left on Payload's default UI. `payload.config.ts` swaps in a custom
navigation, dashboard, login intro/footer, header actions and avatar; `src/payload/admin-theme.css` carries the
design system (warm cream canvas, deep-green navigation, copper accents, Playfair Display headings, Manrope body
copy). Collections are grouped editorially — Portfolio, Growth, Pipeline, Library, Settings — and list views use
custom cells for status pills, gallery thumbnails, prices and lead types. The content model, REST/GraphQL
endpoints and access rules are untouched: the redesign is presentation only.

When adding an admin component, register it in `src/app/(payload)/admin/importMap.js` as well as
`payload.config.ts`, or Payload will not be able to render it.

## Licence note

Sample property photography, the original layout measurements, and the base palette/type tokens come from the
third-party Framer template ("Avery Estate" by Webestica) this started as a port of. Replace them before using
this as a real client deliverable. Fonts (Playfair Display, Manrope) are self-hosted under the SIL Open Font
License: see `public/fonts/`. The SLIIQQUE logo marks in `public/brand/` are SLIIQQUE's own.
