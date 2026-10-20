/* eslint-disable no-console */
import { NextResponse } from "next/server";
import { getResend, emailField, emailShell } from "@/lib/email";
import { isCmsConfigured, getCmsClient } from "@/lib/content/payloadClient";

/**
 * Form health check (spec §5.2: "daily automated test submission that alerts you if routing
 * fails"). Rather than actually submitting a fake lead through the public forms (which would
 * pollute the CRM/CMS with test data and spam the inbox every day), this checks the three things
 * that would silently break every form at once: the Resend API key, the CMS connection (only
 * when a CMS is configured; this is still a valid P-tier deployment without one), and the
 * newsletter double opt-in signing secret.
 *
 * Status code: this intentionally always returns 200, even when degraded. It's hit by a cron
 * (see vercel.json) and may also sit behind uptime monitoring; a non-2xx here would make an
 * uptime monitor report the SITE as down when really just one sub-check (e.g. a missing env var)
 * failed. The response body's `status` field carries the real result, and a failing check also
 * triggers an email alert, which is the actual "tell a human" mechanism for this feature.
 */
interface CheckResult {
  ok: boolean;
  detail?: string;
}

export async function GET() {
  const checks: Record<string, CheckResult> = {};

  checks.resendApiKey = process.env.RESEND_API_KEY
    ? { ok: true }
    : { ok: false, detail: "RESEND_API_KEY is not set: contact/valuation/viewing/listing forms cannot send email." };

  if (isCmsConfigured()) {
    try {
      const payload = await getCmsClient();
      await payload.find({ collection: "leads", limit: 1 });
      checks.cms = { ok: true };
    } catch (err) {
      checks.cms = {
        ok: false,
        detail: err instanceof Error ? `CMS lookup failed: ${err.message}` : "CMS lookup failed.",
      };
    }
  } else {
    checks.cms = { ok: true, detail: "CMS not configured: running on static-file fallback, which is expected." };
  }

  checks.subscriberTokenSecret = process.env.SUBSCRIBER_TOKEN_SECRET
    ? { ok: true }
    : { ok: false, detail: "SUBSCRIBER_TOKEN_SECRET is not set: newsletter double opt-in is using an insecure dev fallback." };

  const failed = Object.entries(checks).filter(([, result]) => !result.ok);
  const status = failed.length === 0 ? "ok" : "degraded";

  if (failed.length > 0) {
    try {
      const resend = getResend();
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      const toEmail = process.env.RESEND_TO_EMAIL || "hello@sliiqque.space";
      const html = emailShell(
        "Form health check failed",
        failed.map(([name, result]) => emailField(name, result.detail ?? "Failed.")).join("")
      );
      await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        subject: "⚠️ Form health check failed",
        html,
      });
    } catch (err) {
      // Guarded: a broken Resend key must not crash the very check that's trying to detect it.
      console.error("Form health check alert email failed to send:", err);
    }
  }

  return NextResponse.json({ status, checks }, { status: 200 });
}
