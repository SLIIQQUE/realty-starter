# Production Checklist

Mirrors §8 of `Real-Estate-Website-Build-Spec.md`, marked against this codebase's actual state:

- ✅ **Done in code**: implemented and verified (build/dev-server/manual check) in this repo.
- ⚠️ **Wired but needs your credentials/account**: the code path exists and activates automatically once you set the named env var or external account; it does nothing (or safely no-ops) until then.
- 📋 **Manual / business step**: not a code concern. Applies once this template is used for a real client, not the SLIIQQUE demo.

Do not launch a real client site until every ⚠️ is resolved and every 📋 is actually done.

---

## 8.1 Content and client inputs

- 📋 Signed scope and tier confirmed in writing
- ✅ Logo (vector): real SLIIQQUE marks in `public/brand/` (`sliiqque-logo.png`, `sliiqque-mark.png`, `sliiqque-icon-white.png`); brand colours/fonts in `src/styles/tokens.css`
- 📋 Agent bio, headshot and lifestyle photos: this demo uses fictional "Priya Mehta" + AI-generated avatar photography (`public/images/priya-mehta-headshot.jpg`, `priya-mehta-condo.jpg`); replace both with the real client's bio and real photography before a real launch
- 📋 Licence number, brokerage name and provincial regulator confirmed with the real client (demo uses placeholder values in `src/data/brand.ts`)
- 📋 Brokerage approval of the site and advertising wording
- ✅ Service areas / neighbourhoods list: 6 Toronto neighbourhoods wired end-to-end (`src/data/neighborhoods.ts`); swap for the real client's areas
- 📋 Testimonials with written permission: demo testimonials are fictional (`src/data/testimonials.ts`)
- ✅ Listing photos and details: demo data complete (`src/data/properties.ts`); replace with real listings or connect Payload
- 📋 Sold properties approved for display: demo data only (`src/data/soldProperties.ts`)
- ✅ Three+ starter blog posts: 6 written (`src/data/content.ts`)
- 📋 Contact phone, email, office address, hours confirmed with the real client
- ✅ Social profile links: wired to `BRAND.social`/footer icons; point at the real client's accounts
- 📋 Image usage rights: demo photography is template/stock; re-licence for a real deployment
- 📋 Canadian spelling/grammar pass on final client copy
- 📋 Remove all demo/placeholder content before a real launch (by design, every demo page says so)

## 8.2 Design and user experience

- ✅ Responsive: mobile-first CSS with breakpoints at 809px/1199px (`src/styles/tokens.css`, `pages.css`)
- 📋 Cross-browser check (Chrome/Safari/Firefox/Edge), not something a build can self-certify; do a manual pass
- ✅ Navigation + active states: `Header.tsx`/`Footer.tsx`, `aria-current="page"` styling
- ✅ Sticky mobile Call/Text/Email bar: `StickyMobileBar.tsx`, mobile-only via CSS media query
- ✅ Buttons/links have hover + focus-visible states: `src/styles/base.css`
- ✅ Empty states: listings filter empty-state with a "get listing alerts" form (`PropertiesExplorer.tsx`)
- ✅ Custom 404 and 500: `not-found.tsx` and `src/app/global-error.tsx`, both with a link back to home
- ✅ Favicon/app icon: `src/app/icon.png` (Next.js App Router auto-detection) from the real SLIIQQUE mark; OG share image: uses `/images/` assets per page, no single dedicated OG template image
- ✅ Loading/error states on forms: every form shows "Sending…"/inline error text

## 8.3 Functionality

