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
  type PaystackCurrency,
} from "@/lib/paystack";
import { formatCurrency } from "@/lib/utils";

export interface DonateState {
  error?: string;
  fieldErrors?: Partial<Record<"amount" | "email" | "name", string>>;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Valid "designation" values: a programme or an initiative, else general fund. */
const designations = new Set([...causes.map((c) => c.slug), ...campaigns.map((c) => c.slug)]);

/**
 * Where Paystack sends the donor back to. Prefer the configured site URL; on
 * Vercel preview deployments fall back to that deployment's own URL; locally,
 * to the request's host.
 */
async function siteOrigin() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production" && process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
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
    const plan = frequency === "monthly" ? await ensureMonthlyPlan(amount, currency) : undefined;
    const tx = await initializeTransaction({
      email,
      amount,
      currency,
      reference,
      plan,
      callbackUrl: `${await siteOrigin()}/donate/thank-you`,
      metadata: {
        donor_name: name || undefined,
        frequency,
        designation,
        // Shown on the transaction in the Paystack dashboard.
        custom_fields: [
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
