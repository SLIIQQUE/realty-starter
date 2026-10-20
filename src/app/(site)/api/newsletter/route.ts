/* eslint-disable no-console */
import { NextResponse } from "next/server";
import { getResend, emailField, emailShell } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { createSubscriberToken } from "@/lib/subscriberToken";
import { BRAND } from "@/data/brand";

/**
 * CASL double opt-in (spec §5.8): this route never emails the agent or calls the CRM webhook
 * directly; it only sends the subscriber a confirmation email. The lead is only "real" (and
 * only pushed to the CRM) once they click through on /api/newsletter/confirm.
 */
interface NewsletterPayload {
  email: string;
  consent?: boolean;
  honeypot?: string;
  landingPage?: string;
  referrer?: string;
  utm?: Record<string, string>;
}

const SITE_URL = "https://realestate.sliiqque.space";
const SITE_HOST = "realestate.sliiqque.space";

export async function POST(request: Request) {
  try {
    const body: NewsletterPayload = await request.json();

    // Honeypot: silently pretend success so bots don't learn it was rejected.
    if (body.honeypot) return NextResponse.json({ success: true });

    const ip = getClientIp(request);
    if (!checkRateLimit(`newsletter:${ip}`)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    if (!body.consent) {
      return NextResponse.json({ error: "Please agree to receive emails before subscribing." }, { status: 400 });
    }

    const email = body.email?.trim();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    const resend = getResend();
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const confirmToken = createSubscriberToken(email, "confirm");
    const unsubscribeToken = createSubscriberToken(email, "unsubscribe");
    const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${confirmToken}`;
    const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

    const html = emailShell(
      "Confirm your subscription",
      [
        emailField(
          "Confirm your email",
          `<a href="${confirmUrl}" style="color:#6366f1;font-weight:700">Click here to confirm you&rsquo;d like to join the ${BRAND.siteName} list</a>.`
        ),
        emailField(
          "Why you're receiving this",
          `You're receiving this because you asked to join the ${BRAND.siteName} list at ${SITE_HOST}. If this wasn't you, ignore this email; you won't be subscribed unless you click confirm above.`
        ),
        emailField("Don't want these emails?", `<a href="${unsubscribeUrl}" style="color:#6366f1">Unsubscribe</a> at any time.`),
      ].join("")
    );

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `Confirm your subscription to ${BRAND.siteName}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send confirmation email. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter API error:", err);
    const message = err instanceof Error && err.message.includes("RESEND_API_KEY")
      ? "Email is not configured on this deployment yet."
      : "Something went wrong. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
