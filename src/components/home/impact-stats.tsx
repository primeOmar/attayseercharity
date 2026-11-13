import { impactStats } from "@/content/home";
import { Eyebrow, SampleBadge, SplitLines } from "@/components/ui/primitives";
import { CountUp } from "./count-up";

export function ImpactStats() {
  const hasUnverified = impactStats.some((s) => !s.verified);

  return (
    <section id="impact" aria-labelledby="impact-title" className="bg-ivory-200 py-[var(--spacing-section)] text-ink-950">
      <div className="container-site grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow tone="red">Our impact</Eyebrow>
          <h2 id="impact-title" data-reveal="lines" className="mt-6 font-display text-display-md">
            <SplitLines lines={["Impact you can", "measure — and trust."]} italicLast accent="green" />
          </h2>
          <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed text-ink-700">
            We count what matters and publish how we count it. Every figure here will be traceable to a programme
            report.
          </p>
          {hasUnverified && <SampleBadge tone="light" className="mt-8" />}
        </div>

        <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:col-span-7">
          {impactStats.map((stat, i) => (
            <div
              key={stat.id}
              data-reveal
              data-reveal-delay={i * 90}
              className="flex flex-col-reverse justify-end border-t border-ink-950/15 py-8 sm:py-10"
            >
              <dt className="mt-3 text-sm font-medium tracking-wide text-ink-500 uppercase">{stat.label}</dt>
              <dd className="font-display text-[clamp(3.25rem,2rem+4vw,6rem)] leading-none text-ink-950">
                <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
