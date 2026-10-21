/* eslint-disable no-console */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getCmsClient, isCmsConfigured } from "@/lib/content/payloadClient";

/**
 * One-time migration: re-uploads every existing Media doc's file through the
 * now-configured Vercel Blob storage adapter, so each doc's stored file
 * actually exists somewhere a production serverless function can read.
 *
 * Source lookup, in order:
 *  1. ./media/<filename> — Payload's previous local-disk storage location.
 *  2. ./public/images/<filename> — the original seed source. Falls back here
 *     (stripping any Payload-added "-1"/"-2" collision suffix first) because
 *     the Blob adapter's post-upload cleanup empties ./media as docs migrate.
 *
 * Protected by the same shared-secret header pattern as /api/leads/export.
 * Safe to re-run; delete this route once the migration has been confirmed.
 */
function resolveSourcePath(mediaDir: string, imagesDir: string, filename: string): string | null {
  const mediaPath = path.join(mediaDir, filename);
  if (fs.existsSync(mediaPath)) return mediaPath;

  const imagesPath = path.join(imagesDir, filename);
  if (fs.existsSync(imagesPath)) return imagesPath;

  // Payload appends "-1", "-2", etc. before the extension to avoid overwriting
  // an existing doc with the same filename; the seed source has no suffix.
  const deSuffixed = filename.replace(/-\d+(\.\w+)$/, "$1");
  if (deSuffixed !== filename) {
    const deSuffixedPath = path.join(imagesDir, deSuffixed);
    if (fs.existsSync(deSuffixedPath)) return deSuffixedPath;
  }

  return null;
}

export async function POST(request: Request) {
  const token = request.headers.get("x-export-token");
  if (!token || token !== process.env.ADMIN_EXPORT_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "CMS not configured" }, { status: 400 });
  }

  const payload = await getCmsClient();
  const mediaDir = path.join(process.cwd(), "media");
  const imagesDir = path.join(process.cwd(), "public", "images");

  const { docs } = await payload.find({ collection: "media", limit: 1000, depth: 0 });

  const migrated: { filename: string; source: string }[] = [];
  const skipped: { filename: string | null; id: string | number; reason: string }[] = [];

  for (const doc of docs) {
    const filename = (doc as { filename?: string }).filename ?? null;
    if (!filename) {
      skipped.push({ filename, id: doc.id, reason: "no filename" });
      continue;
    }
    const sourcePath = resolveSourcePath(mediaDir, imagesDir, filename);
    if (!sourcePath) {
      skipped.push({ filename, id: doc.id, reason: "no source file found" });
      continue;
    }
    try {
      await payload.update({
        collection: "media",
        id: doc.id,
        data: {},
        filePath: sourcePath,
      });
      migrated.push({ filename, source: path.relative(process.cwd(), sourcePath) });
    } catch (err) {
      skipped.push({ filename, id: doc.id, reason: err instanceof Error ? err.message : String(err) });
    }
  }

  return NextResponse.json({
    total: docs.length,
    migratedCount: migrated.length,
    migrated,
    skippedCount: skipped.length,
    skipped,
  });
}
