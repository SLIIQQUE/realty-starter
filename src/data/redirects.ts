/**
 * Models the CMS "Redirects" collection described in the Canada Realtor
 * Vertical build spec (§6). Populated with the route renames that are part
 * of this project's LA-to-Toronto/GTA pivot, so old links keep resolving.
 */
export type Redirect = {
  from: string;
  to: string;
  type: "301" | "302";
};

export const REDIRECTS: Redirect[] = [
  { from: "/properties", to: "/listings", type: "301" },
  { from: "/neighborhoods", to: "/neighbourhoods", type: "301" },
  { from: "/valuation", to: "/home-valuation", type: "301" },
  { from: "/blog", to: "/insights", type: "301" },
  { from: "/faqs", to: "/faq", type: "301" },
  { from: "/privacy-policy", to: "/privacy", type: "301" },
  { from: "/terms-conditions", to: "/terms", type: "301" },
];
