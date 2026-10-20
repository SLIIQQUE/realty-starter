import { createHmac, timingSafeEqual } from "crypto";

/**
 * Stateless, HMAC-signed confirm/unsubscribe tokens for the newsletter double opt-in (spec
 * §5.8 CASL: "express opt-in; confirmation email; unsubscribe link in every email"). Keeping
 * this stateless (no DB row required) means double opt-in works on the P-tier baseline, before
 * a client has a Subscribers table connected; once Payload/Postgres is wired up, the same
 * email+action pair should also be persisted there (see src/lib/content/ once that lands).
 */
type Action = "confirm" | "unsubscribe";

function getSecret(): string {
  const secret = process.env.SUBSCRIBER_TOKEN_SECRET;
  if (!secret) {
    // eslint-disable-next-line no-console
    console.warn("SUBSCRIBER_TOKEN_SECRET is not set: using an insecure dev fallback. Set it before launch.");
    return "dev-only-insecure-secret";
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSubscriberToken(email: string, action: Action): string {
  const payload = `${action}:${email}`;
  const sig = sign(payload);
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifySubscriberToken(token: string): { email: string; action: Action } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [action, email, sig] = decoded.split(":");
    if (!action || !email || !sig || (action !== "confirm" && action !== "unsubscribe")) return null;

    const expected = sign(`${action}:${email}`);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    return { email, action };
  } catch {
    return null;
  }
}