- ✅ Internal links: route renames (`/properties`→`/listings` etc.) have 301 redirects in `next.config.mjs`
- ✅ Listing filters/sort: URL-based (`?area=&status=&sort=`) in `PropertiesExplorer.tsx`
- ✅ Listing gallery: keyboard-accessible, touch-friendly (native scroll/click), no custom lightbox keyboard trap
- ✅ Mortgage calculator: Canadian semi-annual compounding, bi-weekly/accelerated bi-weekly, CMHC premium tiers (`MortgageCalculator.tsx`). 📋 Spot-check its output against a bank's published calculator before relying on it for a real client
- ✅ Land transfer tax calculator: real Ontario/Toronto/BC bracket figures, "last updated" date shown (`LandTransferTaxCalculator.tsx`, `src/data/taxRules.ts`). 📋 Confirm current rates before a real launch, tax rules change
- ✅ Phone/email links: `tel:`/`mailto:` throughout
- ✅ Newsletter: double opt-in confirmation email + unsubscribe link (CASL-aware). ⚠️ Needs `RESEND_API_KEY` to actually send
- ⚠️ Search engines blocked on staging / allowed on production: `robots.ts` currently always allows; add an env-based switch before deploying a staging environment

## 8.4 Forms and leads

- ✅ Every form (contact, listing enquiry, valuation, viewing, newsletter) built and wired end to end, including the previously-orphaned listing-enquiry form (now embedded on every listing detail page)
- ⚠️ Leads inbox: persists to Payload's `leads` collection when `DATABASE_URI` is set; with no DB, leads arrive by email only (P-tier baseline, by design)
- ⚠️ Agent notification email: needs `RESEND_API_KEY` + a Resend-verified `RESEND_FROM_EMAIL`
- ✅ Auto-reply / confirmation copy: written into each route's email template
- ✅ Spam protection: honeypot field + in-memory per-IP rate limit on every lead route (`src/lib/rateLimit.ts`)
- ✅ Consent checkbox: unticked by default, links to `/privacy`, on every form
- ✅ Thank-you page: `/thank-you?type=...` fires a `generate_lead` GA4 event
- ⚠️ Form health check: `/api/health/forms` + `vercel.json` cron scaffolded; needs the project actually deployed to Vercel for the cron to fire, and `RESEND_TO_EMAIL` set for the alert
- ⚠️ CRM webhook: `src/lib/crm.ts` posts to `CRM_WEBHOOK_URL` if set; no-ops otherwise (Command tier)

## 8.5 CMS and handover readiness

- ✅ **Connected as of 2026-10-20.** `DATABASE_URI` (Neon Postgres) + `PAYLOAD_SECRET` are set in `.env.local`, and every page that renders images/content (Agents, Testimonials, Listings, Neighbourhoods, Posts, FAQs, SoldProperties) now reads through `src/lib/content/*.ts`'s `isCmsConfigured()` switch instead of importing `src/data/*.ts` directly. All seven collections are seeded (`src/app/(site)/api/admin/seed/route.ts`, a token-gated, idempotent, re-runnable migration of every static image/record into Payload's Media library + collections) and verified end to end: `npm run build` (SSG pages reach the DB at build time), and visually across home, a listing detail, a neighbourhood, and an agent profile, confirming images load from `/api/media/file/...` and rich-text descriptions/neighbourhood relationships/parking render correctly. `src/data/*.ts` remains as the static fallback (used automatically if `DATABASE_URI` is ever unset again) — do not delete it.
  - Schema additions made along the way: `Agents.gallery`, `Listings.parking` + `Listings.neighbourhood` (relationship, resolved at read time instead of duplicating neighbourhood text per listing), `Neighbourhoods.longDescription` + `.stats`. Also corrected two fields that were typed `date` but actually hold free text (`Testimonials.date`, `Listings.openHouseDates.date`) — both failed real inserts until fixed.
  - A shared `src/lib/content/richText.ts` (`lexicalToParagraphs`) now serializes every `richText` field into the plain paragraph arrays the page templates already expect; this was previously unbuilt and every mapper silently dropped rich text to `""`/`[]`.
  - Sign-in/password reset, add/edit via `/admin`, roles, required-field tightening, draft/preview/versions, 2FA, editor guide: `/admin` now renders and is fully usable (React 19 upgrade + custom themed workspace, see below), so the remaining items here are editor-workflow hardening rather than UI blockers: roles, drafts/preview/versions, 2FA and the editor guide are still 📋. Content changes today went through the Local API (the seed route), not the browser admin UI.
  - **Pre-existing data bug surfaced during verification, not caused by this migration**: `src/data/neighborhoods.ts`'s Forest Hill entry (`heroImg: "S3LSn60r6cdFpGytCZt4f7AsqFY.jpg"`) points at a mismatched tropical-beach stock photo, not a Toronto scene. Faithfully migrated as-is; 📋 swap the file before a real launch.
