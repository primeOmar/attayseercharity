import { campaigns } from "@/content/home";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, SampleBadge, SplitLines } from "@/components/ui/primitives";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { HorizontalItem, HorizontalScroll } from "./horizontal-scroll";

export function FeaturedCampaigns() {
  const featured = campaigns.filter((c) => c.featured);
  const unverified = featured.some((c) => !c.verified);

  return (
    <section aria-labelledby="campaigns-title" className="overflow-x-clip bg-ivory-50 pt-[var(--spacing-section)] pb-[calc(var(--spacing-section)*0.6)] text-ink-950">
      <div className="container-site mb-10 grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Eyebrow tone="red">Upcoming initiatives</Eyebrow>
          <h2 id="campaigns-title" data-reveal="lines" className="mt-6 font-display text-display-md">
            <SplitLines lines={["What we’re", "planning next."]} italicLast accent="green" />
          </h2>
        </div>
        <div data-reveal className="flex flex-col items-start gap-5 lg:col-span-5 lg:items-end lg:text-right">
          {unverified && <SampleBadge tone="light">Sample campaigns — figures for illustration only</SampleBadge>}
          <ButtonLink href="/campaigns" variant="ghost-dark" size="sm">
            All initiatives
          </ButtonLink>
        </div>
      </div>

      {/* overflow-x-clip (not hidden) on the section keeps the pinned track sticky. */}
      <HorizontalScroll label="Upcoming initiatives">
        {featured.map((campaign, i) => (
          <HorizontalItem key={campaign.slug}>
            <div data-reveal data-reveal-delay={i * 100} className="h-full">
              <CampaignCard campaign={campaign} className="h-full" />
            </div>
          </HorizontalItem>
        ))}
        <HorizontalItem className="lg:w-[min(30vw,26rem)]">
          <div className="flex h-full flex-col justify-between rounded-photo bg-green-deep p-8 text-ivory-50 sm:p-10" data-surface="dark">
            <p className="eyebrow text-gold-400">Get involved</p>
            <div>
              <p className="mt-10 font-display text-[clamp(2rem,1.5rem+1.6vw,3rem)] leading-[1.05]">
                Every initiative starts with a conversation.
              </p>
              <p className="mt-4 leading-relaxed text-ivory-100/80">
                Contact us about current needs and approved support arrangements.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/donate" size="sm" magnetic>
                Support us
              </ButtonLink>
              <ButtonLink href="/campaigns" variant="outline" size="sm" arrow={false}>
                All initiatives
              </ButtonLink>
            </div>
          </div>
        </HorizontalItem>
      </HorizontalScroll>
    </section>
  );
}
