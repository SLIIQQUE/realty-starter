import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Serves `/fr/...` from the same page files as the English routes, by rewriting the request
 * (stripping the `/fr` prefix) before Next.js resolves it, and stamping an `x-locale` header so
 * server components can tell which locale produced the response (see src/lib/i18n/getLocale.ts).
 *
 * The matcher below already excludes /admin, /api, /_next, favicon/icon, /images, /fonts, /video,
 * /brand, /sitemap.xml and /robots.txt, so those requests never reach this function at all.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isFrench = pathname === "/fr" || pathname.startsWith("/fr/");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", isFrench ? "fr" : "en");

  if (isFrench) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/fr" ? "/" : pathname.slice("/fr".length);
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!api|admin|_next|favicon\\.ico|icon|images|fonts|video|brand|sitemap\\.xml|robots\\.txt).*)",
  ],
};
