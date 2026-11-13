/**
 * Inner-page content.
 *
 * Source: www.attayseer.org (Nov 2026) — About Us, Our Programs, Activities &
 * Impact, Get Involved and Contact & Transparency. Board names use the
 * spellings confirmed by the foundation (see site.leadership).
 */
import type { ImageAsset } from "@/types/content";
import { images } from "./images";

export const about = {
  intro: [
    "Attayseer Development Foundation is a registered and active organisation incorporated in Kenya as a Company Limited by Guarantee, based in Nakuru.",
    "We work to improve opportunities for vulnerable individuals, families and communities through education, social support, empowerment and sustainable development — guided by the belief that development should promote dignity, inclusion, accountability and long-term positive change.",
  ],
  vision:
    "A society where education, dignity, empowerment and development opportunities are accessible to all — where everyone can develop their potential and contribute to their community.",
  mission:
    "To advance human dignity and sustainable community development through education, support for vulnerable families, women and youth empowerment, and practical, responsive initiatives.",
  values: ["Integrity", "Compassion", "Inclusivity", "Accountability", "Partnership", "Sustainability"],
  approach: [
    { title: "Community needs first", body: "Our work responds to needs identified by the communities we serve." },
    { title: "Responsible resources", body: "Resources are managed carefully and used only for our objectives." },
    { title: "Inclusive participation", body: "Everyone in the community has a place in the work we do." },
    { title: "Sustainable outcomes", body: "We favour change that lasts beyond any single activity." },
  ],
  commitment:
    "We are committed to conducting our activities responsibly, respecting the dignity of beneficiaries, and strengthening partnerships that contribute to community well-being.",
  image: images.causeCommunity,
};

export interface Activity {
  slug: string;
  title: string;
  focus: string;
  date: string;
  location: string;
  provided: string;
  reached: string;
  partner?: string;
  body: string;
  image: ImageAsset;
}

/** Reported activities, from the Activities & Impact page. */
export const activities: Activity[] = [
  {
    slug: "sanitary-towel-support-initiative",
    title: "Sanitary Towel Support Initiative",
    focus: "Menstrual dignity and educational participation",
    date: "9 March 2026",
    location: "Ndabibi Central Primary School, Maiella Ward, Naivasha Sub-county, Nakuru County",
    provided: "500 sanitary towels and 800 inner garments",
    reached: "300 female students",
    partner: "Sule Initiative",
    body: "Access to menstrual hygiene products helps girls and young women manage menstruation with greater dignity and reduces a practical barrier to staying in class. The distribution formed part of a campaign to raise learners’ dignity.",
    image: images.storyBooks,
  },
  {
    slug: "youth-sports-empowerment",
    title: "Youth Empowerment Initiative — Sports",
    focus: "Youth empowerment through sports",
    date: "Various dates",
    location: "Several locations",
    provided: "120 full jerseys — top, shorts and socks",
    reached: "7 teams: 6 football, 1 basketball",
    partner: "Sule Initiative",
    body: "Proper kits give young players access to talent-development opportunities, such as those offered by the Football Kenya Federation (FKF).",
    image: images.storyBoy,
  },
  {
    slug: "educational-sponsorship-initiative",
    title: "Educational Sponsorship Initiative",
    focus: "Access to education for learners facing barriers",
    date: "15 January 2026",
    location: "Milimani High School, Lakeview Primary School, Naivasha Day High School and others",
    provided: "Tuition, school supplies, uniforms and examination fees, among others",
    reached: "10 learners",
    body: "Sponsorships keep learners in school when costs would otherwise force them out. These sponsorships were made possible through individual donations from Suleiman Muhammed.",
    image: images.stepVerify,
  },
];

export const getInvolved = {
  ways: [
    {
      title: "Volunteer",
      body: "Contribute your time, knowledge or skills to our programmes and community activities.",
    },
    {
      title: "Partner with us",
      body: "We welcome discussions with educational institutions, community organisations, businesses and other stakeholders.",
    },
    {
      title: "Support an initiative",
      body: "Individuals and institutions can contact us to learn about current needs and approved support arrangements.",
    },
  ],
  partnershipAreas: [
    "Educational sponsorships and learning support",
    "Menstrual hygiene and dignity initiatives",
    "Women and youth development",
    "Vulnerable family support",
    "Community-based development projects",
  ],
};

export const privacy = {
  updated: "November 2026",
  sections: [
    {
      title: "Who we are",
      body: "Attayseer Development Foundation (registration no. CLG-ABF93X) is a Company Limited by Guarantee registered in Kenya, with its office at Nashat Muslim Center, Oginga Odinga Street, Nakuru.",
    },
    {
      title: "Information you send us",
      body: "We respect the privacy of everyone who contacts us. When you email, call or write to us, we use the information you provide only to respond to your enquiry and to manage related communications.",
    },
    {
      title: "Beneficiaries",
      body: "We do not publish personal information about beneficiaries without an appropriate legal basis and the necessary permissions. Activity reports describe locations, items provided and numbers reached — not individuals.",
    },
    {
      title: "Your rights",
      body: "You may ask what information we hold about you, and ask us to correct or delete it, in line with Kenya’s Data Protection Act, 2019.",
    },
    {
      title: "Questions",
      body: "Send privacy questions or requests to attayserfoundation@gmail.com.",
    },
  ],
};
