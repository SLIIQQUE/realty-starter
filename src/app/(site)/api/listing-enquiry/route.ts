/* eslint-disable no-console */
import { NextResponse } from "next/server";
import { getResend, emailField, emailShell } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sendToCrmWebhook } from "@/lib/crm";
import { isCmsConfigured, getCmsClient } from "@/lib/content/payloadClient";

interface ListingEnquiryPayload {
  listingSlug: string;
  listingAddress: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  consent?: boolean;
  honeypot?: string;
  landingPage?: string;
  referrer?: string;
  utm?: Record<string, string>;
}

export async function POST(request: Request) {
  try {
    const body: ListingEnquiryPayload = await request.json();

    // Honeypot: silently pretend success so bots don't learn it was rejected.
    if (body.honeypot) return NextResponse.json({ success: true });

    const ip = getClientIp(request);
    if (!checkRateLimit(`listing-enquiry:${ip}`)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    if (!body.consent) {
      return NextResponse.json({ error: "Please agree to be contacted before submitting." }, { status: 400 });
    }

    if (!body.name?.trim() || !body.email?.trim() || !body.listingAddress?.trim()) {
      return NextResponse.json({ error: "Name, email, and listing address are required." }, { status: 400 });
    }

    const resend = getResend();
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const toEmail = process.env.RESEND_TO_EMAIL || "hello@sliiqque.space";

    const html = emailShell(
      "New listing enquiry",
      [
        emailField("Listing", body.listingAddress),
        emailField("Listing slug", body.listingSlug),
        emailField("Name", body.name),
        emailField("Email", body.email),
        emailField("Phone", body.phone),
        emailField("Message", body.message),
        emailField("Landing page", body.landingPage),
        emailField("Referrer", body.referrer),
      ].join("")
    );

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: body.email,
      subject: `Listing enquiry: ${body.listingAddress}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send enquiry. Please try again." }, { status: 500 });
    }

    await sendToCrmWebhook({ type: "listing-enquiry", ...body, consentTimestamp: new Date().toISOString() });

    if (isCmsConfigured()) {
      try {
        const payload = await getCmsClient();
        await payload.create({
          collection: "leads",
          data: {
            // Leads.type options are contact/listing/valuation/viewing/newsletter: "listing" is the
            // listing-enquiry type.
            type: "listing",
            name: body.name,
            email: body.email,
            phone: body.phone,
            // listingRef is a Payload relationship to the `listings` collection, but this route only
            // receives a slug/address; resolving that to a document ID would need an extra query, so
            // we just note the listing in the message instead of over-engineering a slug->ID resolution.
            message: [`Listing: ${body.listingAddress} (${body.listingSlug})`, body.message].filter(Boolean).join("\n"),
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
    console.error("Listing enquiry API error:", err);
    const message = err instanceof Error && err.message.includes("RESEND_API_KEY")
      ? "Email is not configured on this deployment yet."
      : "Something went wrong. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
