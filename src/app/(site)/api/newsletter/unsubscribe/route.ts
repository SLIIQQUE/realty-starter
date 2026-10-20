import { NextResponse } from "next/server";
import { verifySubscriberToken } from "@/lib/subscriberToken";
import { BRAND } from "@/data/brand";

function page(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}: ${BRAND.siteName}</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #F2EFE6; font-family: -apple-system, "Segoe UI", sans-serif; color: #0E1510; }
  .card { max-width: 440px; margin: 40px; padding: 40px; border-radius: 20px; background: #fff; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,.08); }
  h1 { font-size: 22px; margin: 0 0 12px; }
  p { color: #6B6B5C; font-size: 15px; line-height: 1.5; margin: 0 0 24px; }
  a { display: inline-block; padding: 12px 24px; border-radius: 30px; background: #0C2B1F; color: #fff; text-decoration: none; font-size: 14px; }
</style></head>
<body><div class="card"><h1>${title}</h1><p>${message}</p><a href="/">Back to ${BRAND.siteName}</a></div></body></html>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || "";
  const result = verifySubscriberToken(token);

  if (!result || result.action !== "unsubscribe") {
    return new NextResponse(
      page("Link expired or invalid", "This unsubscribe link is no longer valid. Contact us directly if you'd still like to be removed from the list."),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  return new NextResponse(
    page("You're unsubscribed", `${result.email} has been removed from the ${BRAND.siteName} list. You won't receive any more emails from us.`),
    { headers: { "Content-Type": "text/html" } }
  );
}
