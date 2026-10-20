"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAttribution } from "@/lib/attribution";

type Status = "idle" | "sending" | "error";

export default function ValuationForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: fd.get("address"),
          propertyType: fd.get("propertyType"),
          beds: fd.get("beds"),
          baths: fd.get("baths"),
          condition: fd.get("condition"),
          name: fd.get("name"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          notes: fd.get("notes"),
          consent: fd.get("consent") === "on",
          honeypot: fd.get("company"),
          ...getAttribution(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      router.push("/thank-you?type=valuation");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form valuation-form">
      {/* Honeypot: real visitors never see this field; a filled value means a bot filled the form. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label htmlFor="v-company">Company</label>
        <input type="text" id="v-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field field--full">
        <label htmlFor="v-address">Property address*</label>
        <input className="input" id="v-address" name="address" required />
      </div>
      <div className="field">
        <label htmlFor="v-type">Property type</label>
        <select className="input" id="v-type" name="propertyType" defaultValue="Single-family">
          <option>Single-family</option>
          <option>Condo</option>
          <option>Townhome</option>
          <option>Multi-family</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="v-condition">Condition</label>
        <select className="input" id="v-condition" name="condition" defaultValue="Good">
          <option>Excellent / renovated</option>
          <option>Good</option>
          <option>Needs updating</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="v-beds">Bedrooms</label>
        <input className="input" id="v-beds" name="beds" type="number" min={0} />
      </div>
      <div className="field">
        <label htmlFor="v-baths">Bathrooms</label>
        <input className="input" id="v-baths" name="baths" type="number" min={0} />
      </div>
      <div className="field">
        <label htmlFor="v-name">Your name*</label>
        <input className="input" id="v-name" name="name" required />
      </div>
      <div className="field">
        <label htmlFor="v-email">Email*</label>
        <input className="input" id="v-email" name="email" type="email" required />
      </div>
      <div className="field">
        <label htmlFor="v-phone">Phone (optional)</label>
        <input className="input" id="v-phone" name="phone" type="tel" />
      </div>
      <div className="field field--full">
        <label htmlFor="v-notes">Anything else worth knowing?</label>
        <textarea className="input" id="v-notes" name="notes" placeholder="Recent renovations, timeline, etc." />
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
          {status === "sending" ? "Sending..." : "Request valuation"}
        </button>
        <p>This is a concept flow; requests are reviewed by the SLIIQQUE team, not an automated pricing model.</p>
      </div>
      {status === "error" && (
        <p className="t-sm field--full" style={{ color: "#f87171" }}>
          {errorMessage}
        </p>
      )}
    </form>
  );
}
