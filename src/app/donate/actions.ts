"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { campaigns, causes } from "@/content/home";
import {
  AMOUNT_LIMITS,
  PAYSTACK_CURRENCIES,
  PaystackError,
  ensureMonthlyPlan,
  initializeTransaction,
  paystackUsdEnabled,
  type PaystackCurrency,
} from "@/lib/paystack";
import { usdToKes, usdToKesRate } from "@/lib/fx";
import { formatCurrency } from "@/lib/utils";

export interface DonateState {
  error?: string;
  fieldErrors?: Partial<Record<"amount" | "email" | "name", string>>;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Valid "designation" values: a programme or an initiative, else general fund. */
const designations = new Set([...causes.map((c) => c.slug), ...campaigns.map((c) => c.slug)]);

/**
 * Where Paystack sends the donor back to: the very host they are giving from,
 * so the return page is always one they can open.
 *
 * Never VERCEL_URL — that is the per-deployment address
 * (project-abc123-team.vercel.app), which Vercel Deployment Protection puts
 * behind a Vercel login. SITE_URL can still force an origin explicitly.
 * (A spoofed Host header could only redirect the spoofer's own checkout.)
 */
async function siteOrigin() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host"))?.split(",")[0].trim();
  if (host && /^[a-z0-9.-]+(:\d+)?$/i.test(host)) {
    const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
    return `${local ? "http" : "https"}://${host}`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export async function startDonation(_prev: DonateState, formData: FormData): Promise<DonateState> {
  const str = (k: string) => String(formData.get(k) ?? "").trim();

  // --- Validate (never trust the client) ---
  const currency = str("currency") as PaystackCurrency;
  if (!PAYSTACK_CURRENCIES.includes(currency)) return { error: "Please choose a supported currency." };

  const frequency = str("frequency") === "monthly" ? "monthly" : "one-time";
  // A typed "other" amount wins over the preset radio (works without JS too).
  const amount = Math.round(Number((str("custom") || str("preset")).replace(/[,\s]/g, "")));
  const email = str("email").toLowerCase();
  const name = str("name").slice(0, 120);
  const designationRaw = str("designation");
  const designation = designations.has(designationRaw) ? designationRaw : "general";

  const fieldErrors: DonateState["fieldErrors"] = {};
  const { min, max } = AMOUNT_LIMITS[currency];
  if (!Number.isFinite(amount) || amount < min) fieldErrors.amount = `The minimum gift is ${formatCurrency(min, currency)}.`;
  else if (amount > max) fieldErrors.amount = `For gifts above ${formatCurrency(max, currency)}, please contact us directly.`;
  if (!EMAIL.test(email) || email.length > 254) fieldErrors.email = "Enter a valid email address for your receipt.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  // --- Start the Paystack checkout ---
  const reference = `ATD-${Date.now().toString(36)}-${randomBytes(4).toString("hex")}`.toUpperCase();
  let checkoutUrl: string;
  try {
    // USD can only be charged natively once Paystack enables it; until then the
    // gift is charged as its KES equivalent (the donor saw the estimate).
    let charge = { amount, currency };
    let conversion: { pledged_amount: number; pledged_currency: string; usd_kes_rate: number } | undefined;
    if (currency === "USD" && !paystackUsdEnabled()) {
      const rate = await usdToKesRate();
      charge = { amount: usdToKes(amount, rate), currency: "KES" };
      conversion = { pledged_amount: amount, pledged_currency: "USD", usd_kes_rate: rate };
    }

    const plan = frequency === "monthly" ? await ensureMonthlyPlan(charge.amount, charge.currency) : undefined;
    const tx = await initializeTransaction({
      email,
      amount: charge.amount,
      currency: charge.currency,
      reference,
      plan,
      callbackUrl: `${await siteOrigin()}/donate/thank-you`,
      metadata: {
        donor_name: name || undefined,
        frequency,
        designation,
        ...conversion,
        // Shown on the transaction in the Paystack dashboard.
        custom_fields: [
          ...(conversion
            ? [{ display_name: "Pledged", variable_name: "pledged", value: `USD ${conversion.pledged_amount} @ ${conversion.usd_kes_rate.toFixed(2)}` }]
            : []),
          { display_name: "Donor name", variable_name: "donor_name", value: name || "—" },
          { display_name: "Frequency", variable_name: "frequency", value: frequency },
          { display_name: "Designation", variable_name: "designation", value: designation },
        ],
      },
    });
    checkoutUrl = tx.authorization_url;
  } catch (err) {
    if (!(err instanceof PaystackError)) console.error("[donate]", err);
    return {
      error:
        err instanceof PaystackError && err.message.includes("not configured")
          ? "Online giving is being set up. Please contact us to give in the meantime."
          : "We couldn’t reach our payment provider. Please try again in a moment.",
    };
  }

  // redirect() throws, so it stays outside the try/catch.
  redirect(checkoutUrl);
}
