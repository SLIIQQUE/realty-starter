/* eslint-disable no-console */
import { NextResponse } from "next/server";
import { getResend, emailField, emailShell } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sendToCrmWebhook } from "@/lib/crm";
import { isCmsConfigured, getCmsClient } from "@/lib/content/payloadClient";

interface ContactPayload {
  topic: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  consent?: boolean;
  honeypot?: string;
  landingPage?: string;
  referrer?: string;
  utm?: Record<string, string>;
}

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json();

    // Honeypot: silently pretend success so bots don't learn it was rejected.
    if (body.honeypot) return NextResponse.json({ success: true });

    const ip = getClientIp(request);
    if (!checkRateLimit(`contact:${ip}`)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    if (!body.consent) {
      return NextResponse.json({ error: "Please agree to be contacted before submitting." }, { status: 400 });
    }

    if (!body.firstName?.trim() || !body.lastName?.trim() || !body.email?.trim()) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const resend = getResend();
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const toEmail = process.env.RESEND_TO_EMAIL || "hello@sliiqque.space";

    const html = emailShell(
      "New contact form submission",
      [
        emailField("Topic", body.topic),
        emailField("Name", `${body.firstName} ${body.lastName}`),
        emailField("Email", body.email),
        emailField("Phone", body.phone),
        emailField("Budget range", body.budget),
        emailField("Timeline", body.timeline),
        emailField("Message", body.message),
        emailField("Landing page", body.landingPage),
        emailField("Referrer", body.referrer),
      ].join("")
    );

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: body.email,
      subject: `Concept site contact: ${body.firstName} ${body.lastName}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
    }

    await sendToCrmWebhook({ type: "contact", ...body, consentTimestamp: new Date().toISOString() });

    if (isCmsConfigured()) {
      try {
        const payload = await getCmsClient();
        await payload.create({
          collection: "leads",
          data: {
            type: "contact",
            name: `${body.firstName} ${body.lastName}`.trim(),
            email: body.email,
            phone: body.phone,
            message: [body.topic && `Topic: ${body.topic}`, body.budget && `Budget: ${body.budget}`, body.timeline && `Timeline: ${body.timeline}`, body.message]
              .filter(Boolean)
              .join("\n"),
            sourcePage: body.landingPage,
            referrer: body.referrer,
            utm: { source: body.utm?.utm_source, medium: body.utm?.utm_medium, campaign: body.utm?.utm_campaign },
            consentText: "I agree to be contacted about my enquiry and have read the Privacy Policy.",
            consentTimestamp: new Date().toISOString(),
          },
        });
      } catch (err) {
        console.error("Failed to persist lead to CMS:", err);
        // never fail the request over this: email already sent, which is the P-tier baseline
      }
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Contact API error:", err);
    const message = err instanceof Error && err.message.includes("RESEND_API_KEY")
      ? "Email is not configured on this deployment yet."
      : "Something went wrong. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
