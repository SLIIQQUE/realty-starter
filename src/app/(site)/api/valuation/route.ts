/* eslint-disable no-console */
import { NextResponse } from "next/server";
import { getResend, emailField, emailShell } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sendToCrmWebhook } from "@/lib/crm";
import { isCmsConfigured, getCmsClient } from "@/lib/content/payloadClient";

interface ValuationPayload {
  address: string;
  propertyType?: string;
  beds?: string;
  baths?: string;
  condition?: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  consent?: boolean;
  honeypot?: string;
  landingPage?: string;
  referrer?: string;
  utm?: Record<string, string>;
}

export async function POST(request: Request) {
  try {
    const body: ValuationPayload = await request.json();

    // Honeypot: silently pretend success so bots don't learn it was rejected.
    if (body.honeypot) return NextResponse.json({ success: true });

    const ip = getClientIp(request);
    if (!checkRateLimit(`valuation:${ip}`)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    if (!body.consent) {
      return NextResponse.json({ error: "Please agree to be contacted before submitting." }, { status: 400 });
    }

    if (!body.address?.trim() || !body.name?.trim() || !body.email?.trim()) {
      return NextResponse.json({ error: "Address, name, and email are required." }, { status: 400 });
    }

    const resend = getResend();
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const toEmail = process.env.RESEND_TO_EMAIL || "hello@sliiqque.space";

    const html = emailShell(
      "New valuation request",
      [
        emailField("Address", body.address),
        emailField("Property type", body.propertyType),
        emailField("Beds / Baths", [body.beds, body.baths].filter(Boolean).join(" / ")),
        emailField("Condition", body.condition),
        emailField("Name", body.name),
        emailField("Email", body.email),
        emailField("Phone", body.phone),
        emailField("Notes", body.notes),
        emailField("Landing page", body.landingPage),
        emailField("Referrer", body.referrer),
      ].join("")
    );

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: body.email,
      subject: `Valuation request: ${body.address}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send request. Please try again." }, { status: 500 });
    }

    await sendToCrmWebhook({ type: "valuation", ...body, consentTimestamp: new Date().toISOString() });

    if (isCmsConfigured()) {
      try {
        const payload = await getCmsClient();
        await payload.create({
          collection: "leads",
          data: {
            type: "valuation",
            name: body.name,
            email: body.email,
            phone: body.phone,
            message: [
              `Address: ${body.address}`,
              body.propertyType && `Property type: ${body.propertyType}`,
              (body.beds || body.baths) && `Beds/Baths: ${[body.beds, body.baths].filter(Boolean).join(" / ")}`,
              body.condition && `Condition: ${body.condition}`,
              body.notes,
            ]
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
    console.error("Valuation API error:", err);
    const message = err instanceof Error && err.message.includes("RESEND_API_KEY")
      ? "Email is not configured on this deployment yet."
      : "Something went wrong. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
