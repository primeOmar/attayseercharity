import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { causes, campaigns } from "@/content/home";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";
import { PageCta, PageHeader, PageSection } from "@/components/layout/page-shell";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { ProgrammeHighlights } from "@/components/programmes/programme-highlights";

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
  });
}

export default async function ProgrammePage({ params }: PageProps<"/causes/[slug]">) {
  const { slug } = await params;
  const cause = causes.find((c) => c.slug === slug && c.active);
  if (!cause) notFound();
  const related = campaigns.filter((c) => c.causeSlug === cause.slug);
  const path = `/causes/${cause.slug}`;

  return (
    <>
      <PageHeader
        eyebrow={cause.title}
        title={cause.summary}
        path={path}
        image={cause.image}
        crumbs={[
          { name: "Home", path: "/" },
          { name: routes.causes.eyebrow, path: routes.causes.path },
          { name: cause.title, path },
        ]}
      />

      <PageSection tone="light">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <p data-reveal className="text-xl leading-relaxed text-ink-800 lg:col-span-7">
            {cause.description}
          </p>
          {cause.highlights?.length ? (
            <div data-reveal className="rounded-photo bg-ivory-200 p-7 lg:col-span-5">
              <h2 className="eyebrow mb-5 text-ink-500">Recent & upcoming</h2>
              <ProgrammeHighlights cause={cause} />
            </div>
          ) : null}
        </div>
      </PageSection>

      {related.length > 0 && (
        <PageSection eyebrow="Upcoming initiatives" title={`Get involved in ${cause.title.toLowerCase()}.`} tone="dark">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CampaignCard key={c.slug} campaign={c} />
            ))}
          </div>
        </PageSection>
      )}

      <PageCta />
    </>
  );
}
