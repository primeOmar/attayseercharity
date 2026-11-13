import { routes } from "@/content/routes";
import { privacy } from "@/content/pages";
import { PageCta, PageHeader, PageSection, routeMetadata } from "@/components/layout/page-shell";

const route = routes.privacy;
export const metadata = routeMetadata(route);

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow={route.eyebrow} title={route.title} description={route.description} path={route.path} />

      <PageSection tone="light">
        <div className="max-w-3xl">
          <p className="text-sm text-ink-500">Last updated {privacy.updated}</p>
          <div className="mt-10 space-y-12">
            {privacy.sections.map((s) => (
              <section key={s.title} aria-labelledby={slug(s.title)}>
                <h2 id={slug(s.title)} className="font-display text-3xl">
                  {s.title}
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-ink-700">{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </PageSection>

      <PageCta />
    </>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
