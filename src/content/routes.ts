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
    title: "A registered foundation for dignity and opportunity.",
    description: "Incorporated in Kenya on 30 December 2024 and based in Nakuru — our mission, vision, values and governance.",
    phase: "Live",
    ready: true,
    image: images.causeCommunity,
  },
  causes: {
    path: "/causes",
    eyebrow: "Our programmes",
    title: "Five priorities, one community.",
    description: "Education and scholarships, orphan and family support, poverty alleviation, women and youth empowerment, and community development.",
    phase: "Live",
    ready: true,
    image: images.causeEducation,
  },
  campaigns: {
    path: "/campaigns",
    eyebrow: "Initiatives",
    title: "What we’re planning next.",
    description: "Upcoming initiatives — Recognising Talents in Naivasha, our back-to-school support drive and a dry meal feeding programme.",
    phase: "Live",
    ready: true,
    image: images.storyBooks,
  },
  donate: {
    path: "/donate",
    eyebrow: "Support us",
    title: "Support our work.",
    description: "Contact the foundation to learn about current needs and approved support arrangements for individuals and institutions.",
    phase: "Live",
    ready: true,
    image: images.ctaChildren,
  },
  impact: {
    path: "/impact",
    eyebrow: "Our impact",
    title: "Turning commitment into community action.",
    description: "Sanitary towel support, youth sports kits and educational sponsorships — what we did, where, and who it reached.",
    phase: "Live",
    ready: true,
    image: images.heroSmile,
  },
  volunteer: {
    path: "/volunteer",
    eyebrow: "Get involved",
    title: "Give your time. Share your skills.",
    description: "Volunteer your time, knowledge or skills, or partner with us as a school, community organisation or business.",
    phase: "Live",
    ready: true,
    image: images.volunteers,
  },
  news: {
    path: "/news",
    eyebrow: "News & stories",
    title: "Notes from the field.",
    description: "Updates from our recent activities in Naivasha, Nakuru County and beyond.",
    phase: "Live",
    ready: true,
    image: images.storyFarming,
  },
  transparency: {
    path: "/transparency",
    eyebrow: "Transparency",
    title: "Accountable in everything we do.",
    description: "Registration details, governance, the public audit framework and how we report on our work.",
    phase: "Live",
    ready: true,
    image: images.stepVerify,
  },
  contact: {
    path: "/contact",
    eyebrow: "Contact",
    title: "We’d love to hear from you.",
    description: "Individuals, volunteers, institutions and organisations are welcome to reach us in Nakuru by email or phone.",
    phase: "Live",
    ready: true,
    image: images.stepReport,
  },
  privacy: {
    path: "/privacy",
    eyebrow: "Privacy notice",
    title: "Privacy notice",
    description: "How we handle the information people share with us, and how we protect beneficiaries.",
    phase: "Live",
    ready: true,
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
