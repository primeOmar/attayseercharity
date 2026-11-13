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
 * ⚠️ SAMPLE CONTENT. Copy is draft marketing language for review. All numbers
 * carry `verified: false` and are rendered with a visible "sample data"
 * disclosure until finance confirms real figures.
 */

export const hero = {
  eyebrow: "Kenya · East Africa",
  title: ["Hope is built,", "together."],
  lede: "We work alongside communities to keep children learning, families healthy and water flowing — and we show you exactly where your gift goes.",
  slides: [
    { id: "education", label: "Education", caption: "Every child deserves a classroom to walk to.", image: images.heroSchoolWalk, tone: "gold" },
    { id: "water", label: "Clean water", caption: "Safe water closer to home changes everything.", image: images.heroWaterWalk, tone: "green" },
    { id: "community", label: "Community", caption: "Lasting change is led by communities themselves.", image: images.heroSmile, tone: "red" },
  ],
} as const;

export const mission = {
  eyebrow: "Our mission",
  headline: ["We don’t hand out hope.", "We build it, side by side."],
  statement:
    "Every programme starts by listening. We partner with local leaders, teachers, health workers and families to fund what they know will work — then we stay, measure, and report back honestly on what changed.",
};

export const impactStats: ImpactStat[] = [
  { id: "families", label: "Families supported", value: 12500, suffix: "+", verified: false },
  { id: "projects", label: "Projects completed", value: 86, verified: false },
  { id: "donations", label: "Donations received", value: 48, prefix: "KES ", suffix: "M", verified: false },
  { id: "communities", label: "Communities reached", value: 140, verified: false },
];

export const causes: Cause[] = [
  {
    slug: "education",
    title: "Education",
    summary: "Classrooms, learning materials and school fees that keep children in school.",
    description:
      "We support schools and learners with classroom improvements, books and learning materials, and bursaries that keep children — especially girls — in school through to completion.",
    image: images.causeEducation,
    tone: "gold",
    active: true,
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    summary: "Community health outreach, maternal care and access to essential medicines.",
    description:
      "We fund community health outreach, maternal and child health support, and access to essential medicines in partnership with local health workers.",
    image: images.causeHealthcare,
    tone: "red",
    active: true,
  },
  {
    slug: "food-assistance",
    title: "Food assistance",
    summary: "Emergency food support and seeds that help families feed themselves again.",
    description:
      "We provide food support when families need it most, and invest in seeds, tools and training so households can rebuild their own food security.",
    image: images.causeFood,
    tone: "green",
    active: true,
  },
  {
    slug: "clean-water",
    title: "Clean water",
    summary: "Boreholes, water points and hygiene education close to home.",
    description:
      "We help communities develop and maintain safe water points, paired with sanitation and hygiene education so the benefits last.",
    image: images.causeWater,
    tone: "green",
    active: true,
  },
  {
    slug: "emergency-relief",
    title: "Emergency relief",
    summary: "Rapid response when drought, flood or displacement strikes.",
    description:
      "When disaster strikes, we move quickly with partners on the ground to provide essentials — food, water, shelter items and medical support.",
    image: images.causeEmergency,
    tone: "red",
    active: true,
  },
  {
    slug: "family-support",
    title: "Orphan & family support",
    summary: "Keeping vulnerable children safe, cared for and within loving families.",
    description:
      "We support vulnerable children and the families and guardians caring for them, with a focus on keeping children in safe, family-based care.",
    image: images.causeFamily,
    tone: "gold",
    active: true,
  },
  {
    slug: "community-development",
    title: "Community development",
    summary: "Livelihoods, skills and local leadership that outlast any single project.",
    description:
      "We invest in livelihoods, skills training and community-led groups so that progress continues long after a project ends.",
    image: images.causeCommunity,
    tone: "gold",
    active: true,
  },
];

export const campaigns: Campaign[] = [
  {
    slug: "back-to-school",
    title: "Back to school, for every child",
    causeSlug: "education",
    summary: "Uniforms, books and fees so children can return to class this term.",
    image: images.storyBooks,
    goal: 2500000,
    raised: 1640000,
    currency: "KES",
    featured: true,
    verified: false,
  },
  {
    slug: "water-closer-to-home",
    title: "Water, closer to home",
    causeSlug: "clean-water",
    summary: "A protected water point and hygiene training for a rural community.",
    image: images.causeWater,
    goal: 4000000,
    raised: 1720000,
    currency: "KES",
    featured: true,
    verified: false,
  },
  {
    slug: "seeds-of-recovery",
    title: "Seeds of recovery",
    causeSlug: "food-assistance",
    summary: "Drought-tolerant seed and training for farming families.",
    image: images.storyFarming,
    goal: 1800000,
    raised: 1460000,
    currency: "KES",
    featured: true,
    verified: false,
  },
  {
    slug: "healthy-mothers",
    title: "Healthy mothers, healthy starts",
    causeSlug: "healthcare",
    summary: "Community health outreach for expectant mothers and newborns.",
    image: images.causeHealthcare,
    goal: 3200000,
    raised: 880000,
    currency: "KES",
    featured: true,
    verified: false,
  },
];

