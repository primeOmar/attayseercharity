import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { footerNav, site } from "@/content/site";
import { Logo } from "@/components/ui/logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";

/** Cached so the year doesn't break static prerendering under Cache Components. */
async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

const socialLabels: Record<keyof typeof site.social, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  x: "X (Twitter)",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export function SiteFooter() {
  const socials = (Object.keys(site.social) as (keyof typeof site.social)[]).filter((k) => site.social[k]);

  return (
    <footer data-snap-end data-surface="dark" className="relative bg-green-950 bg-green-deep pt-20 pb-10 text-ivory-100 sm:pt-28">
      {/* Red · gold · green band — the open book's page edges from the logo */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-brand-stripe" />
      <div className="container-site">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-display-md text-ivory-50">
              {site.tagline.split(",")[0]},<br />
              <span className="pr-[0.08em] italic text-gold-metal">{site.tagline.split(",")[1]?.trim()}</span>
            </p>
            <div className="mt-10 max-w-md">
              <p className="mb-2 text-sm text-ivory-200/90">Field updates and impact reports — a few times a year, never spam.</p>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-10 lg:col-span-7 lg:gap-6 lg:pl-10 xl:gap-10">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="eyebrow mb-5 tracking-[0.16em] text-ivory-200/75 xl:tracking-[0.22em]">{group.title}</h2>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-[0.95rem] text-ivory-100/85 transition-colors hover:text-gold-400">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="col-span-2 sm:col-span-3">
              <h2 className="eyebrow mb-5 text-ivory-200/75">Contact</h2>
              <address className="grid gap-2 text-[0.95rem] text-ivory-100/85 not-italic sm:grid-cols-3">
                <a href={`mailto:${site.contact.email}`} className="hover:text-gold-400">
                  {site.contact.email}
                </a>
                <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="hover:text-gold-400">
                  {site.contact.phone}
                </a>
                <span>{site.contact.address}</span>
              </address>
              {site.isPlaceholder && (
                <p className="mt-3 text-xs text-ivory-200/75">Contact details are placeholders pending confirmation.</p>
              )}
              {socials.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                  {socials.map((k) => (
                    <li key={k}>
                      <a href={site.social[k]} rel="me noopener" target="_blank" className="text-sm hover:text-gold-400">
                        {socialLabels[k]}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-ivory-100/10 pt-8 text-sm text-ivory-200/75 sm:mt-20 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Logo />
            <span lang="ar" dir="rtl" className="text-base whitespace-nowrap text-ivory-200/90">
              {site.nameArabic}
            </span>
          </div>
          <p className="lg:text-center">
            © <CopyrightYear /> {site.name}. All rights reserved.
            {site.registration && <> Registered NGO {site.registration}.</>}
          </p>
          <a href="#top" className="eyebrow inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-ivory-100 hover:text-gold-400">
            Back to top <ArrowUp aria-hidden="true" className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
