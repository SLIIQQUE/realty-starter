"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAttribution } from "@/lib/attribution";

type Status = "idle" | "sending" | "error";

export default function ListingEnquiryForm({ listingSlug, listingAddress }: { listingSlug: string; listingAddress: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/listing-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingSlug,
          listingAddress,
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          message: fd.get("message"),
          consent: fd.get("consent") === "on",
          honeypot: fd.get("website"),
          ...getAttribution(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      router.push("/thank-you?type=listing-enquiry");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form" style={{ marginTop: 16 }}>
      {/* Honeypot: real visitors never see this field; a filled value means a bot filled the form. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label htmlFor="le-website">Website</label>
        <input type="text" id="le-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field field--full">
        <label htmlFor="le-name">Your name*</label>
        <input className="input" id="le-name" name="name" required />
      </div>
      <div className="field field--full">
        <label htmlFor="le-email">Email*</label>
        <input className="input" id="le-email" name="email" type="email" required />
      </div>
      <div className="field field--full">
        <label htmlFor="le-phone">Phone (optional)</label>
        <input className="input" id="le-phone" name="phone" type="tel" />
      </div>
      <div className="field field--full">
        <label htmlFor="le-message">Your question (optional)</label>
        <textarea className="input" id="le-message" name="message" placeholder="Anything specific you'd like to know?" />
      </div>
      <div className="field field--full consent-field">
        <label>
          <input type="checkbox" name="consent" required />
          <span>
            I agree to be contacted about my enquiry and have read the <Link href="/privacy">Privacy Policy</Link>.
          </span>
        </label>
      </div>
      <div className="form__submit">
        <button className="btn-submit" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send enquiry"}
        </button>
      </div>
      {status === "error" && (
        <p className="t-sm field--full" style={{ color: "#f87171" }}>
          {errorMessage}
        </p>
      )}
    </form>
  );
}
