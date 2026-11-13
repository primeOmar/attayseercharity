import { routes } from "@/content/routes";
import { site } from "@/content/site";
import { PageCta, PageHeader, PageSection, routeMetadata } from "@/components/layout/page-shell";
import { ContactCards } from "@/components/contact/contact-cards";

const route = routes.contact;
export const metadata = routeMetadata(route);

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow={route.eyebrow} title={route.title} description={route.description} path={route.path} image={route.image} />

      <PageSection
        eyebrow="Get in touch"
        intro="Whether you’d like to volunteer, partner with us, support an initiative or simply learn more about our work, we welcome your enquiry."
        tone="warm"
      >
        <ContactCards subject="Enquiry via website" />
      </PageSection>

      <PageSection eyebrow="Registration" tone="light">
        <dl className="grid gap-x-10 sm:grid-cols-3">
          {[
            { label: "Registered name", value: site.name },
            { label: "Foundation Registration No.", value: site.registration },
            { label: "Website", value: "www.attayseer.org" },
          ].map((r) => (
            <div key={r.label} data-reveal className="border-t border-ink-950/15 py-5">
              <dt className="text-sm font-medium tracking-wide text-ink-500 uppercase">{r.label}</dt>
              <dd className="mt-2 text-lg">{r.value}</dd>
            </div>
          ))}
        </dl>
      </PageSection>

      <PageCta />
    </>
  );
}
