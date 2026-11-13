import type { Metadata } from "next";
import { site } from "@/content/site";
import { donationProcess } from "@/content/home";
import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { Mission } from "@/components/home/mission";
import { ImpactStats } from "@/components/home/impact-stats";
import { FeaturedCampaigns } from "@/components/home/featured-campaigns";
import { CausesSection } from "@/components/home/causes-section";
import { ImpactStories } from "@/components/home/impact-stories";
import { DonationProcess } from "@/components/home/donation-process";
import { VolunteerSection } from "@/components/home/volunteer-section";
import { TransparencySection } from "@/components/home/transparency-section";
import { FinalCta } from "@/components/home/final-cta";
import { SnapSection } from "@/components/layout/snap-section";
import { SectionTransitions } from "@/components/layout/section-transitions";
import { SectionNav } from "@/components/layout/section-nav";

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    path: "/",
    // OG image comes from app/opengraph-image.tsx
  }),
  // The root title shouldn't get the "· Site name" template suffix.
  title: { absolute: `${site.name} — ${site.tagline}` },
};

/**
 * Homepage narrative:
 * promise (hero) → belief (mission) → proof (impact) → action (campaigns)
 * → breadth (causes) → people (stories) → trust (process, transparency)
 * → participation (volunteer) → conversion (final CTA).
 */
export default function HomePage() {
  return (
    <>
      <SnapSection label="Welcome"><Hero /></SnapSection>
      <SnapSection label="Mission"><Mission /></SnapSection>
      <SnapSection label="Impact"><ImpactStats /></SnapSection>
      <SnapSection label="Campaigns"><FeaturedCampaigns /></SnapSection>
      <SnapSection label="Causes"><CausesSection /></SnapSection>
      <SnapSection label="Stories"><ImpactStories /></SnapSection>
      <SnapSection label="How it works"><DonationProcess steps={donationProcess} /></SnapSection>
      <SnapSection label="Volunteer"><VolunteerSection /></SnapSection>
      <SnapSection label="Transparency"><TransparencySection /></SnapSection>
      <SnapSection label="Give"><FinalCta /></SnapSection>
      {/* Client-only enhancements: section hand-off motion + side section rail */}
      <SectionTransitions />
      <SectionNav />
    </>
  );
}
