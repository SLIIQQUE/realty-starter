"use client";

import { useEffect, useMemo, useState } from "react";

function parsePrice(price: string) {
  return Number(price.replace(/[^0-9]/g, "")) || 0;
}

function formatCurrency(n: number) {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
}

/**
 * Canadian federally regulated mortgages compound fixed interest rates
 * semi-annually, not monthly, by law (Interest Act, s. 6). Given a quoted
 * nominal annual rate, the equivalent rate for any other compounding period
 * is derived from the semi-annual effective rate rather than a straight
 * division by the number of periods; this is the standard conversion used
 * by Canadian lenders for payment math at any payment frequency.
 */
function effectivePeriodRate(nominalAnnualRatePct: number, periodsPerYear: number) {
  const semiAnnualRate = nominalAnnualRatePct / 100 / 2;
  return Math.pow(1 + semiAnnualRate, 2 / periodsPerYear) - 1;
}

function paymentForPeriod(principal: number, periodRate: number, totalPeriods: number) {
  if (totalPeriods <= 0) return 0;
  if (periodRate === 0) return principal / totalPeriods;
  return (principal * periodRate) / (1 - Math.pow(1 + periodRate, -totalPeriods));
}

/** Runs a real amortization schedule for a given payment amount/frequency so we can show
 *  how much faster an accelerated bi-weekly schedule actually pays the mortgage off. */
function simulateAmortization(principal: number, periodRate: number, paymentAmount: number, maxPeriods: number) {
  let balance = principal;
  let totalInterest = 0;
  let periods = 0;
  while (balance > 0.01 && periods < maxPeriods) {
    const interest = balance * periodRate;
    let principalPaid = paymentAmount - interest;
    if (principalPaid <= 0) {
      // Payment doesn't even cover interest: bail out rather than loop forever.
      periods = maxPeriods;
      break;
    }
    if (principalPaid > balance) principalPaid = balance;
    balance -= principalPaid;
    totalInterest += interest;
    periods++;
  }
  return { totalInterest, periods };
}

/**
 * CMHC mortgage default insurance applies only to "high-ratio" mortgages
 * (down payment under 20%) and is charged as a percentage of the loan
 * amount, tiered by how small the down payment is. Figures below reflect
 * CMHC's published standard-premium table for owner-occupied purchases.
 * This is an estimate only; actual premiums depend on the lender, loan
 * amount, and amortization length.
 */
function cmhcPremiumRate(downPaymentPct: number) {
  if (downPaymentPct >= 20) return 0;
  if (downPaymentPct >= 15) return 0.028;
  if (downPaymentPct >= 10) return 0.031;
  return 0.04; // 5%–9.99% down (the minimum down payment allowed in Canada is 5%)
}

type Frequency = "monthly" | "biweekly" | "biweekly-accelerated";

const YEAR_OPTIONS = [15, 20, 25, 30] as const;

const FREQUENCY_LABEL: Record<Frequency, { headline: string; perYear: number; short: string }> = {
  monthly: { headline: "Estimated monthly payment", perYear: 12, short: "Monthly" },
  biweekly: { headline: "Estimated bi-weekly payment", perYear: 26, short: "Bi-weekly" },
  "biweekly-accelerated": { headline: "Estimated accelerated bi-weekly payment", perYear: 26, short: "Accelerated bi-weekly" },
};

