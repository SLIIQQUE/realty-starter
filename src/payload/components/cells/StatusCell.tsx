import type { DefaultCellComponentProps } from "payload";

const TONES: Record<string, string> = {
  available: "positive",
  closed: "neutral",
  contacted: "warm",
  "new listing": "positive",
  new: "warm",
  pending: "warm",
  qualified: "positive",
  sold: "neutral",
};

export default function StatusCell({ cellData }: DefaultCellComponentProps) {
  const value = typeof cellData === "string" && cellData.length > 0 ? cellData : "—";
  const tone = TONES[value.toLowerCase()] ?? "neutral";

  return <span className={`sliiq-pill is-${tone}`}>{value}</span>;
}
