"use client";

import { useMemo, useState } from "react";
import { TAX_RULES, type TaxBracket, type TaxRule } from "@/data/taxRules";

function formatCurrency(n: number) {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
}

/** Marginal-bracket calculation, the same pattern as income tax brackets: each bracket's
 *  rate only applies to the slice of the price that falls within it, not the full price. */
function marginalTax(price: number, bracketTable: TaxBracket[]) {
  let tax = 0;
  let previousCap = 0;
  for (const bracket of bracketTable) {
    const cap = bracket.upTo === null ? price : Math.min(bracket.upTo, price);
    if (cap > previousCap) {
      tax += (cap - previousCap) * bracket.rate;
      previousCap = cap;
    }
    if (bracket.upTo !== null && price <= bracket.upTo) break;
  }
  return Math.max(tax, 0);
}

type Option = { key: string; label: string; rules: TaxRule[] };

/** Builds the selectable list from TAX_RULES: a standalone option for each province-level
 *  entry, plus a combined option (province + municipal) for each municipal entry, e.g.
 *  "Ontario" and "Ontario, Toronto" as two separate choices, Toronto buyers paying both. */
const OPTIONS: Option[] = TAX_RULES.map((rule) => {
  if (!rule.municipality) {
    return { key: rule.province, label: rule.province, rules: [rule] };
  }
  const base = TAX_RULES.find((r) => r.province === rule.province && !r.municipality);
  return {
    key: `${rule.province}-${rule.municipality}`,
    label: `${rule.province}, ${rule.municipality}`,
    rules: base ? [base, rule] : [rule],
  };
});

export default function LandTransferTaxCalculator() {
  const [optionKey, setOptionKey] = useState(OPTIONS[0].key);
  const [price, setPrice] = useState(1_200_000);
  const [firstTimeBuyer, setFirstTimeBuyer] = useState(false);

  const option = OPTIONS.find((o) => o.key === optionKey) ?? OPTIONS[0];

  const lineItems = useMemo(() => {
    return option.rules.map((rule) => {
      const rawTax = marginalTax(price, rule.bracketTable);
      const rebate =
        firstTimeBuyer && rule.firstTimeBuyerRebate
          ? Math.min(rawTax, rule.firstTimeBuyerRebate.maxRebate)
          : 0;
      return {
        rule,
        label: rule.municipality
          ? `${rule.municipality} Municipal Land Transfer Tax`
          : `${rule.province} Land Transfer Tax`,
        rawTax,
        rebate,
        net: rawTax - rebate,
      };
    });
  }, [option, price, firstTimeBuyer]);

  const totalTax = lineItems.reduce((sum, item) => sum + item.net, 0);
  const totalRebate = lineItems.reduce((sum, item) => sum + item.rebate, 0);
  const lastUpdated = option.rules[0]?.lastUpdated;
  const sourceNotes = Array.from(new Set(option.rules.map((r) => r.sourceNote)));

  return (
    <div className="ltt-calc">
      <div className="ltt-calc__fields">
        <div className="field">
          <label htmlFor="ltt-region">Province / municipality</label>
          <select
            className="input"
            id="ltt-region"
            value={optionKey}
            onChange={(e) => setOptionKey(e.target.value)}
          >
            {OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ltt-price">Purchase price (CAD)</label>
          <input
            className="input"
            id="ltt-price"
            type="number"
            min={0}
            step={10000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div className="field ltt-calc__checkbox">
          <label>
            <input
              type="checkbox"
              checked={firstTimeBuyer}
              onChange={(e) => setFirstTimeBuyer(e.target.checked)}
            />
            <span>I&apos;m a first-time home buyer (apply the applicable rebate(s))</span>
          </label>
        </div>
      </div>
      <div className="ltt-calc__result">
        <p className="eyebrow eyebrow--white70">Estimated land transfer tax</p>
        <p className="h2s">{formatCurrency(totalTax)}</p>

        <div className="ltt-calc__lines">
          {lineItems.map((item) => (
            <div key={item.label}>
              <span className="eyebrow eyebrow--white50">{item.label}</span>
              <strong>{formatCurrency(item.rawTax)}</strong>
            </div>
          ))}
          {totalRebate > 0 && (
            <div className="ltt-calc__rebate">
              <span className="eyebrow eyebrow--white50">First-time buyer rebate</span>
              <strong>-{formatCurrency(totalRebate)}</strong>
            </div>
          )}
          <div className="ltt-calc__total">
            <span className="eyebrow eyebrow--white50">
              {lineItems.length > 1 ? "Combined total (provincial + municipal)" : "Total"}
            </span>
            <strong>{formatCurrency(totalTax)}</strong>
          </div>
        </div>

        {firstTimeBuyer && (
          <div style={{ marginTop: 16 }}>
            {option.rules
              .filter((r) => r.firstTimeBuyerRebate)
              .map((r) => (
                <p
                  key={`${r.province}-${r.municipality ?? "province"}`}
                  className="t-xs"
                  style={{ color: "var(--c-white-50)", marginTop: 8 }}
                >
                  {r.firstTimeBuyerRebate?.description}
                </p>
              ))}
          </div>
        )}

        <div className="ltt-calc__meta">
          <p>
            Rates last updated {lastUpdated}.{" "}
            {sourceNotes.map((note, i) => (
              <span key={i}>{note} </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
