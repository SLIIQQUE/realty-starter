import type { CollectionConfig } from "payload";

/**
 * Auth-enabled collection: this is what makes `/admin` login work. `email`
 * and the password fields are added automatically by `auth: true`.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    group: "Settings",
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role", "updatedAt"],
    description: "People who can sign in to the studio workspace.",
    listSearchableFields: ["name", "email"],
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Owner", value: "owner" },
        { label: "Editor", value: "editor" },
        { label: "Assistant", value: "assistant" },
      ],
    },
  ],
};