export const stories: Story[] = [
  {
    slug: "what-a-water-point-changes",
    title: "What a water point changes — beyond the water",
    excerpt:
      "Time saved on long walks becomes time in class, time at work, time together. A look at the ripple effects of safe water close to home.",
    category: "Clean water",
    image: images.heroWaterWalk,
    readingMinutes: 6,
    verified: false,
  },
  {
    slug: "keeping-girls-in-school",
    title: "Keeping girls in school through to the final exam",
    excerpt: "Why bursaries work best when paired with mentoring and family support.",
    category: "Education",
    image: images.storyBooks,
    readingMinutes: 5,
    verified: false,
  },
  {
    slug: "family-based-care",
    title: "Why family-based care comes first",
    excerpt: "Supporting guardians so children can grow up safe at home.",
    category: "Family support",
    image: images.storyDoorway,
    readingMinutes: 4,
    verified: false,
  },
  {
    slug: "joy-is-data-too",
    title: "Joy is data too: measuring what matters",
    excerpt: "How we combine numbers and community voices to report honestly.",
    category: "Transparency",
    image: images.storyBoy,
    readingMinutes: 4,
    verified: false,
  },
];

export const donationProcess: ProcessStep[] = [
  {
    id: "donate",
    title: "Donate",
    description:
      "Give once or monthly by M-PESA, card or international transfer. You choose a campaign, a cause, or where need is greatest.",
    image: images.stepDonate,
  },
  {
    id: "allocate",
    title: "Allocate",
    description:
      "Your gift is assigned to the programme you chose and recorded against its budget, so it can be traced from day one.",
    image: images.stepAllocate,
  },
  {
    id: "implement",
    title: "Implement",
    description:
      "Local partners and community committees deliver the work — building, teaching, treating and planting where it is needed.",
    image: images.stepImplement,
  },
  {
    id: "verify",
    title: "Verify",
    description:
      "We check progress on the ground with photos, site visits and community feedback before marking milestones complete.",
    image: images.stepVerify,
  },
  {
    id: "report",
    title: "Report",
    description:
      "You receive updates on the outcomes you funded, and our financial reports are published openly for everyone.",
    image: images.stepReport,
  },
];

export const volunteer = {
  eyebrow: "Volunteer with us",
  title: ["Give your time.", "Share your skills."],
  body: "Whether you teach, heal, build, organise or create, there is a place for you — in the field across Kenya or remotely from anywhere in the world.",
  /** TODO: confirm the volunteer roles the foundation actually offers. */
  roles: ["Field programmes", "Teaching & mentoring", "Health outreach", "Events & fundraising", "Digital & remote", "Professional skills"],
  image: images.volunteers,
};

export const transparency = {
  eyebrow: "Transparency",
  title: "Accountable for every gift.",
  body: "Trust is earned in the open. We publish how funds are allocated, how projects are governed and what they achieved — including what didn't go to plan.",
  allocation: [
    { label: "Programmes", percent: 82, tone: "green" },
    { label: "Fundraising", percent: 10, tone: "gold" },
    { label: "Administration", percent: 8, tone: "neutral" },
  ] satisfies AllocationItem[],
  allocationVerified: false,
  commitments: [
    { title: "Published financial reports", body: "Annual statements and spending summaries, open to all." },
    { title: "Project-level tracking", body: "Budgets and milestones for each campaign you can follow." },
    { title: "Clear governance", body: "Who leads us, who oversees us, and how decisions are made." },
    { title: "Honest outcomes", body: "Verified results, community feedback and lessons learned." },
  ],
  reports: [
    { title: "Annual report", period: "Latest year", status: "coming-soon" },
    { title: "Audited financial statements", period: "Latest year", status: "coming-soon" },
    { title: "Programme updates", period: "Quarterly", status: "coming-soon" },
  ] as ReportItem[],
};

export const finalCta = {
  eyebrow: "Are you ready to",
  title: ["Be someone’s", "turning point."],
  body: "Choose an amount. You’ll confirm the details and payment method on the next step.",
  image: images.ctaChildren,
};
