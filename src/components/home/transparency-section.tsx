import { FileText } from "lucide-react";
import { transparency } from "@/content/home";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, SampleBadge } from "@/components/ui/primitives";
import { cn, pad2 } from "@/lib/utils";

const toneBg = {
  green: "bg-green-metal",
  gold: "bg-gold-metal",
  red: "bg-red-metal",
  neutral: "bg-ink-400",
} as const;

export function TransparencySection() {
  return (
    <section aria-labelledby="transparency-title" className="bg-ivory-50 py-[var(--spacing-section)] text-ink-950">
      <div className="container-site grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow tone="red">{transparency.eyebrow}</Eyebrow>
          <h2 id="transparency-title" data-reveal className="mt-6 font-display text-display-md">
            {transparency.title}
          </h2>
          <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed text-ink-700">
            {transparency.body}
          </p>

          {/* Allocation — shown only once a split is published */}
          {transparency.allocation.length > 0 && (
          <figure data-reveal className="mt-12">
            <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-medium tracking-wide uppercase">How each gift is allocated</span>
              {!transparency.allocationVerified && <SampleBadge tone="light">Sample split</SampleBadge>}
            </figcaption>
            <div className="flex h-3 w-full gap-1 overflow-hidden" aria-hidden="true">
              {transparency.allocation.map((a) => (
                <span key={a.label} data-reveal="bar" className={cn("h-full", toneBg[a.tone])} style={{ width: `${a.percent}%` }} />
              ))}
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
              {transparency.allocation.map((a) => (
                <div key={a.label}>
                  <dt className="flex items-center gap-2 text-xs text-ink-700 sm:text-sm">
                    <span aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-full", toneBg[a.tone])} />
                    {a.label}
                  </dt>
                  <dd className="mt-1 font-display text-4xl">{a.percent}%</dd>
                </div>
              ))}
            </dl>
          </figure>
          )}
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <ol className="grid gap-x-10 sm:grid-cols-2">
            {transparency.commitments.map((c, i) => (
              <li key={c.title} data-reveal data-reveal-delay={i * 80} className="border-t border-ink-950/15 py-7">
                <span className="eyebrow text-red-600 tabular-nums">{pad2(i + 1)}</span>
                <h3 className="mt-3 font-display text-[1.9rem] leading-tight">{c.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-700">{c.body}</p>
              </li>
            ))}
          </ol>

          <div data-reveal className="mt-10 bg-ivory-50 p-6 sm:p-8">
            <h3 className="eyebrow text-ink-500">Reports</h3>
            <ul className="mt-4 divide-y divide-ink-950/10">
              {transparency.reports.map((r) => (
                <li key={r.title} className="flex items-center gap-4 py-4">
                  <FileText aria-hidden="true" className="size-5 shrink-0 text-ink-500" />
                  <span className="flex-1">
                    <span className="block font-medium">{r.title}</span>
                    <span className="text-sm text-ink-500">{r.period}</span>
                  </span>
                  {r.status === "available" && r.href ? (
                    <a href={r.href} className="text-sm font-medium underline underline-offset-4">
                      Download
                    </a>
                  ) : (
                    <span className="rounded-pill bg-ink-950/5 px-3 py-1 text-xs font-medium text-ink-700">Coming soon</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <ButtonLink href="/transparency" variant="solid-dark" className="mt-10">
            Visit the transparency hub
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
