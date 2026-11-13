"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Check } from "lucide-react";

const schema = z.object({
  email: z.email("Please enter a valid email address."),
});
type Values = z.infer<typeof schema>;

/**
 * Newsletter signup (frontend only).
 * TODO(backend): POST to the mailing-list provider. Until then the success
 * state explicitly says nothing was sent.
 */
export function NewsletterForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 400));
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center border-b border-ivory-100/30 transition-colors focus-within:border-gold-400">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "newsletter-error" : undefined}
          className="min-w-0 flex-1 bg-transparent py-4 text-base text-ivory-50 placeholder:text-ivory-200/75 focus:outline-none"
          {...register("email")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-gold-metal text-ink-950 transition-transform hover:scale-105 disabled:opacity-60"
        >
          <ArrowRight aria-hidden="true" className="size-4" />
          <span className="sr-only">Subscribe</span>
        </button>
      </div>
      {errors.email && (
        <p id="newsletter-error" role="alert" className="mt-2 text-sm text-red-500">
          {errors.email.message}
        </p>
      )}
    </form>
  );
}
