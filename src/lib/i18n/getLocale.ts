import { headers } from "next/headers";

export type Locale = "en" | "fr";

export async function getLocale(): Promise<Locale> {
  const h = await headers();
  return h.get("x-locale") === "fr" ? "fr" : "en";
}