- ✅ **Resolved 2026-10-20**: React and React DOM were upgraded to 19.3.1 (Payload 3 requires React 19), and `/admin` was rebuilt as a custom themed workspace: custom nav, dashboard (live counts, pipeline, recent listings, content health, closed volume), login composition, header actions/avatar, editorial collection grouping and list cells. Verified in a production build at `/admin`, `/admin/login`, every collection list, listing edit, account and Site Settings. The design lives in `src/payload/admin-theme.css` plus `src/payload/components/`; the content model, REST/GraphQL endpoints and access rules were not changed.
- ⚠️ **Confirmed in this audit**: hitting `/admin` with no `DATABASE_URI`/`PAYLOAD_SECRET` set throws an unhandled `payloadInitError` and returns a raw HTTP 500, not a friendly message, low-severity (not a page a real visitor reaches), but worth a try/catch with a clean "CMS not configured" response, matching the pattern the lead-capture API routes already use. `/admin` does correctly send `noindex` either way.
- ⚠️ **No migrations run**: the standalone `payload` CLI (`npx payload migrate`) crashes on this machine's Node 22 (an `undici`/`CacheStorage` conflict unrelated to this project). Without migrations, Payload's Postgres adapter falls back to a live schema-introspection pass on cold connections (~20s observed once; fast once warm). Worth revisiting on a machine/CI image with a working CLI before a real launch, so cold starts don't pay that cost in production.
- ⚠️ **Image storage is local-disk, not cloud**: Payload's Media collection uses its default local upload directory. That's fine for this dev environment, but Vercel's serverless filesystem is ephemeral — a real deployment needs a storage adapter (`@payloadcms/storage-vercel-blob` or `-s3`) before launch, or uploaded images will vanish between deploys.

## 8.6 SEO / AEO / GEO

**Audit run 2026-10-20, fixes applied same day.** Findings were live-render-verified (curl against a running
server, inspecting actual `<head>`/`<body>` output), not just inferred from source — several earlier ✅ lines in
this section turned out to be wrong on inspection. Every item below marked ✅ **(fixed 2026-10-20)** was
re-verified live after the fix, against a `next start` production build (64/64 pages, clean `tsc`/lint/build).

