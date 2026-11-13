"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

/** Pragmatic email check; the server will re-validate once signup is connected. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Newsletter signup (frontend only).
 * Dependency-free on purpose: it ships in the footer of every page, so it must
 * stay tiny. TODO(backend): POST to the mailing-list provider. Until then the
 * success state explicitly says nothing was sent.
 */
export function NewsletterForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!EMAIL.test(email)) {
      setError("Please enter a valid email address.");
      e.currentTarget.querySelector<HTMLInputElement>("input")?.focus();
      return;
    }
    setError(null);
    setDone(true);
  };

  if (done) {
    return (
      <p role="status" className="flex items-start gap-3 text-sm text-ivory-100">
        <Check aria-hidden="true" className="mt-0.5 size-4 text-gold-400" />
        <span>
          Thanks! <span className="text-ivory-200/90">(Preview only — newsletter signup is not yet connected.)</span>
        </span>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center border-b border-ivory-100/30 transition-colors focus-within:border-gold-400">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-error" : undefined}
          onChange={() => error && setError(null)}
          className="min-w-0 flex-1 bg-transparent py-4 text-base text-ivory-50 placeholder:text-ivory-200/75 focus:outline-none"
        />
        <button
          type="submit"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-gold-metal text-ink-950 transition-transform hover:scale-105"
        >
          <ArrowRight aria-hidden="true" className="size-4" />
          <span className="sr-only">Subscribe</span>
        </button>
      </div>
      {error && (
        <p id="newsletter-error" role="alert" className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </form>
  );
}
