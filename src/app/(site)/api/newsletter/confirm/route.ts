/* eslint-disable no-console */
import { NextResponse } from "next/server";
import { verifySubscriberToken } from "@/lib/subscriberToken";
import { getResend, emailField, emailShell } from "@/lib/email";
import { sendToCrmWebhook } from "@/lib/crm";
import { BRAND } from "@/data/brand";
import { isCmsConfigured, getCmsClient } from "@/lib/content/payloadClient";

function page(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}: ${BRAND.siteName}</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #F2EFE6; font-family: -apple-system, "Segoe UI", sans-serif; color: #0E1510; }
  .card { max-width: 440px; margin: 40px; padding: 40px; border-radius: 20px; background: #fff; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,.08); }
  h1 { font-size: 22px; margin: 0 0 12px; }
  p { color: #6B6B5C; font-size: 15px; line-height: 1.5; margin: 0 0 24px; }
  a { display: inline-block; padding: 12px 24px; border-radius: 30px; background: #0C2B1F; color: #fff; text-decoration: none; font-size: 14px; }
</style></head>
<body><div class="card"><h1>${title}</h1><p>${message}</p><a href="/">Back to ${BRAND.siteName}</a></div></body></html>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || "";
  const result = verifySubscriberToken(token);

  if (!result || result.action !== "confirm") {
    return new NextResponse(
      page("Link expired or invalid", "This confirmation link is no longer valid. Please subscribe again from the site to get a new one."),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    const resend = getResend();
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const toEmail = process.env.RESEND_TO_EMAIL || "hello@sliiqque.space";
    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `New confirmed subscriber: ${result.email}`,
      html: emailShell("Newsletter: confirmed subscriber", emailField("Email", result.email)),
    });
  } catch (err) {
    console.error("Newsletter confirm notify error:", err);
  }

  await sendToCrmWebhook({ type: "newsletter", email: result.email, consentTimestamp: new Date().toISOString() });

  if (isCmsConfigured()) {
    try {
      const payload = await getCmsClient();
      await payload.create({
        collection: "leads",
        data: {
          type: "newsletter",
          email: result.email,
          message: "Confirmed newsletter double opt-in.",
          consentText: `I agree to receive emails from ${BRAND.siteName} and have read the Privacy Policy.`,
          consentTimestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error("Failed to persist lead to CMS:", err);
      // never fail the request over this: the subscriber is already confirmed/notified
    }
  }

  return new NextResponse(
    page("You're confirmed", `${result.email} is now subscribed to the ${BRAND.siteName} list. You can unsubscribe at any time from the link in any email we send.`),
    { headers: { "Content-Type": "text/html" } }
  );
}
