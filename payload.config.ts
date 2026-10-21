import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";

import { Agents } from "./src/payload/collections/Agents";
import { FAQs } from "./src/payload/collections/FAQs";
import { Leads } from "./src/payload/collections/Leads";
import { Listings } from "./src/payload/collections/Listings";
import { Media } from "./src/payload/collections/Media";
import { Neighbourhoods } from "./src/payload/collections/Neighbourhoods";
import { Pages } from "./src/payload/collections/Pages";
import { Posts } from "./src/payload/collections/Posts";
import { Redirects } from "./src/payload/collections/Redirects";
import { SoldProperties } from "./src/payload/collections/SoldProperties";
import { Subscribers } from "./src/payload/collections/Subscribers";
import { TaxRules } from "./src/payload/collections/TaxRules";
import { Testimonials } from "./src/payload/collections/Testimonials";
import { Users } from "./src/payload/collections/Users";
import { SiteSettings } from "./src/payload/globals/SiteSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * Payload CMS config for the real-estate content model described in
 * README.md's "Turning on the CMS" section.
 *
 * This file is valid, importable TypeScript on its own; building it with
 * `buildConfig` does not open a database connection or require any env vars.
 * A connection is only attempted when something actually calls
 * `getPayload({ config })` (the Local API, the `/admin` UI, or the
 * `/api/*` REST/GraphQL routes under `src/app/(payload)`), and only then do
 * `DATABASE_URI` / `PAYLOAD_SECRET` need to be set. Until then, the rest of
 * the app reads from `src/data/*.ts` via `src/lib/content/*`.
 */
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "",
  admin: {
    user: Users.slug,
    theme: "light",
    avatar: {
      Component: "/src/payload/components/AdminAvatar#default",
    },
    dateFormat: "d MMM yyyy",
    meta: {
      titleSuffix: " — SLIIQQUE",
      description: "SLIIQQUE Realty Studio content, listings and lead pipeline.",
      icons: [{ url: "/brand/sliiqque-mark.png" }],
    },
    components: {
      actions: ["/src/payload/components/AdminActions#default"],
      afterLogin: ["/src/payload/components/LoginFooter#default"],
      beforeLogin: ["/src/payload/components/LoginIntro#default"],
      graphics: {
        Logo: "/src/payload/components/Logo#default",
        Icon: "/src/payload/components/Icon#default",
      },
      Nav: "/src/payload/components/Nav#default",
      views: {
        dashboard: {
          Component: "/src/payload/components/Dashboard#default",
        },
      },
    },
  },
  editor: lexicalEditor(),
  collections: [
    Users,
    Media,
    Agents,
    Listings,
    SoldProperties,
    Neighbourhoods,
    Posts,
    Testimonials,
    FAQs,
    Pages,
    Leads,
    Subscribers,
    Redirects,
    TaxRules,
  ],
  globals: [SiteSettings],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  /**
   * Without this, the Media collection's `upload: true` falls back to Payload's
   * default local-disk storage. That works in local dev (files land in ./media/),
   * but Vercel's serverless functions have no persistent filesystem: anything
   * uploaded 404s in production at /api/media/file/*. If BLOB_READ_WRITE_TOKEN
   * is unset, the plugin itself falls back to local storage, so local CMS
   * testing without Blob configured still works.
   */
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, "generated-schema.graphql"),
  },
});
