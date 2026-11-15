"use client";

import { donation } from "@/content/site";
import type { CurrencyCode } from "@/types/content";
import { cn } from "@/lib/utils";

const labels: Partial<Record<CurrencyCode, string>> = { KES: "KSh", USD: "USD" };

/** KSh / USD segmented control (native radios, so it posts `currency` without JS). */
export function CurrencyToggle({ value, onChange }: { value: CurrencyCode; onChange: (c: CurrencyCode) => void }) {
  if (donation.currencies.length < 2) return <input type="hidden" name="currency" value={value} />;
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Currency</legend>
      <div className="flex rounded-pill border border-ink-950/15 p-1">
        {donation.currencies.map((c) => (
          <label
            key={c}
            className={cn(
              "cursor-pointer rounded-pill px-4 py-2 text-sm font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-green-700",
              value === c ? "bg-green-700 text-ivory-50" : "text-ink-700 hover:text-green-700",
            )}
          >
            <input type="radio" name="currency" value={c} checked={value === c} onChange={() => onChange(c)} className="sr-only" />
            {labels[c] ?? c}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
