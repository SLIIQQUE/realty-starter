import type { ServerProps } from "payload";
import { getNavGroups } from "@payloadcms/ui/shared";

import { NavClient } from "./NavClient";

/**
 * Replaces Payload's default nav with the SLIIQQUE "studio rail": grouped,
 * icon-led navigation in the brand's deep-green palette, plus a persistent
 * live-site link and account card. Payload still owns all routing, mobile
 * open/close state and permissions; this only changes the presentation.
 */
export default function AdminNav(props: ServerProps) {
  const { i18n, payload, permissions, user, visibleEntities } = props;
  const config = payload.config;

  const groups = getNavGroups(
    permissions ?? {},
    visibleEntities ?? {
      collections: config.collections.map((collection) => collection.slug),
      globals: config.globals.map((global) => global.slug),
    },
    config,
    i18n,
  );

  const userRecord = (user ?? {}) as Record<string, unknown>;

  return (
    <NavClient
      adminRoute={config.routes.admin}
      groups={groups.map((group) => ({
        label: typeof group.label === "string" ? group.label : String(group.label),
        entities: group.entities.map((entity) => ({
          slug: entity.slug,
          type: entity.type,
          label: typeof entity.label === "string" ? entity.label : String(entity.label),
        })),
      }))}
      user={
        user
          ? {
              email: String(userRecord.email ?? ""),
              name: String(userRecord.name ?? userRecord.email ?? ""),
              role: String(userRecord.role ?? "editor"),
            }
          : undefined
      }
    />
  );
}
