/* eslint-disable no-console */
import { NextResponse } from "next/server";
import { isCmsConfigured, getCmsClient } from "@/lib/content/payloadClient";

/**
 * Lead export (spec §5.2: "Lead export: CSV export from the CMS"). Protected by a shared-secret
 * header rather than Payload admin auth so it can be hit by a script/cron/download link without
 * a logged-in admin session. Never expose this token client-side.
 */
const CSV_COLUMNS = [
  "type",
  "name",
  "email",
  "phone",
  "message",
  "sourcePage",
  "referrer",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "status",
  "createdDate",
] as const;

/** Wraps a field in double quotes (doubling any internal quotes) whenever it contains a comma,
 * quote, or newline; anything else is returned as-is. */
function csvField(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsvRow(values: unknown[]): string {
  return values.map(csvField).join(",");
}

export async function GET(request: Request) {
  const token = request.headers.get("x-export-token");
  if (!token || token !== process.env.ADMIN_EXPORT_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "CMS not configured: no leads to export." }, { status: 400 });
  }

  try {
    const payload = await getCmsClient();
    const result = await payload.find({
      collection: "leads",
      limit: 1000,
      sort: "-createdDate",
    });

    const rows = result.docs.map((doc) => {
      const d = doc as Record<string, unknown>;
      const utm = (d.utm as Record<string, unknown> | undefined) ?? {};
      return toCsvRow([
        d.type,
        d.name,
        d.email,
        d.phone,
        d.message,
        d.sourcePage,
        d.referrer,
        utm.source,
        utm.medium,
        utm.campaign,
        d.status,
        d.createdDate,
      ]);
    });

    const csv = [toCsvRow(CSV_COLUMNS as unknown as string[]), ...rows].join("\r\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="leads.csv"',
      },
    });
  } catch (err) {
    console.error("Lead export error:", err);
    return NextResponse.json({ error: "Failed to export leads." }, { status: 500 });
  }
}
