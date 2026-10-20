/**
 * Models the CMS "Tax Rules" collection described in the Canada Realtor
 * Vertical build spec (§6), for a land transfer tax estimate calculator.
 *
 * Figures reflect publicly published 2024/2025 marginal bracket structures
 * for Ontario's provincial Land Transfer Tax, the City of Toronto's
 * Municipal Land Transfer Tax, and BC's Property Transfer Tax. They are
 * provided for demonstration/estimate purposes only: see sourceNote. This
 * is not legal or tax advice; a real deployment should confirm current
 * rates with a real estate lawyer or the relevant provincial/municipal
 * ministry before publishing a calculator that real buyers rely on.
 */
export type TaxBracket = { upTo: number | null; rate: number };

export type FirstTimeBuyerRebate = { maxRebate: number; description: string };

export type TaxRule = {
  province: string;
  municipality?: string;
  bracketTable: TaxBracket[];
  firstTimeBuyerRebate?: FirstTimeBuyerRebate;
  lastUpdated: string;
  sourceNote: string;
};

export const TAX_RULES: TaxRule[] = [
  {
    province: "Ontario",
    bracketTable: [
      { upTo: 55_000, rate: 0.005 },
      { upTo: 250_000, rate: 0.01 },
      { upTo: 400_000, rate: 0.015 },
      { upTo: 2_000_000, rate: 0.02 },
      { upTo: null, rate: 0.025 },
    ],
    firstTimeBuyerRebate: {
      maxRebate: 4_000,
      description:
        "Ontario provides a maximum rebate of $4,000 on the provincial Land Transfer Tax for qualifying first-time homebuyers, fully offsetting the tax on homes up to roughly $368,000 and reducing it above that.",
    },
    lastUpdated: "2026-01-01",
    sourceNote:
      "Figures shown are for demonstration/estimate purposes only and are not legal or tax advice. Marginal brackets apply to each portion of the purchase price, not the full amount. Confirm current rates with a real estate lawyer or the Ontario Ministry of Finance before relying on this calculator.",
  },
  {
    province: "Ontario",
    municipality: "Toronto",
    bracketTable: [
      { upTo: 55_000, rate: 0.005 },
      { upTo: 250_000, rate: 0.01 },
      { upTo: 400_000, rate: 0.015 },
      { upTo: 2_000_000, rate: 0.02 },
      { upTo: null, rate: 0.025 },
    ],
    firstTimeBuyerRebate: {
      maxRebate: 4_475,
      description:
        "The City of Toronto's Municipal Land Transfer Tax (charged in addition to Ontario's provincial tax) provides a separate maximum rebate of $4,475 for qualifying first-time homebuyers, on top of the provincial rebate.",
    },
    lastUpdated: "2026-01-01",
    sourceNote:
      "Figures shown are for demonstration/estimate purposes only and are not legal or tax advice. Toronto buyers pay both the Ontario provincial Land Transfer Tax and this municipal tax, charged on the same marginal brackets. Confirm current rates with a real estate lawyer or the City of Toronto before relying on this calculator.",
  },
  {
    province: "British Columbia",
    bracketTable: [
      { upTo: 200_000, rate: 0.01 },
      { upTo: 2_000_000, rate: 0.02 },
      { upTo: 3_000_000, rate: 0.03 },
      { upTo: null, rate: 0.05 },
    ],
    lastUpdated: "2026-01-01",
    sourceNote:
      "Figures shown are for demonstration/estimate purposes only and are not legal or tax advice. BC's Property Transfer Tax adds a further 2% on the portion of a residential purchase price above $3,000,000, shown here as an effective 5% top bracket. Confirm current rates and any first-time buyer or newly-built home exemptions with a real estate lawyer or the BC Ministry of Finance before relying on this calculator.",
  },
];
