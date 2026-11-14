import { Photo } from "@/components/ui/photo";
import { HandHeart, Handshake, Users } from "lucide-react";
import { routes } from "@/content/routes";
import { getInvolved } from "@/content/pages";
import { volunteer } from "@/content/home";
import { PageCta, PageHeader, PageSection, routeMetadata } from "@/components/layout/page-shell";
import { ContactCards } from "@/components/contact/contact-cards";
import { pad2 } from "@/lib/utils";

const route = routes.volunteer;
export const metadata = routeMetadata(route);

const icons = [Users, Handshake, HandHeart];

export default function GetInvolvedPage() {
  return (
    <>
      <PageHeader eyebrow={route.eyebrow} title={route.title} description={route.description} path={route.path} image={route.image} />

      <PageSection eyebrow="Ways to get involved" title="There’s a place for you." tone="light">
        <ul className="grid gap-6 md:grid-cols-3">
          {getInvolved.ways.map((w, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={w.title} data-reveal data-reveal-delay={i * 90} className="rounded-photo bg-ivory-200 p-8">
                <span className="grid size-12 place-items-center rounded-full bg-gold-metal text-ink-950">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-6 font-display text-3xl">{w.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-700">{w.body}</p>
              </li>
            );
          })}
        </ul>
      </PageSection>

      <PageSection tone="dark">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div data-reveal="image" className="relative isolate aspect-[4/3] overflow-hidden rounded-photo lg:col-span-5">
            <Photo image={volunteer.image} alt={volunteer.image.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow text-gold-400">Partnership areas</p>
            <h2 data-reveal className="mt-6 font-display text-display-sm text-ivory-50">
              Where institutions and organisations can collaborate with us.
            </h2>
            <ol className="mt-10 divide-y divide-ivory-100/10 border-y border-ivory-100/10">
              {getInvolved.partnershipAreas.map((a, i) => (
                <li key={a} data-reveal data-reveal-delay={i * 70} className="flex items-baseline gap-6 py-4">
                  <span className="eyebrow text-gold-400 tabular-nums">{pad2(i + 1)}</span>
                  <span className="text-lg text-ivory-100">{a}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </PageSection>

      <PageSection
        id="contact"
        eyebrow="Contact the team"
        title="Let’s talk."
        intro="Tell us how you’d like to help, and we’ll get back to you."
        tone="warm"
      >
        <ContactCards subject="Getting involved with Attayseer" />
      </PageSection>

      <PageCta title="Every contribution counts." />
    </>
  );
}
