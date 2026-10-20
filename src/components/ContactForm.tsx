"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAttribution } from "@/lib/attribution";

type Status = "idle" | "sending" | "error";

const TOPICS = ["I want to buy", "I want to sell", "Home valuation", "Private access", "Something else"];

type ContactFormProps = {
  /** Which topic radio is pre-selected: lets /buy, /sell, etc. point the form at the right intent. */
  defaultTopic?: string;
};

export default function ContactForm({ defaultTopic = "I want to buy" }: ContactFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: fd.get("topic"),
          firstName: fd.get("firstName"),
          lastName: fd.get("lastName"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          budget: fd.get("budget"),
          timeline: fd.get("timeline"),
          message: fd.get("message"),
          consent: fd.get("consent") === "on",
          honeypot: fd.get("company"),
          ...getAttribution(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      router.push("/thank-you?type=contact");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="topics" role="radiogroup">
        {TOPICS.map((t) => (
          <label className="topic" key={t}>
            <input type="radio" name="topic" value={t} defaultChecked={t === defaultTopic} />
            <i></i>
            {t}
          </label>
        ))}
      </div>
      <div className="form">
        {/* Honeypot: real visitors never see this field; a filled value means a bot filled the form. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
          <label htmlFor="f-company">Company</label>
          <input type="text" id="f-company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="f1">Name*</label>
          <input className="input" id="f1" name="firstName" required />
        </div>
        <div className="field">
          <label htmlFor="f2">Last name*</label>
          <input className="input" id="f2" name="lastName" required />
        </div>
        <div className="field">
          <label htmlFor="f3">Email*</label>
          <input className="input" id="f3" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="f4">Phone (optional)</label>
          <input className="input" id="f4" name="phone" type="tel" />
        </div>
        <div className="field">
          <label htmlFor="f5">Budget range*</label>
          <select className="input" id="f5" name="budget" defaultValue="Select a range">
            <option>Select a range</option>
            <option>Under $1M CAD</option>
            <option>$1M – $2M CAD</option>
            <option>$2M – $3.5M CAD</option>
            <option>$3.5M – $5M CAD</option>
            <option>$5M+ CAD</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="f6">Timeline*</label>
          <select className="input" id="f6" name="timeline" defaultValue="When are you looking?">
            <option>When are you looking?</option>
            <option>As soon as possible</option>
            <option>Within 3 months</option>
            <option>3 – 6 months</option>
            <option>6 – 12 months</option>
          </select>
        </div>
        <div className="field field--full">
          <label htmlFor="f7">Your message</label>
          <textarea className="input" id="f7" name="message" placeholder="Write your message here..." />
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
            {status === "sending" ? "Sending..." : "Send message"}
          </button>
          <p>The SLIIQQUE team reads every message and replies within 24 hours.</p>
        </div>
        {status === "error" && (
          <p className="t-sm field--full" style={{ color: "#f87171" }}>
            {errorMessage}
          </p>
        )}
      </div>
    </form>
  );
}
