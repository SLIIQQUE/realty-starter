import type { DefaultCellComponentProps } from "payload";

const LABELS: Record<string, string> = {
  contact: "Contact",
  listing: "Listing",
  newsletter: "Newsletter",
  valuation: "Valuation",
  viewing: "Viewing",
};

export default function LeadTypeCell({ cellData }: DefaultCellComponentProps) {
  const value = typeof cellData === "string" ? cellData : "";
  if (!value) return <span className="sliiq-cell-muted">—</span>;

  return <span className="sliiq-pill is-outline">{LABELS[value] ?? value}</span>;
}
