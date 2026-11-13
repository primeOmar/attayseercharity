import Image from "next/image";
import { routes } from "@/content/routes";
import { site } from "@/content/site";
import { about } from "@/content/pages";
import { causes } from "@/content/home";
import { PageCta, PageHeader, PageSection, routeMetadata } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/primitives";
import { pad2 } from "@/lib/utils";

const route = routes.about;
export const metadata = routeMetadata(route);

export default function AboutPage() {
  const legal = [
    { label: "Registered name", value: site.name },
    { label: "Legal structure", value: site.legal.structure },
    { label: "Registration no.", value: site.registration },
    { label: "Incorporated", value: site.legal.incorporated },
    { label: "Nonprofit purpose", value: "Charity" },
    { label: "Registered office", value: site.contact.address },
  ];

  return (
    <>
      <PageHeader eyebrow={route.eyebrow} title={route.title} description={route.description} path={route.path} image={route.image} />

      {/* Who we are */}
      <PageSection eyebrow="Who we are" tone="light">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 text-xl leading-relaxed text-ink-800 lg:col-span-7">
            {about.intro.map((p) => (
              <p key={p} data-reveal>
                {p}
              </p>
            ))}
            <p data-reveal lang="ar" dir="rtl" className="pt-2 font-display text-3xl text-green-700">
              {site.nameArabic}
            </p>
          </div>
          <div data-reveal="image" className="relative isolate aspect-[4/5] overflow-hidden rounded-photo lg:col-span-5">
            <Image src={about.image.src} alt={about.image.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
      </PageSection>

      {/* Vision & mission */}
      <PageSection tone="dark">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {[
            { label: "Our vision", text: about.vision },
            { label: "Our mission", text: about.mission },
          ].map((b, i) => (
            <div key={b.label} data-reveal data-reveal-delay={i * 120}>
              <Eyebrow>{b.label}</Eyebrow>
              <p className="mt-6 font-display text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] leading-[1.12] text-ivory-50">{b.text}</p>
            </div>
          ))}
        </div>
      </PageSection>

      {/* Values */}
      <PageSection eyebrow="Core values" title="What guides us." tone="warm">
        <ul className="grid grid-cols-2 gap-x-8 sm:grid-cols-3">
          {about.values.map((v, i) => (
            <li key={v} data-reveal data-reveal-delay={i * 70} className="border-t border-ink-950/15 py-7">
              <span className="eyebrow text-red-600 tabular-nums">{pad2(i + 1)}</span>
              <p className="mt-3 font-display text-[clamp(1.6rem,1.2rem+1.2vw,2.4rem)] leading-tight">{v}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      {/* Priorities */}
      <PageSection
        eyebrow="What we do"
        title="Five development priorities."
        intro="Our programmes address educational, social and economic challenges facing vulnerable people in our communities."
        tone="light"
      >
        <ol className="divide-y divide-ink-950/10 border-y border-ink-950/10">
          {causes.map((c, i) => (
            <li key={c.slug} data-reveal className="grid gap-3 py-6 sm:grid-cols-[4rem_1fr_2fr] sm:items-baseline sm:gap-8">
              <span className="eyebrow text-ink-500 tabular-nums">{pad2(i + 1)}</span>
              <h3 className="font-display text-2xl sm:text-3xl">{c.title}</h3>
              <p className="leading-relaxed text-ink-700">{c.summary}</p>
            </li>
          ))}
        </ol>
        <ButtonLink href="/causes" variant="ghost-dark" size="sm" className="mt-10">
          Explore our programmes
        </ButtonLink>
      </PageSection>

      {/* Governance */}
      <PageSection
        id="governance"
        eyebrow="Governance & management"
        title="Board of Directors."
        intro="No benefits, shares or profits are distributed to members. The foundation’s resources are used only for activities that serve its objectives."
        tone="sand"
      >
        <ul className="grid gap-6 sm:grid-cols-3">
          {site.leadership.map((p, i) => (
            <li key={p.name} data-reveal data-reveal-delay={i * 90} className="rounded-photo bg-ivory-50 p-7 shadow-[0_24px_50px_-30px_rgb(11_10_8/0.3)]">
              <span
                aria-hidden="true"
                className="grid size-14 place-items-center rounded-full bg-green-metal font-display text-xl text-ivory-50"
              >
                {initials(p.name)}
              </span>
              <p className="mt-6 font-display text-2xl leading-tight">{p.name}</p>
              <p className="mt-1 text-sm font-medium tracking-wide text-green-700 uppercase">{p.role}</p>
            </li>
          ))}
        </ul>
      </PageSection>

      {/* Legal identity */}
      <PageSection eyebrow="Legal identity" title="Registered in Kenya." tone="light">
        <div className="grid gap-12 lg:grid-cols-12">
          <dl className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
            {legal.map((row) => (
              <div key={row.label} data-reveal className="border-t border-ink-950/15 py-5">
                <dt className="text-sm font-medium tracking-wide text-ink-500 uppercase">{row.label}</dt>
                <dd className="mt-2 text-lg">{row.value}</dd>
              </div>
            ))}
          </dl>
          <div data-reveal className="lg:col-span-4">
            <p className="text-lg leading-relaxed text-ink-700">{about.commitment}</p>
            <ButtonLink href="/transparency" variant="solid-dark" size="sm" className="mt-8">
              Transparency
            </ButtonLink>
          </div>
        </div>
      </PageSection>

      <PageCta />
    </>
  );
}

function initials(name: string) {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .replace(/,.*$/, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}
