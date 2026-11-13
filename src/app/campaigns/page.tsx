import { routes } from "@/content/routes";
import { campaigns } from "@/content/home";
import { PageCta, PageHeader, PageSection, routeMetadata } from "@/components/layout/page-shell";
import { CampaignCard } from "@/components/campaigns/campaign-card";

const route = routes.campaigns;
export const metadata = routeMetadata(route);

export default function InitiativesPage() {
  return (
    <>
      <PageHeader eyebrow={route.eyebrow} title={route.title} description={route.description} path={route.path} image={route.image} />

      <PageSection
        eyebrow="Coming up"
        intro="These initiatives are planned and depend on the support of individuals, institutions and partners. Contact us to learn about current needs and approved support arrangements."
        tone="warm"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c, i) => (
            <div key={c.slug} data-reveal data-reveal-delay={i * 100}>
              <CampaignCard campaign={c} className="h-full" />
            </div>
          ))}
        </div>
      </PageSection>

      <PageCta title="Help make the next initiative happen." />
    </>
  );
}
