/**
 * Content models.
 *
 * Every piece of copy, imagery and data on the site flows through these types so
 * it can later be swapped for a CMS / donor-management API without touching UI.
 */

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Credit line for licensing records (e.g. Unsplash). */
  credit?: string;
}

export type BrandTone = "red" | "green" | "gold";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface Cause {
  slug: string;
  title: string;
  /** One-line summary used in listings. */
  summary: string;
  /** Longer description for detail pages. */
  description: string;
  image: ImageAsset;
  tone: BrandTone;
  /** Toggle off causes the foundation does not run. */
  active: boolean;
  /** Reported or upcoming work under this programme. */
  highlights?: { kind: "reported" | "upcoming"; text: string }[];
}

export interface Campaign {
  slug: string;
  title: string;
  causeSlug: string;
  summary: string;
  image: ImageAsset;
  /** Human-readable timing, e.g. "December 2026". */
  when?: string;
  /**
   * Funding target and amount raised. Omit both for initiatives without a
   * published target — cards then show timing and an enquiry CTA instead.
   */
  goal?: number;
  raised?: number;
  currency?: CurrencyCode;
  /** ISO date. Optional so open-ended appeals are possible. */
  endsOn?: string;
  featured: boolean;
  /** False until figures are confirmed by finance. */
  verified: boolean;
}

export interface ImpactStat {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  /** False = sample data; UI shows a disclosure badge. */
  verified: boolean;
}

export interface Story {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: ImageAsset;
  /** Human-readable date of the activity, e.g. "9 March 2026". */
  date?: string;
  readingMinutes: number;
  /** False = illustrative placeholder editorial. */
  verified: boolean;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  image: ImageAsset;
}

export interface AllocationItem {
  label: string;
  percent: number;
  tone: BrandTone | "neutral";
}

export interface ReportItem {
  title: string;
  period: string;
  status: "available" | "coming-soon";
  href?: string;
}

export type CurrencyCode = "KES" | "USD" | "EUR" | "GBP";

export type DonationFrequency = "one-time" | "monthly";
