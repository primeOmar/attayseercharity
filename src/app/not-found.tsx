import type { Metadata } from "next";
import Link from "next/link";
import { mainNav } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[85svh] items-center bg-ink-950 pt-32 pb-20">
      <div className="container-site">
        <p className="eyebrow text-gold-400">Error 404</p>
        <h1 className="mt-6 font-display text-display-lg text-ivory-50">
          This path doesn’t lead <span className="text-gold-400 italic">anywhere — yet.</span>
        </h1>
        <p className="mt-6 max-w-lg text-lg text-ivory-100/80">
          The page may have moved or never existed. Here are some places to continue:
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="border-b border-ivory-100/30 pb-1 text-ivory-50 hover:border-gold-400 hover:text-gold-400">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/">Go to homepage</ButtonLink>
          <ButtonLink href="/donate" variant="outline" arrow={false}>
            Donate
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
