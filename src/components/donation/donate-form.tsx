"use client";

import { useActionState, useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Loader2, Lock } from "lucide-react";
import { startDonation, type DonateState } from "@/app/donate/actions";
import { donation } from "@/content/site";
import type { CurrencyCode, DonationFrequency } from "@/types/content";
import { cn, formatCurrency } from "@/lib/utils";

export interface DonateFormProps {
  /** Paystack keys present? If not, the form explains and points to contact. */
  enabled: boolean;
  /** Sandbox keys (sk_test_…): show the test-card hint. */
  testMode: boolean;
  designations: { value: string; label: string; group: "Programmes" | "Initiatives" }[];
  initial?: { frequency?: DonationFrequency; currency?: CurrencyCode; amount?: number; designation?: string };
}

const field =
  "h-12 w-full min-w-0 rounded-md border border-ink-950/15 bg-white px-4 text-base text-ink-950 placeholder:text-ink-500 focus:border-green-700 focus:outline-none";

/**
 * Full donation form → server action → Paystack hosted checkout.
 * Card and M-Pesa details are entered on Paystack's page, never on this site.
 */
export function DonateForm({ enabled, testMode, designations, initial }: DonateFormProps) {
  const uid = useId();
  const [state, action, pending] = useActionState<DonateState, FormData>(startDonation, {});

  const startCurrency = initial?.currency && donation.currencies.includes(initial.currency) ? initial.currency : donation.defaultCurrency;
  const [frequency, setFrequency] = useState<DonationFrequency>(initial?.frequency ?? "one-time");
  const [currency, setCurrency] = useState<CurrencyCode>(startCurrency);
  const presets = donation.presets[currency];
  const initialIsPreset = initial?.amount != null && presets.includes(initial.amount);
  const [preset, setPreset] = useState<string>(String(initialIsPreset ? initial!.amount : presets[1]));
  const [custom, setCustom] = useState(initial?.amount != null && !initialIsPreset ? String(initial.amount) : "");

  const effective = custom ? Number(custom) : Number(preset);
  const valid = Number.isFinite(effective) && effective > 0;

  if (!enabled) {
    return (
      <div className="rounded-lg border border-ink-950/10 bg-white p-6 text-ink-700 sm:p-8">
        <p className="font-display text-3xl text-ink-950">Online giving is being set up.</p>
        <p className="mt-3">In the meantime, please contact us and we’ll arrange your support directly.</p>
      </div>
    );
  }

  return (
    <form
      action={action}
      noValidate
      className="w-full min-w-0 rounded-lg border border-ink-950/10 bg-white p-5 text-left shadow-[0_40px_80px_-40px_rgb(11_10_8/0.35)] sm:p-8"
    >
      {testMode && (
        <p className="mb-6 rounded-md border border-gold-500/50 bg-wash-gold px-4 py-3 text-sm text-ink-700">
          <strong className="font-semibold text-ink-950">Test mode — no real money is charged.</strong> Use Paystack’s test card{" "}
          <span className="font-mono whitespace-nowrap">4084 0840 8408 4081</span>, any future expiry date, CVV{" "}
          <span className="font-mono">408</span>.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <fieldset className="min-w-0">
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
                <input type="radio" name="frequency" value={f} checked={frequency === f} onChange={() => setFrequency(f)} className="sr-only" />
                {f === "one-time" ? "One-time" : "Monthly"}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Picker only when there is a choice; otherwise send the one currency. */}

        {donation.currencies.length > 1 ? (

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
                setPreset(String(donation.presets[c][1]));
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

        ) : (

          <input type="hidden" name="currency" value={currency} />

        )}
      </div>

      <fieldset className="mt-6 min-w-0">
        <legend className="mb-3 text-sm text-ink-700">Choose an amount</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {presets.map((p) => {
            const checked = !custom && preset === String(p);
            return (
              <label
                key={p}
                className={cn(
                  "flex h-14 min-w-0 cursor-pointer items-center justify-center rounded-md border px-2 text-center text-[0.95rem] font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-green-700 sm:text-base",
                  checked ? "border-gold-500 bg-gold-metal text-ink-950" : "border-ink-950/15 text-ink-950 hover:border-gold-600",
                )}
              >
                <input
                  type="radio"
                  name="preset"
                  value={p}
                  checked={checked}
                  onChange={() => {
                    setPreset(String(p));
                    setCustom("");
                  }}
                  className="sr-only"
                />
                {formatCurrency(p, currency)}
              </label>
            );
          })}
        </div>
        <label
          htmlFor={`${uid}-custom`}
          className={cn(
            "mt-3 flex h-14 min-w-0 items-center gap-3 rounded-md border px-4 focus-within:border-green-700",
            state.fieldErrors?.amount ? "border-red-600" : "border-ink-950/15",
          )}
        >
          <span className="text-sm text-ink-700">Other</span>
          <span className="text-sm text-ink-500">{currency}</span>
          <input
            id={`${uid}-custom`}
            name="custom"
            type="number"
            inputMode="numeric"
            min={1}
            step="any"
            placeholder="Enter amount"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            aria-invalid={Boolean(state.fieldErrors?.amount)}
            aria-describedby={state.fieldErrors?.amount ? `${uid}-amount-error` : undefined}
            className="w-0 min-w-0 flex-1 bg-transparent text-base text-ink-950 placeholder:text-ink-500 focus:outline-none"
          />
        </label>
        {state.fieldErrors?.amount && (
          <p id={`${uid}-amount-error`} className="mt-2 text-sm text-red-700">
            {state.fieldErrors.amount}
          </p>
        )}
      </fieldset>

      <div className="mt-6">
        <label htmlFor={`${uid}-designation`} className="mb-2 block text-sm text-ink-700">
          Where should it go?
        </label>
        <select id={`${uid}-designation`} name="designation" defaultValue={initial?.designation ?? "general"} className={field}>
          <option value="general">Where it’s needed most</option>
          {(["Programmes", "Initiatives"] as const).map((group) => (
            <optgroup key={group} label={group}>
              {designations
                .filter((d) => d.group === group)
                .map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor={`${uid}-name`} className="mb-2 block text-sm text-ink-700">
            Full name <span className="text-ink-500">(optional)</span>
          </label>
          <input id={`${uid}-name`} name="name" autoComplete="name" maxLength={120} className={field} />
        </div>
        <div className="min-w-0">
          <label htmlFor={`${uid}-email`} className="mb-2 block text-sm text-ink-700">
            Email for your receipt
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? `${uid}-email-error` : undefined}
            className={cn(field, state.fieldErrors?.email && "border-red-600")}
          />
          {state.fieldErrors?.email && (
            <p id={`${uid}-email-error`} className="mt-2 text-sm text-red-700">
              {state.fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div aria-live="polite">
        {state.error && <p className="mt-6 rounded-md bg-wash-red px-4 py-3 text-sm text-red-700">{state.error}</p>}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="group mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-pill bg-gold-metal px-5 py-3 text-center text-[0.95rem] font-medium text-ink-950 shadow-[0_14px_40px_-14px_rgb(241_177_15/0.6)] transition-[filter,transform] hover:brightness-110 active:scale-[0.99] disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 shrink-0 animate-spin" />
            Opening secure checkout…
          </>
        ) : (
          <>
            {valid ? (
              <>
                Give {formatCurrency(effective, currency)}
                {frequency === "monthly" && " / month"}
              </>
            ) : (
              "Continue to secure checkout"
            )}
            <ArrowUpRight aria-hidden="true" className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
      <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs text-ink-500">
        <Lock aria-hidden="true" className="mt-px size-3.5 shrink-0" />
        You’ll pay on Paystack’s secure page by card or M-Pesa. We never see or store your card details.
        {frequency === "monthly" && " To change or stop a monthly gift at any time, just contact us."}
      </p>
    </form>
  );
}

/** Pre-fills from the homepage quick selector (/donate?amount=…&currency=…&frequency=…). */
export function DonateFormFromQuery(props: Omit<DonateFormProps, "initial">) {
  const q = useSearchParams();
  const amount = Number(q.get("amount"));
  const initial: DonateFormProps["initial"] = {
    frequency: q.get("frequency") === "monthly" ? "monthly" : "one-time",
    currency: (q.get("currency") as CurrencyCode) ?? undefined,
    amount: Number.isFinite(amount) && amount > 0 ? amount : undefined,
    designation: q.get("for") ?? undefined,
  };
  // key: re-mount when the query changes so the initial state applies.
  return <DonateForm key={q.toString()} {...props} initial={initial} />;
}
