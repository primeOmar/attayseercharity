import type {
  AllocationItem,
  Campaign,
  Cause,
  ImpactStat,
  ProcessStep,
  ReportItem,
  Story,
} from "@/types/content";
import { images } from "./images";

/**
 * Homepage & shared programme content.
 *
 * Source: the foundation's existing site, www.attayseer.org (Nov 2026) —
 * Home, About Us, Our Programs, Activities & Impact, Get Involved and
 * Contact & Transparency pages. Figures are as reported by the foundation.
 *
 * Photography is still interim stock (see images.ts) until the foundation's
 * own activity photos are added.
 */

export const hero = {
  eyebrow: "Nakuru · Kenya",
  title: ["Creating opportunities,", "transforming communities."],
  lede: "A registered nonprofit supporting education, vulnerable families, livelihoods, women, youth and community development — with dignity, inclusion and accountability.",
  slides: [
    { id: "education", label: "Education", caption: "Reducing the barriers that keep learners out of school.", image: images.heroSchoolWalk, tone: "gold" },
    { id: "families", label: "Families", caption: "Standing with orphans and vulnerable families.", image: images.heroWaterWalk, tone: "green" },
    { id: "empowerment", label: "Women & youth", caption: "Opportunities for women and young people to thrive.", image: images.heroSmile, tone: "red" },
  ],
} as const;

export const mission = {
  eyebrow: "Our mission",
  headline: ["Dignity, opportunity", "and lasting change."],
  statement:
    "We advance human dignity and sustainable community development through education, social support, empowerment and responsive initiatives — working toward a society where everyone can access education, live with dignity, develop their potential and contribute to their community.",
};

/** As reported on the foundation's Activities & Impact page (2026). */
export const impactStats: ImpactStat[] = [
  { id: "girls", label: "Girls supported with menstrual dignity kits", value: 300, verified: true },
  { id: "towels", label: "Sanitary towels distributed", value: 500, verified: true },
  { id: "students", label: "Students sponsored", value: 10, verified: true },
  { id: "teams", label: "Youth sports teams kitted out", value: 7, verified: true },
];

/** The foundation's five development priorities. */
export const causes: Cause[] = [
  {
    slug: "education-and-scholarships",
    title: "Education & scholarships",
    summary: "Sponsorships that reduce the barriers keeping learners from continuing their education.",
    description:
      "Education creates opportunities for individuals and communities. Our sponsorship initiatives support access to learning — covering tuition, school supplies, uniforms and examination fees — so that learners can stay in school.",
    image: images.causeEducation,
    tone: "gold",
    active: true,
    highlights: [
      { kind: "reported", text: "Sponsored 10 students in January 2026, through individual donations from Suleiman Muhammed." },
    ],
  },
  {
    slug: "orphan-and-family-support",
    title: "Orphan & family support",
    summary: "Protecting the welfare, dignity and resilience of orphans and vulnerable families.",
    description:
      "Vulnerable children and families can face barriers to education, essential resources and social opportunities. We focus on their welfare, dignity and resilience — including helping orphans and vulnerable learners return to school smoothly.",
    image: images.causeFamily,
    tone: "red",
    active: true,
    highlights: [
      { kind: "upcoming", text: "A support drive in January 2027 to help orphans and other vulnerable learners return to school smoothly." },
    ],
  },
  {
    slug: "poverty-alleviation",
    title: "Poverty alleviation",
    summary: "Strengthening livelihoods, self-reliance and economic resilience.",
    description:
      "Economic vulnerability can limit access to education, healthcare and essential household needs. We work to strengthen livelihoods, self-reliance and economic resilience for vulnerable households.",
    image: images.causeFood,
    tone: "green",
    active: true,
    highlights: [
      { kind: "upcoming", text: "A dry meal feeding programme planned for February 2027, subject to the availability of funds." },
    ],
  },
  {
    slug: "women-and-youth-empowerment",
    title: "Women & youth empowerment",
    summary: "Menstrual dignity, sport and skills that let women and young people take part fully.",
    description:
      "We create opportunities for women and young people to develop their capabilities and participate fully in community life — from sanitary towel support that reduces practical barriers for girls and young women, to sports kits for youth teams, mentorship and skills development.",
    image: images.heroSmile,
    tone: "gold",
    active: true,
    highlights: [
      { kind: "reported", text: "500 sanitary towels and 800 inner garments for vulnerable students in Maiella Ward (March 2026)." },
      { kind: "reported", text: "Full jerseys for six football teams and one basketball team." },
      { kind: "upcoming", text: "Skills development, mentorship and livelihood support, subject to programme planning and resources." },
    ],
  },
  {
    slug: "community-development",
    title: "Community development",
    summary: "Locally relevant initiatives and partnerships that respond to identified needs.",
    description:
      "We encourage locally relevant initiatives and partnerships that respond to needs identified by communities themselves, prioritising inclusive participation and sustainable outcomes.",
    image: images.causeCommunity,
    tone: "green",
    active: true,
    highlights: [
      { kind: "upcoming", text: "Recognising Talents — a community event in Naivasha, December 2026." },
    ],
  },
];

