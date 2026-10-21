"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getAttribution } from "@/lib/attribution";

type Status = "idle" | "sending" | "error";

export default function ViewingRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingSlug = searchParams.get("listing") || "";
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/viewing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingSlug: listingSlug || undefined,
          preferredDates: fd.get("preferredDates"),
          numberOfPeople: fd.get("numberOfPeople") ? Number(fd.get("numberOfPeople")) : undefined,
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          consent: fd.get("consent") === "on",
          honeypot: fd.get("website"),
          ...getAttribution(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      router.push("/thank-you?type=viewing");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      {/* Honeypot: real visitors never see this field; a filled value means a bot filled the form. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label htmlFor="vr-website">Website</label>
        <input type="text" id="vr-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {listingSlug && (
        <div className="field field--full">
          <p className="t-sm muted">
            Regarding: <strong>{listingSlug}</strong>
          </p>
        </div>
      )}
      <div className="field">
        <label htmlFor="vr-name">Your name*</label>
        <input className="input" id="vr-name" name="name" required />
      </div>
      <div className="field">
        <label htmlFor="vr-email">Email*</label>
        <input className="input" id="vr-email" name="email" type="email" required />
      </div>
      <div className="field">
        <label htmlFor="vr-phone">Phone (optional)</label>
        <input className="input" id="vr-phone" name="phone" type="tel" />
      </div>
      <div className="field">
        <label htmlFor="vr-people">Number of people</label>
        <input className="input" id="vr-people" name="numberOfPeople" type="number" min={1} defaultValue={1} />
      </div>
      <div className="field field--full">
        <label htmlFor="vr-dates">Preferred dates / times*</label>
        <textarea
          className="input"
          id="vr-dates"
          name="preferredDates"
          required
          placeholder="Free text is fine, e.g. Saturday afternoon, or a few options that work for you"
        />
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
          {status === "sending" ? "Sending..." : "Request a viewing"}
        </button>
        <p>The SLIIQQUE team will confirm by email or WhatsApp.</p>
      </div>
      {status === "error" && (
        <p className="t-sm field--full" style={{ color: "#f87171" }}>
          {errorMessage}
        </p>
      )}
    </form>
  );
}
