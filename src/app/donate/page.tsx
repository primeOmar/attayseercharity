import Link from "next/link";
import { routes } from "@/content/routes";
import { campaigns, causes, donationProcess } from "@/content/home";
import { PageCta, PageHeader, PageSection, routeMetadata } from "@/components/layout/page-shell";
import { ContactCards } from "@/components/contact/contact-cards";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { pad2 } from "@/lib/utils";

const route = routes.donate;
export const metadata = routeMetadata(route);

/**
 * The foundation does not publish payment details; supporters arrange giving
 * directly with the team. Replace with a payment flow once one is approved.
 */
export default function SupportPage() {
  return (
    <>
      <PageHeader eyebrow={route.eyebrow} title={route.title} description={route.description} path={route.path} image={route.image} />

      <PageSection
        eyebrow="Arrange your support"
        title="Talk to us first."
        intro="To make sure every contribution goes where it is most needed, we agree support arrangements directly with individuals and institutions. Reach out and we’ll share current needs."
        tone="warm"
      >
        <ContactCards subject="Supporting Attayseer Development Foundation" />
      </PageSection>

      <PageSection eyebrow="How your support works" tone="light">
        <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-5">
          {donationProcess.map((s, i) => (
            <li key={s.id} data-reveal data-reveal-delay={i * 80} className="border-t border-ink-950/15 py-7">
              <span className="eyebrow text-red-600 tabular-nums">{pad2(i + 1)}</span>
              <h3 className="mt-3 font-display text-3xl">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-700">{s.description}</p>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection eyebrow="Where support goes" title="Our five priorities." tone="sand">
        <ul className="flex flex-wrap gap-3">
          {causes.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/causes/${c.slug}`}
                className="inline-flex rounded-pill border border-ink-950/20 px-5 py-2.5 text-ink-950 transition-colors hover:border-green-700 hover:bg-green-700 hover:text-ivory-50"
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection eyebrow="Upcoming initiatives" tone="dark">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <CampaignCard key={c.slug} campaign={c} className="h-full" />
          ))}
        </div>
      </PageSection>

      <PageCta />
    </>
  );
}
