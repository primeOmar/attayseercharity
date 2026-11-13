"use client";

import { useId, useState } from "react";
import { ArrowUpRight, Lock } from "lucide-react";
import type { CurrencyCode, DonationFrequency } from "@/types/content";
import { donation } from "@/content/site";
import { cn, formatCurrency } from "@/lib/utils";

/**
 * Quick donation selector.
 * A plain GET form to /donate — works without JavaScript and simply pre-fills
 * the full donation flow. No payment is taken here.
 */
export function QuickDonate() {
  const uid = useId();
  const [frequency, setFrequency] = useState<DonationFrequency>("one-time");
  const [currency, setCurrency] = useState<CurrencyCode>(donation.defaultCurrency);
  const presets = donation.presets[currency];
  const [amount, setAmount] = useState<string>(String(presets[1]));
  const [custom, setCustom] = useState("");

  const effective = custom ? Number(custom) : Number(amount);
  const valid = Number.isFinite(effective) && effective > 0;

  return (
    <form
      action="/donate"
      method="get"
      className="w-full max-w-xl rounded-lg border border-ink-950/10 bg-white p-5 text-left shadow-[0_40px_80px_-40px_rgb(11_10_8/0.45)] sm:p-8"
      onSubmit={(e) => {
        if (!valid) e.preventDefault();
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Frequency */}
        <fieldset>
          <legend className="sr-only">Donation frequency</legend>
          <div className="flex rounded-pill border border-ink-950/15 p-1">
            {(["one-time", "monthly"] as const).map((f) => (
              <label
                key={f}
                className={cn(
                  "cursor-pointer rounded-pill px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-green-700",
                  frequency === f ? "bg-ink-950 text-ivory-50" : "text-ink-700 hover:text-green-700",
                )}
              >
                <input
                  type="radio"
                  name="frequency"
                  value={f}
                  checked={frequency === f}
                  onChange={() => setFrequency(f)}
                  className="sr-only"
                />
                {f === "one-time" ? "One-time" : "Monthly"}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Currency */}
        <div className="flex items-center gap-2">
          <label htmlFor={`${uid}-currency`} className="text-sm text-ink-700">
            Currency
          </label>
          <select
            id={`${uid}-currency`}
            name="currency"
            value={currency}
            onChange={(e) => {
              const c = e.target.value as CurrencyCode;
              setCurrency(c);
              setAmount(String(donation.presets[c][1]));
              setCustom("");
            }}
            className="h-10 rounded-pill border border-ink-950/15 bg-white px-4 text-sm text-ink-950"
          >
            {donation.currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Amounts */}
      <fieldset className="mt-6">
        <legend className="mb-3 text-sm text-ink-700">Choose an amount</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {presets.map((p) => {
            const checked = !custom && amount === String(p);
            return (
              <label
                key={p}
                className={cn(
                  "flex h-14 cursor-pointer items-center justify-center rounded-md border text-base font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-green-700",
                  checked
                    ? "border-gold-500 bg-gold-metal text-ink-950"
                    : "border-ink-950/15 text-ink-950 hover:border-gold-600",
                )}
              >
                <input
                  type="radio"
                  name={custom ? undefined : "amount"}
                  value={p}
                  checked={checked}
                  onChange={() => {
                    setAmount(String(p));
                    setCustom("");
                  }}
                  className="sr-only"
                />
                {formatCurrency(p, currency)}
              </label>
            );
          })}
        </div>

        <label htmlFor={`${uid}-custom`} className="mt-3 flex h-14 items-center gap-3 rounded-md border border-ink-950/15 px-4 focus-within:border-green-700">
          <span className="text-sm text-ink-700">Other</span>
          <span className="text-sm text-ink-500">{currency}</span>
          <input
            id={`${uid}-custom`}
            name={custom ? "amount" : undefined}
            type="number"
            inputMode="numeric"
            min={1}
            step="any"
            placeholder="Enter amount"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-base text-ink-950 placeholder:text-ink-500 focus:outline-none"
          />
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={!valid}
        className="group mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-pill bg-gold-metal text-[0.95rem] font-medium text-ink-950 shadow-[0_14px_40px_-14px_rgb(241_177_15/0.6)] transition-[filter,transform] hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
      >
        {valid ? (
          <>
            Continue with {formatCurrency(effective, currency)}
            {frequency === "monthly" && " / month"}
          </>
        ) : (
          "Enter an amount"
        )}
        <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-500">
        <Lock aria-hidden="true" className="size-3.5" />
        No payment is taken here — you’ll review and pay securely on the next step.
      </p>
    </form>
  );
}
