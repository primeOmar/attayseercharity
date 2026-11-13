import type { CurrencyCode, NavItem } from "@/types/content";

/**
 * Global site configuration.
 *
 * ⚠️ PLACEHOLDERS — replace every value marked TODO with the foundation's
 * verified details before launch. Nothing here should be invented.
 */
export const site = {
  /** Official name, as shown on the approved logo. */
  name: "Attayseer Development Foundation",
  shortName: "Attayseer",
  nameArabic: "مؤسسة التيسير للتنمية",
  logo: {
    emblem: { src: "/brand/emblem.png", width: 480, height: 456 },
    /** Full lockup on white — use only on light surfaces. */
    full: { src: "/brand/logo-full.png", width: 1254, height: 1254 },
  },
  tagline: "Hope, built together.",
  description:
    "A charity foundation working alongside communities in Kenya and East Africa on education, healthcare, food security, clean water and emergency relief.",
  /** TODO: production domain. Used for canonical URLs, sitemap and OG. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_KE",
  region: "Kenya & East Africa",
  contact: {
    /** TODO: verified contact details. example.org is a reserved placeholder domain. */
    email: "hello@example.org",
    phone: "+254 700 000 000",
    address: "Nairobi, Kenya",
  },
  /** TODO: real profile URLs. Empty strings are hidden. */
  social: {
    facebook: "",
    instagram: "",
    x: "",
    linkedin: "",
    youtube: "",
  },
  /** TODO: NGO registration number once confirmed — rendered only when set. */
  registration: "",
  isPlaceholder: true,
} as const;

export const donation = {
  defaultCurrency: "KES" as CurrencyCode,
  currencies: ["KES", "USD", "EUR", "GBP"] as CurrencyCode[],
  /** Preset amounts per currency for the quick selector. */
  presets: {
    KES: [1000, 2500, 5000, 10000],
    USD: [10, 25, 50, 100],
    EUR: [10, 25, 50, 100],
    GBP: [10, 25, 50, 100],
  } satisfies Record<CurrencyCode, number[]>,
};

export const mainNav: NavItem[] = [
  { label: "About", href: "/about", description: "Our story, mission and people" },
  { label: "Causes", href: "/causes", description: "Where we focus" },
  { label: "Campaigns", href: "/campaigns", description: "Active appeals" },
  { label: "Impact", href: "/impact", description: "Outcomes and evidence" },
  { label: "Stories", href: "/news", description: "News from the field" },
  { label: "Transparency", href: "/transparency", description: "Reports and governance" },
];

export const secondaryNav: NavItem[] = [
  { label: "Volunteer", href: "/volunteer" },
  { label: "Contact", href: "/contact" },
  { label: "Donor sign in", href: "/login" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Explore",
    items: [
      { label: "About us", href: "/about" },
      { label: "Our causes", href: "/causes" },
      { label: "Campaigns", href: "/campaigns" },
      { label: "Our impact", href: "/impact" },
    ],
  },
  {
    title: "Get involved",
    items: [
      { label: "Donate", href: "/donate" },
      { label: "Volunteer", href: "/volunteer" },
      { label: "News & stories", href: "/news" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Accountability",
    items: [
      { label: "Transparency", href: "/transparency" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of use", href: "/terms" },
    ],
  },
];