/** Upcoming initiatives, as announced on the Our Programs page. */
export const campaigns: Campaign[] = [
  {
    slug: "recognising-talents",
    title: "Recognising Talents",
    causeSlug: "community-development",
    summary: "A community event in Naivasha celebrating and encouraging local talent.",
    image: images.ctaChildren,
    when: "December 2026",
    featured: true,
    verified: true,
  },
  {
    slug: "back-to-school-support-drive",
    title: "Back-to-school support drive",
    causeSlug: "orphan-and-family-support",
    summary: "Helping orphans and other vulnerable learners return to school smoothly in the new year.",
    image: images.storyDoorway,
    when: "January 2027",
    featured: true,
    verified: true,
  },
  {
    slug: "dry-meal-feeding-programme",
    title: "Dry meal feeding programme",
    causeSlug: "poverty-alleviation",
    summary: "Dry food support for vulnerable households, subject to the availability of funds.",
    image: images.storyFarming,
    when: "February 2027",
    featured: true,
    verified: true,
  },
];

/** Reported activities, from the Activities & Impact page. */
export const stories: Story[] = [
  {
    slug: "sanitary-towel-support-initiative",
    title: "500 sanitary towels for 300 girls in Ndabibi",
    excerpt:
      "At Ndabibi Central Primary School in Maiella Ward, Naivasha, we distributed 500 sanitary towels and 800 inner garments with the Sule Initiative — helping girls manage menstruation with dignity and stay in class.",
    category: "Menstrual dignity",
    image: images.storyBooks,
    date: "9 March 2026",
    readingMinutes: 2,
    verified: true,
  },
  {
    slug: "youth-sports-empowerment",
    title: "120 jerseys for seven youth teams",
    excerpt:
      "Six football teams and one basketball team received full kits — tops, shorts and socks — opening the door to talent pathways such as those run by the Football Kenya Federation.",
    category: "Youth empowerment",
    image: images.storyBoy,
    readingMinutes: 2,
    verified: true,
  },
  {
    slug: "educational-sponsorship-initiative",
    title: "Ten learners sponsored back to school",
    excerpt:
      "Tuition, supplies, uniforms and exam fees for learners at Milimani High School, Lakeview Primary, Naivasha Day High School and others.",
    category: "Education",
    image: images.stepVerify,
    date: "15 January 2026",
    readingMinutes: 2,
    verified: true,
  },
];

export const donationProcess: ProcessStep[] = [
  {
    id: "donate",
    title: "Reach out",
    description:
      "Contact the foundation to learn about current needs and approved support arrangements — as an individual, institution or organisation.",
    image: images.stepDonate,
  },
  {
    id: "allocate",
    title: "Agree",
    description:
      "Together we agree where your support goes: a learner’s sponsorship, a family support drive, or a community initiative.",
    image: images.stepAllocate,
  },
  {
    id: "implement",
    title: "Deliver",
    description:
      "We deliver alongside schools, community partners and local leaders, prioritising real community needs and responsible use of resources.",
    image: images.stepImplement,
  },
  {
    id: "verify",
    title: "Document",
    description:
      "Every activity is documented responsibly — where, when, what was provided and how many people were supported — while protecting beneficiaries’ privacy.",
    image: images.stepVerify,
  },
  {
    id: "report",
    title: "Report",
    description:
      "We publish verifiable updates on our programmes, the resources used and the outcomes achieved.",
    image: images.stepReport,
  },
];

export const volunteer = {
  eyebrow: "Get involved",
  title: ["Give your time.", "Share your skills."],
  body: "We welcome individuals who want to contribute their time, knowledge or skills — and educational institutions, community organisations and businesses interested in partnering with us.",
  /** Partnership areas listed on the Get Involved page. */
  roles: [
    "Educational sponsorships",
    "Menstrual hygiene & dignity",
    "Women & youth development",
    "Vulnerable family support",
    "Community-based projects",
  ],
  image: images.volunteers,
};

export const transparency = {
  eyebrow: "Transparency",
  title: "Accountable in everything we do.",
  body: "We recognise the importance of transparency, ethical conduct and responsible stewardship of resources, and we are open to enquiry and supervision by the public as allowed by Kenyan law.",
  /** No published split yet — the allocation chart is hidden while empty. */
  allocation: [] as AllocationItem[],
  allocationVerified: false,
  commitments: [
    {
      title: "Registered in Kenya",
      body: "A Company Limited by Guarantee, registration no. CLG-ABF93X, incorporated 30 December 2024.",
    },
    {
      title: "No private benefit",
      body: "No benefits, shares or profits go to members. Resources serve the foundation’s objectives.",
    },
    {
      title: "Public audit framework",
      body: "We operate within the public audit framework required of charity organisations in Kenya.",
    },
    {
      title: "Respect for beneficiaries",
      body: "We do not publish personal beneficiary information without a lawful basis and the necessary permissions.",
    },
  ],
  reports: [
    { title: "Activity reports", period: "2026", status: "coming-soon" },
    { title: "Financial statements", period: "Latest year", status: "coming-soon" },
  ] as ReportItem[],
};

export const finalCta = {
  eyebrow: "Are you ready to",
  title: ["Be someone’s", "turning point."],
  body: "Choose an amount. You’ll confirm the details and payment method on the next step.",
  image: images.ctaChildren,
};
