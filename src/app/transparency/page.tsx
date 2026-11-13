import Link from "next/link";
import { FileText } from "lucide-react";
import { routes } from "@/content/routes";
import { site } from "@/content/site";
import { transparency } from "@/content/home";
import { PageCta, PageHeader, PageSection, routeMetadata } from "@/components/layout/page-shell";
import { pad2 } from "@/lib/utils";

const route = routes.transparency;
export const metadata = routeMetadata(route);

export default function TransparencyPage() {
  const registration = [
    { label: "Registered name", value: site.name },
    { label: "Legal structure", value: site.legal.structure },
    { label: "Country of registration", value: "Kenya" },
    { label: "Company registration no.", value: site.registration },
    { label: "Registration authority", value: site.legal.authority },
    { label: "Incorporation date", value: site.legal.incorporated },
  ];

  return (
    <>
      <PageHeader eyebrow={route.eyebrow} title={route.title} description={route.description} path={route.path} image={route.image} />

      <PageSection eyebrow="Our commitment" intro={transparency.body} tone="light">
        <ol className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {transparency.commitments.map((c, i) => (
            <li key={c.title} data-reveal data-reveal-delay={i * 80} className="border-t border-ink-950/15 py-7">
              <span className="eyebrow text-red-600 tabular-nums">{pad2(i + 1)}</span>
              <h2 className="mt-3 font-display text-[1.9rem] leading-tight">{c.title}</h2>
              <p className="mt-2 leading-relaxed text-ink-700">{c.body}</p>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection id="registration" eyebrow="Registration information" title="Who we are, on record." tone="sand">
        <dl className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {registration.map((r) => (
            <div key={r.label} data-reveal className="border-t border-ink-950/15 py-5">
              <dt className="text-sm font-medium tracking-wide text-ink-500 uppercase">{r.label}</dt>
              <dd className="mt-2 text-lg">{r.value}</dd>
            </div>
          ))}
        </dl>
      </PageSection>

      <PageSection
        id="governance"
        eyebrow="Governance"
        title="Board of Directors."
        intro="The foundation is open to enquiry and supervision by the public as allowed by Kenyan law. No benefits, shares or profits are distributed to members."
        tone="light"
      >
        <ul className="divide-y divide-ink-950/10 border-y border-ink-950/10">
          {site.leadership.map((p) => (
            <li key={p.name} data-reveal className="flex flex-wrap items-baseline justify-between gap-2 py-5">
              <span className="font-display text-2xl">{p.name}</span>
              <span className="text-sm font-medium tracking-wide text-green-700 uppercase">{p.role}</span>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection
        id="reports"
        eyebrow="Financial information & reports"
        intro="The foundation operates within the public audit framework required of charity organisations in Kenya. Reports will be published here as they become available."
        tone="warm"
      >
        <ul className="divide-y divide-ink-950/10 rounded-photo bg-ivory-50 px-6 sm:px-8">
          {transparency.reports.map((r) => (
            <li key={r.title} className="flex items-center gap-4 py-5">
              <FileText aria-hidden="true" className="size-5 shrink-0 text-ink-500" />
              <span className="flex-1">
                <span className="block font-medium">{r.title}</span>
                <span className="text-sm text-ink-500">{r.period}</span>
              </span>
              {r.status === "available" && r.href ? (
                <a href={r.href} className="text-sm font-medium underline underline-offset-4">
                  Download
                </a>
              ) : (
                <span className="rounded-pill bg-ink-950/5 px-3 py-1 text-xs font-medium text-ink-700">Coming soon</span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-8 leading-relaxed text-ink-700">
          See what we have delivered so far in our{" "}
          <Link href="/impact#activities" className="font-medium underline underline-offset-4 hover:text-green-700">
            activity reports
          </Link>
          , and read our{" "}
          <Link href="/privacy" className="font-medium underline underline-offset-4 hover:text-green-700">
            privacy notice
          </Link>
          .
        </p>
      </PageSection>

      <PageCta title="Questions about our work?" body={`Write to ${site.contact.email} — we’re happy to answer.`} />
    </>
  );
}
