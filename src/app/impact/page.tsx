import { routes } from "@/content/routes";
import { impactStats } from "@/content/home";
import { activities } from "@/content/pages";
import { PageCta, PageHeader, PageSection, routeMetadata } from "@/components/layout/page-shell";
import { ActivityReport } from "@/components/impact/activity-report";
import { CountUp } from "@/components/home/count-up";
import { ButtonLink } from "@/components/ui/button";

const route = routes.impact;
export const metadata = routeMetadata(route);

export default function ImpactPage() {
  return (
    <>
      <PageHeader eyebrow={route.eyebrow} title={route.title} description={route.description} path={route.path} image={route.image} />

      <PageSection eyebrow="2026 at a glance" tone="sand">
        <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {impactStats.map((stat, i) => (
            <div
              key={stat.id}
              data-reveal
              data-reveal-delay={i * 90}
              className="flex flex-col-reverse justify-end border-t border-ink-950/15 py-8"
            >
              <dt className="mt-3 text-sm font-medium tracking-wide text-ink-500 uppercase">{stat.label}</dt>
              <dd className="font-display text-[clamp(3rem,2rem+3vw,5rem)] leading-none text-ink-950">
                <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </PageSection>

      <PageSection
        id="activities"
        eyebrow="Activity reports"
        title="What we did, where, and who it reached."
        intro="We document our activities responsibly and update this page with verifiable information about our programmes, the resources used and the outcomes."
        tone="light"
      >
        <div className="space-y-24 lg:space-y-32">
          {activities.map((a, i) => (
            <ActivityReport key={a.slug} activity={a} flip={i % 2 === 1} />
          ))}
        </div>
      </PageSection>

      <PageSection tone="warm">
        <div data-reveal className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-lg leading-relaxed text-ink-700">
            We do not publish personal beneficiary information. Questions about our reporting? Contact us at any time.
          </p>
          <ButtonLink href="/transparency" variant="ghost-dark" size="sm">
            Transparency
          </ButtonLink>
        </div>
      </PageSection>

      <PageCta />
    </>
  );
}
