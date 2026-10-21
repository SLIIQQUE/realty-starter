"use client";

import Link from "next/link";

/**
 * Next.js requires this file at the true app root (not inside a route group) and requires it to
 * render its own <html>/<body>; it replaces the root layout entirely when an error escapes a
 * page's own error boundary. Kept deliberately simple and self-contained (inline styles, no
 * shared components/CSS) since the failure that triggers this page could itself be in shared
 * layout code (spec §8.2: "Custom 404 and 500 pages show helpful links").
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          padding: 24,
          textAlign: "center",
          fontFamily: "Georgia, 'Times New Roman', serif",
          background: "#FFFFFF",
          color: "#050505",
        }}
      >
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#f97316", margin: 0 }}>
          500
        </p>
        <h1 style={{ fontSize: 32, margin: 0, fontWeight: 400 }}>Something went wrong.</h1>
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 15, color: "#6B7280", maxWidth: 420, margin: 0 }}>
          This concept demo hit an unexpected error. Try again, or head back to the home page.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => reset()}
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              padding: "12px 24px",
              borderRadius: 0,
              border: "1px solid rgba(5,5,5,.2)",
              background: "transparent",
              color: "#050505",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              padding: "12px 24px",
              borderRadius: 0,
              background: "#f97316",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
