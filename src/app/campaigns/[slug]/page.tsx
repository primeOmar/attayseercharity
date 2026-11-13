import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { campaigns, causes } from "@/content/home";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";
import { PageCta, PageHeader, PageSection } from "@/components/layout/page-shell";
import { FundingProgress, hasFunding, supportHref } from "@/components/campaigns/campaign-card";
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
    noIndex: !campaign.verified,
  });
}

export default async function InitiativePage({ params }: PageProps<"/campaigns/[slug]">) {
  const { slug } = await params;
  const campaign = campaigns.find((c) => c.slug === slug);
  if (!campaign) notFound();
  const cause = causes.find((c) => c.slug === campaign.causeSlug);
  const path = `/campaigns/${campaign.slug}`;

  return (
    <>
      <PageHeader
        eyebrow={campaign.title}
        title={campaign.title}
        description={campaign.summary}
        path={path}
        image={campaign.image}
        crumbs={[
          { name: "Home", path: "/" },
          { name: routes.campaigns.eyebrow, path: routes.campaigns.path },
          { name: campaign.title, path },
        ]}
      >
        {campaign.when && (
          <p className="mt-8 inline-flex items-center gap-2 rounded-pill border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-sm text-gold-300">
            <CalendarDays aria-hidden="true" className="size-4" />
            Planned for {campaign.when}
          </p>
        )}
      </PageHeader>

      <PageSection tone="light">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div data-reveal className="lg:col-span-7">
            {!campaign.verified && <SampleBadge tone="light" className="mb-6">Sample campaign — figures for illustration only</SampleBadge>}
            {hasFunding(campaign) ? (
              <FundingProgress campaign={campaign} tone="light" />
            ) : (
              <p className="text-xl leading-relaxed text-ink-800">
                Contact the foundation to learn about current needs and approved support arrangements for this
                initiative — whether you are an individual, an institution or an organisation.
              </p>
            )}
            <ButtonLink href={supportHref(campaign)} variant="solid-dark" className="mt-8">
              {hasFunding(campaign) ? "Donate to this initiative" : "Support this initiative"}
            </ButtonLink>
          </div>
          {cause && (
            <aside data-reveal className="rounded-photo bg-ivory-200 p-7 lg:col-span-5">
              <p className="eyebrow text-ink-500">Part of our programme</p>
              <p className="mt-3 font-display text-3xl leading-tight">{cause.title}</p>
              <p className="mt-3 leading-relaxed text-ink-700">{cause.summary}</p>
              <Link href={`/causes/${cause.slug}`} className="mt-5 inline-block font-medium underline underline-offset-4 hover:text-green-700">
                About this programme
              </Link>
            </aside>
          )}
        </div>
      </PageSection>

      <PageCta />
    </>
  );
}
