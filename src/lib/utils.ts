import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CurrencyCode } from "@/types/content";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyLocale: Record<CurrencyCode, string> = {
  KES: "en-KE",
  USD: "en-US",
  EUR: "en-IE",
  GBP: "en-GB",
};

export function formatCurrency(amount: number, currency: CurrencyCode, compact = false) {
  return new Intl.NumberFormat(currencyLocale[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(amount);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-KE").format(value);
}

export function percentOf(raised: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}
