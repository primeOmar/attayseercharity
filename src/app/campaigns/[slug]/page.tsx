import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { campaigns } from "@/content/home";
import { pageMetadata } from "@/lib/seo";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { FundingProgress } from "@/components/campaigns/campaign-card";
import { SampleBadge } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";

export function generateStaticParams() {
  return campaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/campaigns/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const campaign = campaigns.find((c) => c.slug === slug);
  if (!campaign) return {};
  return pageMetadata({
    title: campaign.title,
    description: campaign.summary,
    path: `/campaigns/${campaign.slug}`,
    image: campaign.image,
    noIndex: true, // sample campaign — never index until verified
  });
}

export default async function CampaignPage({ params }: PageProps<"/campaigns/[slug]">) {
  const { slug } = await params;
  const campaign = campaigns.find((c) => c.slug === slug);
  if (!campaign) notFound();

  return (
    <PagePlaceholder
      eyebrow="Campaign"
      title={campaign.title}
      description={campaign.summary}
      path={`/campaigns/${campaign.slug}`}
      image={campaign.image}
      phase="Phase 3"
    >
      <section aria-label="Funding" data-surface="dark" className="bg-ink-950 py-16">
        <div className="container-site max-w-3xl">
          {!campaign.verified && <SampleBadge className="mb-6">Sample campaign — figures for illustration only</SampleBadge>}
          <FundingProgress campaign={campaign} />
          <ButtonLink href={`/donate?campaign=${campaign.slug}`} className="mt-8">
            Donate to this campaign
          </ButtonLink>
        </div>
      </section>
    </PagePlaceholder>
  );
}
