import Image from "next/image";
import { finalCta } from "@/content/home";
import { QuickDonate } from "@/components/donation/quick-donate";
import { SplitLines } from "@/components/ui/primitives";
import { LogoMark } from "@/components/ui/logo";

/** Forge "Refuse Ordinary" closing frame, adapted into a conversion moment. */
export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="relative isolate overflow-hidden bg-gold-200 bg-[linear-gradient(170deg,#fffaf0_0%,#feef99_55%,#fcd460_100%)] py-[var(--spacing-section)] text-ink-950">
      <Image
        src={finalCta.image.src}
        alt={finalCta.image.alt}
        fill
        sizes="100vw"
        className="-z-10 object-cover object-top opacity-[0.14] mix-blend-multiply grayscale"
      />

      <div className="container-site flex flex-col items-center text-center">
        {/* The emblem closes the story — its ring and star echo the logo crown */}
        <div data-reveal className="relative mb-10 grid place-items-center">
          <span aria-hidden="true" className="absolute size-44 rounded-full border border-gold-700/30 sm:size-56" />
          <span aria-hidden="true" className="absolute size-64 rounded-full border border-gold-700/15 sm:size-80" />
          <LogoMark className="h-24 drop-shadow-[0_14px_30px_rgb(176_100_1/0.3)] sm:h-28" />
        </div>
        <p data-reveal className="eyebrow text-red-600">
          {finalCta.eyebrow}
        </p>
        <h2 id="final-cta-title" data-reveal="lines" className="mt-6 font-display text-display-lg">
          <SplitLines lines={finalCta.title} italicLast accent="green" />
        </h2>
        <p data-reveal className="mt-6 max-w-md text-ink-700">
          {finalCta.body}
        </p>
        <div data-reveal className="mt-12 flex w-full justify-center">
          <QuickDonate />
        </div>
      </div>
    </section>
  );
}
