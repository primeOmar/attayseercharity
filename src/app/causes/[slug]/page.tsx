import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { causes, campaigns } from "@/content/home";
import { pageMetadata } from "@/lib/seo";
import { PagePlaceholder } from "@/components/layout/page-placeholder";
import { CampaignCard } from "@/components/campaigns/campaign-card";

export function generateStaticParams() {
  return causes.filter((c) => c.active).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/causes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cause = causes.find((c) => c.slug === slug && c.active);
  if (!cause) return {};
  return pageMetadata({
    title: cause.title,
    description: cause.summary,
    path: `/causes/${cause.slug}`,
    image: cause.image,
    noIndex: true, // until Phase 3 content is approved
  });
}

export default async function CausePage({ params }: PageProps<"/causes/[slug]">) {
  const { slug } = await params;
  const cause = causes.find((c) => c.slug === slug && c.active);
  if (!cause) notFound();
  const related = campaigns.filter((c) => c.causeSlug === cause.slug);

  return (
    <PagePlaceholder
      eyebrow={cause.title}
      title={cause.summary}
      description={cause.description}
      path={`/causes/${cause.slug}`}
      image={cause.image}
      phase="Phase 3"
    >
      {related.length > 0 && (
        <section aria-labelledby="related-title" data-surface="dark" className="bg-ink-950 py-20">
          <div className="container-site">
            <h2 id="related-title" className="font-display text-display-sm text-ivory-50">
              Upcoming initiatives
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CampaignCard key={c.slug} campaign={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </PagePlaceholder>
  );
}
