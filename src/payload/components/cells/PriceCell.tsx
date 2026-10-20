import type { DefaultCellComponentProps } from "payload";

const currency = new Intl.NumberFormat("en-CA", {
  currency: "CAD",
  maximumFractionDigits: 0,
  style: "currency",
});

/** Readable CAD price instead of Payload's raw number cell. */
export default function PriceCell({ cellData }: DefaultCellComponentProps) {
  const value = typeof cellData === "number" ? cellData : Number(cellData);

  if (!Number.isFinite(value) || value === 0) {
    return <span className="sliiq-cell-muted">—</span>;
  }

  return <span className="sliiq-cell-price">{currency.format(value)}</span>;
}
