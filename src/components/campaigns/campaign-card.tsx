import Image from "next/image";
import Link from "next/link";
import type { Campaign } from "@/types/content";
import { causes } from "@/content/home";
import { cn, formatCurrency, percentOf } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

const toneBg = { red: "bg-red-metal", green: "bg-green-metal", gold: "bg-gold-metal" } as const;

export function FundingProgress({ campaign, tone = "dark" }: { campaign: Campaign; tone?: "dark" | "light" }) {
  const pct = percentOf(campaign.raised, campaign.goal);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <p>
          <span className={cn("font-display text-2xl", tone === "dark" ? "text-ivory-50" : "text-ink-950")}>
            {formatCurrency(campaign.raised, campaign.currency, true)}
          </span>{" "}
          <span className={tone === "dark" ? "text-ink-300" : "text-ink-500"}>
            raised of {formatCurrency(campaign.goal, campaign.currency, true)}
          </span>
        </p>
        <p className={cn("font-medium tabular-nums", tone === "dark" ? "text-gold-400" : "text-green-700")}>{pct}%</p>
      </div>
      <div
        role="progressbar"
        aria-label={`${campaign.title} funding progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className={cn("mt-3 h-1 overflow-hidden rounded-pill", tone === "dark" ? "bg-ivory-100/15" : "bg-ink-950/10")}
      >
        <div data-reveal="bar" className="h-full rounded-pill bg-gold-metal" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CampaignCard({ campaign, className }: { campaign: Campaign; className?: string }) {
  const cause = causes.find((c) => c.slug === campaign.causeSlug);
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-ink-950/8 bg-white shadow-[0_24px_50px_-30px_rgb(11_10_8/0.35)] transition-[box-shadow,translate] duration-700 ease-out-expo hover:-translate-y-1.5 hover:shadow-[0_40px_70px_-30px_rgb(11_10_8/0.4)]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={campaign.image.src}
          alt={campaign.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 60vw, 85vw"
          className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-105"
        />
        {/* Brand strip expands on hover — Panerai side-panel motif */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-0 left-0 w-1.5 transition-[width] duration-700 ease-out-expo group-hover:w-4",
            toneBg[cause?.tone ?? "gold"],
          )}
        />
        {cause && (
          <span className="eyebrow absolute top-4 left-7 rounded-pill bg-white/90 px-3 py-1.5 text-ink-950 backdrop-blur-sm">
            {cause.title}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="font-display text-3xl leading-tight text-ink-950">
          <Link href={`/campaigns/${campaign.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {campaign.title}
          </Link>
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-700">{campaign.summary}</p>
        <div className="mt-auto pt-8">
          <FundingProgress campaign={campaign} tone="light" />
          <ButtonLink
            href={`/donate?campaign=${campaign.slug}`}
            size="sm"
            className="relative z-10 mt-6 w-full"
            aria-label={`Donate to ${campaign.title}`}
          >
            Donate
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