- ✅ Unique title/meta description per page (`generateMetadata`/`export const metadata` throughout; 32/33 pages, only `/404` lacks it, which is fine — it's a redirect page, not a real route)
- ✅ One H1 per page (via `SplitHeading as="h1"` convention), confirmed across all 33 pages
- ✅ Image alt text: 26/26 `Image`/`img` usages have `alt=`, descriptive where meaningful, empty for decorative
- ✅ Redirects from old route names: `next.config.mjs`
- ✅ **(fixed 2026-10-20) Canonical URLs.** Root cause: Next's metadata merge (`node_modules/next/dist/lib/metadata/resolve-metadata.js:144-148`) replaces the entire `alternates` object per route segment rather than deep-merging it, so every page that didn't set its own `alternates.canonical` either inherited the homepage's (≈25 routes — confirmed live, `/listings/the-dunvegan-house` rendered `<link rel="canonical" href=".../">`, the homepage) or lost it entirely (the 8 pages that set `alternates.languages` without `canonical`). Fixed via a new `pageAlternates(path, { languages? })` helper (`src/lib/seo.ts`), now called from every page's metadata export with that page's own absolute URL. Re-verified live: `/listings` → canonical `.../listings`; `/listings/the-kew-beach-house` → canonical `.../listings/the-kew-beach-house`; `/neighbourhoods/yorkville` → canonical `.../neighbourhoods/yorkville`; `/team/priya-mehta` → canonical `.../team/priya-mehta`.
- ✅ **(fixed 2026-10-20) Open Graph / Twitter identity per page.** Root cause: same full-replace behaviour as `alternates` applies to `openGraph` and `twitter` too (confirmed in the same merge switch) — the 5 dynamic detail routes (`about`, `insights/[slug]`, `listings/[slug]`, `neighbourhoods/[slug]`, `team/[slug]`) only ever returned `{ title, description }`, so every listing/neighbourhood/post/agent page showed the generic homepage identity in `og:title`/`og:description`/`og:url`/`twitter:title` to social crawlers and link-preview bots. Fixed via a new `pageSocial({ title, description, path, image? })` helper that sets `openGraph`+`twitter` together (never one without the other, since each resets independently) on every page, not just the 5 flagged ones. Re-verified live on `/listings/the-kew-beach-house`: `og:title`/`og:url`/`twitter:title` all correctly show the listing's own identity.
- ✅ **(fixed 2026-10-20) Open Graph image**, for the three content types that have a real photo: listings, agent profiles, and neighbourhood guides now pass their own hero image into `pageSocial`'s new `image` option — confirmed live, `/listings/the-kew-beach-house` renders `og:image` pointing at that listing's actual CMS photo. Static/info pages (contact, faq, etc.) still have none; 📋 a single shared template image for those is still worth adding for a real client.
  - Fixing this also surfaced and fixed a related latent bug in `realEstateListingSchema()`'s `image` field: it hardcoded a `/images/` prefix, which silently produced a broken double-prefixed URL (`/images//api/media/file/...`) once a listing's photo comes from the CMS rather than static data. Now goes through `resolveImageSrc()` like every other image field in the codebase.
- ✅ **(fixed 2026-10-20) AEO: FAQ schema on pages with a visible FAQ accordion that lacked it.** The homepage's `HOME_FAQS` accordion and the per-neighbourhood `localFaqs` accordion (parking/commute/schools Q&A, discovered during this fix — same gap, not previously documented) now both emit matching `FAQPage` JSON-LD via the existing `faqSchema()` helper, consistent with `/faq`.
- ✅ **(fixed 2026-10-20) GEO/crawl-budget**: `robots.ts` now disallows `/admin` and `/api/` for all user agents, instead of relying solely on Payload's per-page `noindex` (still present, now defense-in-depth rather than the only control).
- ✅ **(fixed 2026-10-20) `sitemap.ts` freshness signal.** Replaced `lastModified: new Date()` (evaluated fresh on every request — every page looked "modified right now," forever) with: a hand-maintained `STATIC_CONTENT_LAST_UPDATED` constant for static routes, each blog post's own real `date` field for `/insights/[slug]`, and **no** `lastModified` at all for listings/neighbourhoods/agents, since no genuine modified-date field exists for them in either the static data or the CMS mapping — omitting an unknown value is more honest than fabricating `new Date()` for it. Re-verified live: 30 `<lastmod>` entries now in `sitemap.xml` (static routes + posts), none on the omitted types.
- ✅ **(fixed 2026-10-20) Neighbourhood pages now carry their own JSON-LD** — a new `placeSchema()` helper (`Place`, nested in `City`/`Toronto` → `State`/`Ontario`) plus the `FAQPage` schema above, instead of only the inherited site-wide schema + `BreadcrumbList`.
- ✅ **(fixed 2026-10-20) Blog post E-E-A-T signals**: `/insights/[slug]` now shows a visible "By Priya Mehta" byline next to the category/date line (previously only in the `Article` schema's `author` field, never shown to readers), and `articleSchema()` now includes `dateModified` (equal to `datePublished`, since no real edit-history exists for this demo content — valid schema.org shorthand for "unchanged since publish," not a fabrication). Internal contextual links within article bodies are still not added — that's a content-editorial task, not a technical fix, and is left open.
- ✅ **(fixed 2026-10-20) `/favorites` and `/compare`**: both dropped from `sitemap.ts` and given `robots: { index: false }`, since both show only whatever the visitor has stored in their own browser — no unique content for an anonymous crawler to index.
- ✅ **(fixed 2026-10-20) GEO: added `public/llms.txt`**, a plain-text summary of the site and its core pages for LLM/answer-engine crawlers, with the same concept-demo disclosure the rest of the site already carries.
- 🟡 **Still open**: i18n/hreflang metadata localization. `/fr/...` middleware rewrite and `<html lang="fr">` are correct (confirmed live), but page-level `<title>`/meta description aren't locale-aware — `/fr/about` still renders `<title>About | SLIIQQUE</title>` in English. Fixing this properly means converting ~6 pages from static `export const metadata` to async `generateMetadata` (to call `getLocale()`) plus writing genuine French title/description copy for each — a larger, more content-driven change than the rest of this pass, deliberately left open rather than rushed.
- ✅ Structured data foundations: `Organization`, `WebSite`, `RealEstateAgent` site-wide; `FAQPage` on `/faq`, homepage, and every neighbourhood; `Product`/`Offer` (listing) + `BreadcrumbList` on listing pages; `Article` + `BreadcrumbList` on insight posts; `Place` + `BreadcrumbList` + `FAQPage` on neighbourhood pages; deliberately **no** `Review`/`AggregateRating` schema (see `src/app/(site)/reviews/page.tsx`, no verified permission records to back a public rating claim) — this restraint is good practice, not a gap.
- ✅ Sitemap + robots registration: `sitemap.ts` (dynamic, includes every static + CMS-backed route); `robots.ts` correctly registered at `src/app/robots.ts` (see audit log for the earlier routing bug, now fixed)
- ✅ Neighbourhood pages: unique written content per area, not templated/copied
- 📋 Google Business Profile: a real client's business, not applicable to this demo
- 📋 Search Console / Bing Webmaster: ⚠️ `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env var wired into metadata; verify + submit once deployed

## 8.7 Performance

- 📋 Mobile Lighthouse / real-device check: not run as part of this build; recommended before launch (dev tooling here doesn't include a Lighthouse CI step)
- ✅ Images: `next/image` throughout (zero raw `<img>` tags remain for content images), `fill` + explicit `sizes` for responsive crops, `priority` on each page's above-the-fold hero image
- ✅ Fonts: self-hosted woff2 (Playfair Display, Manrope), no external font CDN round-trip
- ✅ No unused third-party scripts: GA4 only loads when `NEXT_PUBLIC_GA_ID` is set AND the visitor has accepted cookies
- ⚠️ Caching/image optimization on production: this is Vercel's job once deployed; nothing to configure locally beyond what's already in `next.config.mjs`
- ⚠️ **Trade-off worth knowing**: the `/fr` locale feature uses middleware + `headers()`, which makes most pages render dynamically (`ƒ`) instead of statically (`○`) per Next's build output. This is the cost of the bilingual feature, acceptable for a demo, worth re-measuring against the LCP/INP/CLS targets on a real deployment

## 8.8 Accessibility

- ✅ Keyboard navigation + visible focus: global `:focus-visible` rule (`src/styles/base.css`), skip-to-content link
- ✅ Colour contrast: token palette checked against WCAG AA for body text/buttons (not independently audited by a contrast-checking tool as part of this build, 📋 spot check)
- ✅ Alt text: descriptive vs `alt=""` throughout, per the pattern above
- ✅ Form labels + error messages: every form uses `<label htmlFor>` pairs and inline error text
- ✅ Skip-to-content link: in `src/app/(site)/layout.tsx`
- ✅ Reduced-motion: `@media (prefers-reduced-motion: reduce)` disables scroll-reveal animation
- 📋 Screen-reader test pass: not run as part of this build; recommended before launch
- ✅ Accessibility statement: `/accessibility`, with a contact route

## 8.9 Legal and compliance

- ✅ Compliance footer: agent name, title, brokerage, licence number, regulator (linked), REALTOR®/MLS® trademark notice, shown on **every page** via the global `Footer.tsx`
- ✅ REALTOR®/MLS® wording: `BRAND.trademarkNotice`, used in the footer and `/terms`. 📋 Have the real brokerage/CREA confirm exact wording before a real launch
- ✅ No US-only items: confirmed no "Equal Housing"/DRE references anywhere
- ✅ Privacy policy: PIPEDA-aware language + a Quebec Law 25 note (`/privacy`)
- ✅ Terms of use: published (`/terms`), including calculator "estimate only" disclaimers
- ✅ Cookie notice: shown before any non-essential cookie loads; GA4 is gated on acceptance
- ✅ Newsletter: express opt-in (unticked checkbox) + double opt-in confirmation + unsubscribe link in every email (CASL)
- 📋 Listing data source rights: applies once real MLS®/IDX or brokerage data is connected
- ✅ Calculators: both carry an explicit "estimate only, not legal/tax/financial advice" disclaimer
- 📋 Counsel/brokerage sign-off on final wording, do this before a real launch, every legal page here says "v0.1 draft, review before relying on it"

## 8.10 Security

- ⚠️ HTTPS: Vercel's job once deployed; nothing to configure here
- ✅ Security headers: HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP (`next.config.mjs`)
- ✅ **Fixed 2026-10-20**: the CSP's `script-src` had no `'unsafe-eval'`, which Next's dev-mode Fast Refresh runtime requires to apply hot updates via `eval()`. The browser silently blocked it with an uncaught `EvalError` on every page load in `next dev`, which broke **all client-side React hydration** site-wide, not just one component: every `useEffect`, event handler, and piece of interactivity silently never ran, with no visible error on the page itself (only a CSP violation in the browser console). `npm run build`/`npm run start` were never affected, since production doesn't use eval-based HMR — that's why this went unnoticed until actually testing interactive dev-mode behavior. `script-src`/`connect-src` now relax `'unsafe-eval'`/`ws:` only when `NODE_ENV === "development"`; the production policy is unchanged.
- ✅ Rate limits: per-IP, per-route, in-memory (`src/lib/rateLimit.ts`). 📋 Note: in-memory state doesn't share across serverless instances; move to Upstash Redis or similar for a real multi-region production deployment
- ⚠️ No secrets in the repo: confirmed `.env.example` only ever holds placeholder values; set real secrets as Vercel environment variables, never commit `.env.local`
- 📋 Admin passwords / 2FA: applies once `/admin` is actually used with a real DB
- ✅ Debug routes / sample data: none found; the "concept demo" framing is the intentional, disclosed sample-data posture, not leftover debug scaffolding
- ⚠️ Dependency audit: `npm audit` currently reports 15 advisories (6 moderate, 9 high). 11 are `devDependencies` only (Payload's `drizzle-kit`→`esbuild`, and `sass`/`chokidar` pulled in by Payload's build tooling and `eslint-config-next`'s `fast-glob`) and never ship to production. The one production-relevant issue is a **high**-severity `postcss` advisory (XSS in CSS stringification, source-map path traversal) pulled in transitively by `next` itself: the only fix is `next@16`, a breaking major-version jump not applied in this build. Re-run `npm audit` before a real launch and re-evaluate the Next 16 upgrade then.

## 8.11 Analytics and tracking

- ⚠️ Analytics: GA4 wired, consent-gated; needs `NEXT_PUBLIC_GA_ID` to activate
- ✅ Conversion events: `generate_lead` (per form type, fired on `/thank-you`), `click_to_call`/`click_to_text`/`click_to_email` on header/footer/sticky-bar phone links
- ⚠️ Search Console: needs `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` + manual verification
- 📋 Internal traffic exclusion: configure in GA4's own admin once a real `NEXT_PUBLIC_GA_ID` exists
- 📋 Ad pixels: none added (out of scope unless a real client requests one)

## 8.12 Infrastructure, domain and email

- 📋 Domain registration, DNS (SPF/DKIM/DMARC), www/non-www redirect: all real-deployment steps, not code
- ⚠️ Database: Neon Postgres (or any Postgres) via `DATABASE_URI`; `npx payload migrate` once connected
- ✅ Environment separation: `.env.example` documents every var; Vercel's own preview/production env separation applies once deployed
- 📋 Backup/restore test: applies once a real database exists
- 📋 Error monitoring (Sentry) / uptime monitoring: not added (Authority-tier item, not built here)
- ⚠️ Transactional email test from the real domain, do this once `RESEND_FROM_EMAIL` points at a Resend-verified real domain

## 8.13–8.15 Launch day / after launch / handover

All 📋: these are process steps for a real client engagement, not something a codebase can satisfy on its own. Use this file itself as the launch-day final check against the "✅ Done in code" items above.

---

## Audit log

**2026-10-20**: Ran this checklist against a live build (`npm run build && npm run start`), not just read it. Verified empirically: security headers, `robots.txt`, `sitemap.xml` + a sample of its URLs, form validation/honeypot/rate-limit/consent on all five lead routes, the "not configured" fallback message with no `RESEND_API_KEY`, `/api/health/forms`, `/api/leads/export` auth, GA4's env-gating, JSON-LD presence, `npm run lint`, and `npm audit`. One real bug found and fixed, one new gap logged, one doc claim corrected:

1. **Fixed**: `robots.ts` lived at `src/app/(site)/robots.ts` and silently never registered as a route (confirmed via `.next/server/app-paths-manifest.json`, it was simply absent, while `sitemap.ts` in the same directory worked fine). `/robots.txt` had been 404ing since this project's first commit, meaning no deployment of it ever actually told crawlers anything. Moved it to `src/app/robots.ts` (outside both `(site)`/`(payload)` route groups); confirmed `/robots.txt` now returns `200 text/plain` with the expected rules + sitemap reference.
2. **New gap logged**: `/admin` throws an unhandled 500 (`payloadInitError`) instead of a friendly message when `DATABASE_URI`/`PAYLOAD_SECRET` are unset. See §8.5.
3. **Doc correction**: §8.6 overstated the sitemap's locale coverage; it lists canonical URLs only. Per-page `hreflang` `<link>` tags (the mechanism that actually matters for SEO) are present and correct, so this doesn't affect real SEO, just the accuracy of this file.
4. **Confirmed accurate as documented**: all §8.4 form behaviors, §8.10 security headers/rate limiting, §8.11 GA4 gating, §8.6 structured data, `npm run lint` (clean), and the `/accessibility`, `/privacy`, `/terms`, custom-404 routes (all 200).
5. `npm audit` findings added to §8.10 (see above), not previously quantified in this file.

## Known gaps worth closing before a real client launch

1. **Payload collection hardening**: required fields, draft/preview/versions, and role-based access control aren't configured yet (collections exist, but the "editor-first admin, required fields enforced" P-tier promise isn't fully met).
2. **Payload collection hardening**: required fields, draft/preview/versions, and role-based access control aren't configured yet (collections exist, and the themed admin now renders correctly, but the "editor-first admin, required fields enforced" P-tier promise isn't fully met).
3. **In-memory rate limiting**: fine for a single demo instance, not for multi-region production.
4. **French coverage**: only the chrome (nav/footer) plus home/about/contact/legal/thank-you/FAQ headings are translated, per the agreed "representative subset" scope, not the full site.
5. **No dedicated OG share-image template**: pages reuse content photography instead of a generated 1200×630 card.
