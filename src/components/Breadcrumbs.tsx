import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export type Crumb = { name: string; href: string };

/** Visible breadcrumb trail + matching BreadcrumbList JSON-LD (spec §4.1: "Breadcrumbs (A):
 *  on listing, neighbourhood and Insights pages"). `siteUrl` is used only for the schema's
 *  absolute `item` URLs; the visible links stay relative via next/link. */
export default function Breadcrumbs({ items, siteUrl }: { items: Crumb[]; siteUrl: string }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <ol>
          {items.map((item, i) => (
            <li key={item.href}>
              {i === items.length - 1 ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.href}>{item.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={[breadcrumbSchema(items.map((item) => ({ name: item.name, url: `${siteUrl}${item.href}` })))]} />
    </>
  );
}
