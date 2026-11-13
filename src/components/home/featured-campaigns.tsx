import { campaigns } from "@/content/home";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, SampleBadge, SplitLines } from "@/components/ui/primitives";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { CampaignRail } from "./campaign-rail";

export function FeaturedCampaigns() {
  const featured = campaigns.filter((c) => c.featured);
  const unverified = featured.some((c) => !c.verified);

  return (
    <section aria-labelledby="campaigns-title" className="overflow-hidden bg-ivory-50 pt-[var(--spacing-section)] pb-[calc(var(--spacing-section)*0.6)] text-ink-950">
      <div className="container-site mb-10 grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Eyebrow tone="red">Featured campaigns</Eyebrow>
          <h2 id="campaigns-title" data-reveal="lines" className="mt-6 font-display text-display-md">
            <SplitLines lines={["Appeals that need", "you right now."]} italicLast accent="green" />
          </h2>
        </div>
        <div data-reveal className="flex flex-col items-start gap-5 lg:col-span-5 lg:items-end lg:text-right">
          {unverified && <SampleBadge tone="light">Sample campaigns — figures for illustration only</SampleBadge>}
          <ButtonLink href="/campaigns" variant="ghost-dark" size="sm">
            View all campaigns
          </ButtonLink>
        </div>
      </div>

      <CampaignRail label="Featured campaigns">
        {featured.map((campaign, i) => (
          <div
            key={campaign.slug}
            data-card
            data-reveal
            data-reveal-delay={i * 100}
            className="w-[85vw] max-w-[30rem] shrink-0 snap-start sm:w-[60vw] lg:w-[calc((min(100vw,var(--container-site))-2*var(--spacing-gutter)-3rem)/3)]"
          >
            <CampaignCard campaign={campaign} className="h-full" />
          </div>
        ))}
      </CampaignRail>
    </section>
  );
}
