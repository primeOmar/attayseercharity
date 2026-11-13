import type { ImageAsset } from "@/types/content";
import { images } from "./images";

/**
 * Registry of public routes. `ready: false` pages render a placeholder, are
 * noindex, and are excluded from the sitemap until their phase ships.
 */
export interface RouteEntry {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  phase: string;
  ready: boolean;
  image?: ImageAsset;
}

export const routes = {
  about: {
    path: "/about",
    eyebrow: "About us",
    title: "Our story, mission and the people behind it.",
    description: "Who we are, why we exist, how we are governed, and the milestones that brought us here.",
    phase: "Phase 3",
    ready: false,
    image: images.causeCommunity,
  },
  causes: {
    path: "/causes",
    eyebrow: "Our causes",
    title: "Where your support goes to work.",
    description: "Explore every area we focus on, filter by need, and see the campaigns running in each.",
    phase: "Phase 3",
    ready: false,
    image: images.causeEducation,
  },
  campaigns: {
    path: "/campaigns",
    eyebrow: "Campaigns",
    title: "Appeals that need you right now.",
    description: "Search active campaigns, follow their funding progress and read project updates.",
    phase: "Phase 3",
    ready: false,
    image: images.storyBooks,
  },
  donate: {
    path: "/donate",
    eyebrow: "Donate",
    title: "Give once, or give every month.",
    description: "A secure, multi-step donation flow supporting M-PESA, card and international payments.",
    phase: "Phase 4",
    ready: false,
    image: images.ctaChildren,
  },
  impact: {
    path: "/impact",
    eyebrow: "Our impact",
    title: "Outcomes, evidence and honest reporting.",
    description: "An impact dashboard with programme outcomes, charts, stories and reports.",
    phase: "Phase 3",
    ready: false,
    image: images.heroSmile,
  },
  volunteer: {
    path: "/volunteer",
    eyebrow: "Volunteer",
    title: "Give your time. Share your skills.",
    description: "Volunteer opportunities in the field and remotely, with an accessible application form.",
    phase: "Phase 3",
    ready: false,
    image: images.volunteers,
  },
  news: {
    path: "/news",
    eyebrow: "News & stories",
    title: "Notes from the field.",
    description: "Stories, project updates and reflections from the communities we work alongside.",
    phase: "Phase 3",
    ready: false,
    image: images.storyFarming,
  },
  transparency: {
    path: "/transparency",
    eyebrow: "Transparency",
    title: "Accountable for every gift.",
    description: "Financial reports, donation allocation, governance and project accountability.",
    phase: "Phase 3",
    ready: false,
    image: images.stepVerify,
  },
  contact: {
    path: "/contact",
    eyebrow: "Contact",
    title: "We’d love to hear from you.",
    description: "Questions about giving, partnerships, volunteering or our work — get in touch.",
    phase: "Phase 3",
    ready: false,
  },
  privacy: {
    path: "/privacy",
    eyebrow: "Privacy policy",
    title: "Privacy policy",
    description: "How we collect, use and protect your personal data.",
    phase: "Phase 3 (legal copy required)",
    ready: false,
  },
  terms: {
    path: "/terms",
    eyebrow: "Terms of use",
    title: "Terms of use",
    description: "The terms that govern use of this website.",
    phase: "Phase 3 (legal copy required)",
    ready: false,
  },
  login: {
    path: "/login",
    eyebrow: "Donor sign in",
    title: "Your giving, in one place.",
    description: "Sign in to see your donation history, receipts, recurring gifts and personal impact.",
    phase: "Phase 5",
    ready: false,
  },
} satisfies Record<string, RouteEntry>;
