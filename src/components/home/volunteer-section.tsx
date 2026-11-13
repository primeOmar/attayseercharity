import Image from "next/image";
import { volunteer } from "@/content/home";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, SplitLines } from "@/components/ui/primitives";

export function VolunteerSection() {
  return (
    <section aria-labelledby="volunteer-title" data-surface="dark" className="relative overflow-hidden bg-green-700 bg-[radial-gradient(90%_80%_at_8%_10%,#299725_0%,#0c5814_55%,#074b0f_100%)] py-[var(--spacing-section)]">
      {/* Oversized outline word — quiet texture, decorative only */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -right-[4vw] bottom-[-3vw] font-display text-[22vw] leading-none text-transparent italic select-none [-webkit-text-stroke:1px_rgb(254_239_153/0.22)]"
      >
        together
      </p>

      <div className="relative container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="relative lg:col-span-6">
          <div data-reveal="image" className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src={volunteer.image.src}
              alt={volunteer.image.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <span aria-hidden="true" className="absolute -bottom-4 -left-4 hidden h-2/5 w-2/5 border-b-2 border-l-2 border-gold-500 sm:block" />
        </div>

        <div className="lg:col-span-6">
          <Eyebrow>{volunteer.eyebrow}</Eyebrow>
          <h2 id="volunteer-title" data-reveal="lines" className="mt-6 font-display text-display-md text-ivory-50">
            <SplitLines lines={volunteer.title} italicLast accent="gold" />
          </h2>
          <p data-reveal className="mt-8 max-w-lg text-lg leading-relaxed text-ivory-100/85">
            {volunteer.body}
          </p>

          <ul data-reveal aria-label="Ways to volunteer" className="mt-10 flex flex-wrap gap-2.5">
            {volunteer.roles.map((role) => (
              <li
                key={role}
                className="rounded-pill border border-ivory-100/20 px-4 py-2 text-sm text-ivory-100 transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                {role}
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href="/volunteer" size="lg">
              Become a volunteer
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg" arrow={false}>
              Talk to our team
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
