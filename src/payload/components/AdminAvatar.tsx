import type { ServerProps } from "payload";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SL";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/** Initials tile in place of Payload's generic account glyph. */
export default function AdminAvatar({ user }: ServerProps) {
  const record = (user ?? {}) as Record<string, unknown>;
  const name = String(record.name ?? record.email ?? "SLIIQQUE");

  return (
    <span aria-label={name} className="sliiq-avatar" title={name}>
      {initials(name)}
    </span>
  );
}