export default function MortgageCalculator({ initialPrice }: { initialPrice?: string }) {
  const [price, setPrice] = useState(initialPrice ? parsePrice(initialPrice) : 3_300_000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(5.5);
  const [years, setYears] = useState(25);
  const [frequency, setFrequency] = useState<Frequency>("monthly");

  const isHighRatio = downPct < 20;
  const availableYearOptions = isHighRatio ? YEAR_OPTIONS.filter((y) => y !== 30) : YEAR_OPTIONS;

  // Canadian default-insurance rules disallow 30-year amortization on high-ratio (insured)
  // mortgages, so if the simulated down payment drops under 20% while 30 is selected, clamp back.
  useEffect(() => {
    if (isHighRatio && years === 30) setYears(25);
  }, [isHighRatio, years]);

  const calc = useMemo(() => {
    const down = price * (downPct / 100);
    const principal = Math.max(price - down, 0);
    const premiumRate = cmhcPremiumRate(downPct);
    const premium = principal * premiumRate;
    const totalLoan = principal + premium;

    const monthlyRate = effectivePeriodRate(rate, 12);
    const n = years * 12;
    const monthlyPayment = paymentForPeriod(totalLoan, monthlyRate, n);

    const biweeklyPayment = (monthlyPayment * 12) / 26;
    const acceleratedBiweeklyPayment = monthlyPayment / 2;

    const payments: Record<Frequency, number> = {
      monthly: monthlyPayment,
      biweekly: biweeklyPayment,
      "biweekly-accelerated": acceleratedBiweeklyPayment,
    };

    const periodsPerYear = FREQUENCY_LABEL[frequency].perYear;
    const periodRate = effectivePeriodRate(rate, periodsPerYear);
    const maxPeriods = years * periodsPerYear * 2; // generous safety cap
    const { totalInterest, periods } = simulateAmortization(totalLoan, periodRate, payments[frequency], maxPeriods);
    const payoffYears = periods / periodsPerYear;

    return {
      down,
      principal,
      premiumRate,
      premium,
      totalLoan,
      payments,
      headlinePayment: payments[frequency],
      totalInterest,
      payoffYears,
    };
  }, [price, downPct, rate, years, frequency]);

  return (
    <div className="mortgage-calc">
      <div className="mortgage-calc__fields">
        <div className="field">
          <label htmlFor="mc-price">Home price</label>
          <input
            className="input"
            id="mc-price"
            type="number"
            min={0}
            step={10000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label htmlFor="mc-down">Down payment ({downPct}%)</label>
          <input
            id="mc-down"
            type="range"
            min={5}
            max={90}
            step={1}
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label htmlFor="mc-rate">Interest rate ({rate.toFixed(2)}%)</label>
          <input
            id="mc-rate"
            type="range"
            min={2}
            max={10}
            step={0.125}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label htmlFor="mc-term">Amortization</label>
          <select className="input" id="mc-term" value={years} onChange={(e) => setYears(Number(e.target.value))}>
            {availableYearOptions.map((y) => (
              <option key={y} value={y}>
                {y} years
              </option>
            ))}
          </select>
          {isHighRatio && (
            <p className="t-xs" style={{ color: "var(--c-muted)" }}>
              30-year amortization isn&apos;t available below 20% down; insured (high-ratio) mortgages are capped
              at 25 years under Canadian mortgage rules.
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="mc-freq">Payment frequency</label>
          <select
            className="input"
            id="mc-freq"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as Frequency)}
          >
            <option value="monthly">Monthly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="biweekly-accelerated">Accelerated bi-weekly</option>
          </select>
        </div>
      </div>
      <div className="mortgage-calc__result">
        <p className="eyebrow eyebrow--white70">{FREQUENCY_LABEL[frequency].headline}</p>
        <p className="h2s">{formatCurrency(calc.headlinePayment)}</p>

        <div className="mortgage-calc__compare">
          {(Object.keys(FREQUENCY_LABEL) as Frequency[]).map((f) => (
            <div key={f} className={f === frequency ? "is-active" : ""}>
              <span>{FREQUENCY_LABEL[f].short}</span>
              <strong>{formatCurrency(calc.payments[f])}</strong>
            </div>
          ))}
        </div>

        <div className="mortgage-calc__breakdown">
          <div>
            <span className="eyebrow eyebrow--white50">Mortgage principal</span>
            <strong>{formatCurrency(calc.principal)}</strong>
          </div>
          <div>
            <span className="eyebrow eyebrow--white50">Total interest</span>
            <strong>{formatCurrency(calc.totalInterest)}</strong>
          </div>
          <div>
            <span className="eyebrow eyebrow--white50">CMHC default insurance</span>
            <strong>{calc.premium > 0 ? formatCurrency(calc.premium) : "$0 (20%+ down)"}</strong>
          </div>
          <div>
            <span className="eyebrow eyebrow--white50">Payoff time at this frequency</span>
            <strong>{calc.payoffYears.toFixed(1)} years</strong>
          </div>
        </div>

        {calc.premium > 0 && (
          <p className="t-xs" style={{ color: "var(--c-white-50)", marginTop: 16 }}>
            Because the down payment is under 20%, this mortgage would need CMHC mortgage default insurance,
            estimated here at {(calc.premiumRate * 100).toFixed(2)}% of the loan amount and added to the mortgage
            balance above. This is an estimate only; actual CMHC premium depends on your lender and application.
          </p>
        )}

        <p className="t-xs" style={{ color: "var(--c-white-50)", marginTop: 16 }}>
          Estimate only: excludes land transfer tax (see our separate{" "}
          <a href="/tools/land-transfer-tax" style={{ color: "var(--c-white-70)", textDecoration: "underline" }}>
            land transfer tax calculator
          </a>
          ), property tax, and home insurance. Rates shown are illustrative, not a quote.
        </p>
      </div>
    </div>
  );
}
