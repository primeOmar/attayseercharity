"use client";

import { useEffect, useRef } from "react";
import type { CurrencyCode } from "@/types/content";

const STORAGE_KEY = "atd-currency";

/** Remember a currency the donor picked themselves (wins over detection). */
export function rememberCurrency(c: CurrencyCode) {
  try {
    localStorage.setItem(STORAGE_KEY, c);
  } catch {
    // storage blocked (private mode etc.) — detection still works
  }
}

function stored(): CurrencyCode | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "KES" || v === "USD" ? v : null;
  } catch {
    return null;
  }
}

/** Fallback when there is no geo header (local dev, non-Vercel hosts). */
function fromTimeZone(): CurrencyCode {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone === "Africa/Nairobi" ? "KES" : "USD";
  } catch {
    return "KES";
  }
}

/**
 * Picks the default donation currency once, after hydration:
 *   1. the donor's own earlier choice;
 *   2. their country (Vercel geolocation via /api/geo): Kenya → KES, else USD;
 *   3. their time zone, if the country is unknown.
 * The page renders in KES first (static HTML), so this never blocks paint.
 * `skip` when the currency is already explicit (e.g. carried over in the URL).
 */
export function useVisitorCurrency(apply: (c: CurrencyCode) => void, skip = false) {
  const applyRef = useRef(apply);
  useEffect(() => {
    applyRef.current = apply;
  });

  useEffect(() => {
    if (skip) return;
    let cancelled = false;
    const set = (c: CurrencyCode) => !cancelled && applyRef.current(c);

    const remembered = stored();
    if (remembered) {
      queueMicrotask(() => set(remembered));
      return () => {
        cancelled = true;
      };
    }

    fetch("/api/geo", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { country?: string | null } | null) => set(d?.country ? (d.country === "KE" ? "KES" : "USD") : fromTimeZone()))
      .catch(() => set(fromTimeZone()));

    return () => {
      cancelled = true;
    };
  }, [skip]);
}
