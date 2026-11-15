import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { CurrencyCode } from "@/types/content";

/**
 * Minimal Paystack client (server only — the secret key never reaches the browser).
 * Docs: https://paystack.com/docs/api/
 *
 * Sandbox vs live is decided purely by the key: `sk_test_…` runs in test mode
 * (no real money moves), `sk_live_…` takes real payments.
 */

const API = "https://api.paystack.co";

/** Currencies this foundation's Paystack (Kenya) account can charge in. */
// USD needs enabling by Paystack on the merchant account (currently rejected).
export const PAYSTACK_CURRENCIES = ["KES"] as const satisfies readonly CurrencyCode[];
export type PaystackCurrency = (typeof PAYSTACK_CURRENCIES)[number];

/** Sensible bounds, in major units, so typos ("250000000") are caught early. */
export const AMOUNT_LIMITS: Record<PaystackCurrency, { min: number; max: number }> = {
  KES: { min: 100, max: 1_000_000 },
};

export function paystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

export function paystackTestMode() {
  return (process.env.PAYSTACK_SECRET_KEY ?? "").startsWith("sk_test_");
}

export class PaystackError extends Error {}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new PaystackError("Online giving is not configured yet.");

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const body = (await res.json().catch(() => null)) as { status?: boolean; message?: string; data?: T } | null;
  if (!res.ok || !body?.status) {
    // Paystack's message is safe to log, but keep what we show donors generic.
    console.error(`[paystack] ${init.method ?? "GET"} ${path} → ${res.status}: ${body?.message ?? "no body"}`);
    throw new PaystackError(body?.message ?? `Paystack request failed (${res.status})`);
  }
  return body.data as T;
}

/** Paystack amounts are in the currency's subunit (cents). */
export const toSubunit = (amount: number) => Math.round(amount * 100);
export const fromSubunit = (amount: number) => amount / 100;

export interface InitializeInput {
  email: string;
  amount: number; // major units
  currency: PaystackCurrency;
  reference: string;
  callbackUrl: string;
  plan?: string;
  metadata?: Record<string, unknown>;
}

export async function initializeTransaction(input: InitializeInput) {
  return call<{ authorization_url: string; access_code: string; reference: string }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: toSubunit(input.amount),
      currency: input.currency,
      reference: input.reference,
      callback_url: input.callbackUrl,
      ...(input.plan ? { plan: input.plan } : {}),
      metadata: input.metadata,
    }),
  });
}

export interface VerifiedTransaction {
  status: "success" | "failed" | "abandoned" | "ongoing" | "pending" | "processing" | "queued" | "reversed";
  reference: string;
  amount: number; // subunits
  currency: string;
  paid_at: string | null;
  channel: string;
  customer: { email: string };
  metadata: { donor_name?: string; frequency?: string; designation?: string } | null;
  plan?: unknown;
}

export async function verifyTransaction(reference: string) {
  return call<VerifiedTransaction>(`/transaction/verify/${encodeURIComponent(reference)}`);
}

/**
 * Monthly giving uses a Paystack plan per (amount, currency). Plans are found by
 * name and created on first use, so no dashboard setup is needed.
 */
export async function ensureMonthlyPlan(amount: number, currency: PaystackCurrency) {
  const name = `Monthly gift — ${currency} ${amount}`;
  const plans = await call<{ name: string; plan_code: string; amount: number; currency: string; interval: string }[]>(
    `/plan?perPage=100&interval=monthly&amount=${toSubunit(amount)}`,
  );
  const existing = plans.find((p) => p.name === name && p.currency === currency && p.interval === "monthly");
  if (existing) return existing.plan_code;
  const created = await call<{ plan_code: string }>("/plan", {
    method: "POST",
    body: JSON.stringify({ name, interval: "monthly", amount: toSubunit(amount), currency }),
  });
  return created.plan_code;
}

/** Webhook authenticity: HMAC-SHA512 of the raw body with the secret key. */
export function validWebhookSignature(rawBody: string, signature: string | null) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key || !signature) return false;
  const expected = createHmac("sha512", key).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
