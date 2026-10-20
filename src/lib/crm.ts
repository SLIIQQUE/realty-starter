/* eslint-disable no-console */
/**
 * Generic CRM webhook hook (spec §5.2, Command tier: "Send leads to Follow Up Boss, IXACT or
 * Zapier through webhook"). We can't integrate a specific CRM's API without a real account, so
 * this posts a plain JSON payload to a single configurable URL, which is exactly the shape
 * Zapier's "Catch Hook" trigger (and most CRM inbound-webhook features) expect. No-ops when
 * CRM_WEBHOOK_URL isn't set, and never throws: a failed CRM push must not break lead capture.
 */
export async function sendToCrmWebhook(lead: Record<string, unknown>): Promise<void> {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, sentAt: new Date().toISOString() }),
    });
    if (!res.ok) console.error(`CRM webhook responded ${res.status}`);
  } catch (err) {
    console.error("CRM webhook failed:", err);
  }
}
