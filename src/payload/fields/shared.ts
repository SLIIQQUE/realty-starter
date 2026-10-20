import type { ArrayField, Field } from "payload";

/**
 * Shared field snippets reused across several collections/globals so the field
 * shape (and therefore the data shape returned by the Local API) stays
 * consistent everywhere "seo", "socialLinks", or a plain array-of-strings is
 * needed. Payload has no native "array of plain strings" field, so the
 * convention here is an array of `{ value: string }` rows.
 */

export const seoField: Field = {
  name: "seo",
  type: "group",
  fields: [
    { name: "title", type: "text" },
    { name: "description", type: "textarea" },
  ],
};

export const socialLinksField: Field = {
  name: "socialLinks",
  type: "group",
  fields: [
    { name: "instagram", type: "text" },
    { name: "x", type: "text" },
    { name: "whatsapp", type: "text" },
  ],
};

export function textArrayField(name: string, label?: string): ArrayField {
  return {
    name,
    type: "array",
    label,
    fields: [{ name: "value", type: "text" }],
  };
}
