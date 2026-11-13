import type { CurrencyCode, NavItem } from "@/types/content";

/**
 * Global site configuration.
 *
 * Source: the foundation's existing site, www.attayseer.org (Nov 2026).
 * Nothing here should be invented — update from verified records only.
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
  tagline: "Creating Opportunities. Transforming Communities.",
  description:
    "A registered nonprofit in Nakuru, Kenya, supporting education, vulnerable families, livelihoods, women, youth and community development.",
  /** Used for canonical URLs, sitemap and OG. Override per environment if needed. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.attayseer.org",
  locale: "en_KE",
  region: "Nakuru, Kenya",
  contact: {
    email: "attayserfoundation@gmail.com",
    phone: "+254 726 414 925",
    address: "Nashat Muslim Center, Oginga Odinga Street, Nakuru, Kenya",
  },
  /** TODO: real profile URLs. Empty strings are hidden. */
  social: {
    facebook: "",
    instagram: "",
    x: "",
    linkedin: "",
    youtube: "",
  },
  /** Registrar of Companies, Kenya — Company Limited by Guarantee. */
  registration: "CLG-ABF93X",
  legal: {
    structure: "Company Limited by Guarantee",
    authority: "Registrar of Companies, Kenya",
    incorporated: "30 December 2024",
  },
  /**
   * Board of Directors, as confirmed by the foundation (Nov 2026). The live
   * Governance page spells two names differently — these spellings are correct.
   */
  leadership: [
    { name: "Dr. Suleiman Muhammed, PhD", role: "Executive Director" },
    { name: "Mohammed Hussein Opondoh", role: "Director" },
    { name: "Seth Onditi Opondoh", role: "Member" },
  ],
  isPlaceholder: false,
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
  { label: "Programmes", href: "/causes", description: "Our five development priorities" },
  { label: "Initiatives", href: "/campaigns", description: "What’s coming up" },
  { label: "Impact", href: "/impact", description: "Activities and outcomes" },
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
      { label: "Our programmes", href: "/causes" },
      { label: "Initiatives", href: "/campaigns" },
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
