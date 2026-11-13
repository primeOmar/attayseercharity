import { causes } from "@/content/home";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, SplitLines } from "@/components/ui/primitives";
import { CausesIndex } from "./causes-index";

export function CausesSection() {
  const active = causes.filter((c) => c.active);
  return (
    <section aria-labelledby="causes-title" className="bg-ivory-100 py-[var(--spacing-section)] text-ink-950">
      <div className="container-site">
        <div className="mb-14 flex flex-col gap-8 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow tone="green">Our causes</Eyebrow>
            <h2 id="causes-title" data-reveal="lines" className="mt-6 font-display text-display-md">
              <SplitLines lines={["Where your support", "goes to work."]} italicLast accent="green" />
            </h2>
          </div>
          <div data-reveal className="max-w-sm">
            <p className="text-ink-700">
              {active.length} focus areas, one approach: listen first, fund what communities prioritise, and stay until it lasts.
            </p>
            <ButtonLink href="/causes" variant="ghost-dark" size="sm" className="mt-6">
              All causes
            </ButtonLink>
          </div>
        </div>
        <CausesIndex causes={active} />
      </div>
    </section>
  );
}
