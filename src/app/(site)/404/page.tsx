import { notFound } from "next/navigation";

// Reachable from the footer's "Error 404" link, matching the static template's standalone 404.html demo page.
export default function NotFoundDemoPage() {
  notFound();
}
