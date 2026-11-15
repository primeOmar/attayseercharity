import "server-only";
import { cacheLife } from "next/cache";

/** Used if the rate service is unreachable. Override with USD_KES_RATE. */
const FALLBACK_USD_KES = 129;

/**
 * Today's USD → KES rate, cached for a few hours (Cache Components `use cache`).
 * Source: open.er-api.com (free, no key; updates daily). Only used while USD
 * can't be charged natively and gifts are converted to KES.
 */
export async function usdToKesRate(): Promise<number> {
  "use cache";
  cacheLife("hours");

  const fallback = Number(process.env.USD_KES_RATE) || FALLBACK_USD_KES;
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", { signal: AbortSignal.timeout(5_000) });
    const body = (await res.json()) as { result?: string; rates?: Record<string, number> };
    const rate = body.rates?.KES;
    // Sanity bounds: ignore anything wildly off rather than mis-charge donors.
    if (body.result === "success" && typeof rate === "number" && rate > 50 && rate < 500) return rate;
  } catch {
    // fall through
  }
  return fallback;
}

/** USD gift → KES charge, rounded up to the nearest 10 shillings. */
export const usdToKes = (usd: number, rate: number) => Math.ceil((usd * rate) / 10) * 10;
