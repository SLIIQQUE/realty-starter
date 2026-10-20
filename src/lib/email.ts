import { Resend } from "resend";
import { BRAND } from "@/data/brand";

export function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  return new Resend(key);
}

export function emailField(label: string, value: string | undefined): string {
  if (!value) return "";
  return `
    <tr><td style="padding:0 0 4px;font:700 10px/1.2 -apple-system,sans-serif;text-transform:uppercase;letter-spacing:.1em;color:#6366f1">${label}</td></tr>
    <tr><td style="padding:0 0 16px;font:500 15px/1.4 -apple-system,sans-serif;color:#ffffff;white-space:pre-wrap">${value}</td></tr>`;
}

export function emailShell(badge: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#050505;font-family:-apple-system,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505">
<tr><td align="center" style="padding:48px 24px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#0a0a0f;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.08)">
<tr><td style="padding:0;background:linear-gradient(90deg,#f97316,#3b82f6,#8b5cf6);height:3px;font-size:0">&nbsp;</td></tr>
<tr><td style="padding:32px 32px 0;font:800 18px/1 -apple-system,sans-serif;letter-spacing:.03em;text-transform:uppercase;color:#ffffff">${BRAND.siteName}</td></tr>
<tr><td style="padding:16px 32px 0">
  <span style="display:inline-block;padding:6px 14px;background:rgba(99,102,241,.15);border-radius:20px;font:700 10px/1 -apple-system,sans-serif;text-transform:uppercase;letter-spacing:.1em;color:#6366f1">${badge}</span>
</td></tr>
<tr><td style="padding:24px 32px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${bodyHtml}</table></td></tr>
<tr><td style="padding:24px 32px 32px;font:400 11px/1.5 -apple-system,sans-serif;color:rgba(255,255,255,.3)">Concept demo lead, realestate.sliiqque.space</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}
