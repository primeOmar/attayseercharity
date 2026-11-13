import type { ImageAsset } from "@/types/content";

/**
 * Image library.
 *
 * Interim photography from Unsplash (free to use under the Unsplash License,
 * https://unsplash.com/license). Replace with the foundation's own project
 * photography as soon as it is available — authentic images always win.
 *
 * Alt text describes what is visible; it intentionally makes no claims about
 * location or that the people pictured are beneficiaries of this foundation.
 */
const u = (id: string) => `Unsplash photo ${id}`;

export const images = {
  heroSchoolWalk: {
    src: "/images/hero-school-walk.jpg",
    alt: "A group of schoolchildren carrying bags and water containers walk together across dry savanna",
    width: 2400,
    height: 1352,
    credit: u("1520254553641-2eed4cf2ef26"),
  },
  heroWaterWalk: {
    src: "/images/hero-water-walk.jpg",
    alt: "Women and children walk along a red-earth road carrying yellow water containers",
    width: 2400,
    height: 1350,
    credit: u("1543181077-099f32f30a1c"),
  },
  heroSmile: {
    src: "/images/hero-smile.jpg",
    alt: "A smiling girl claps her hands among a gathering of women and children",
    width: 2400,
    height: 1598,
    credit: u("1509099863731-ef4bff19e808"),
  },
  causeEducation: {
    src: "/images/cause-education.jpg",
    alt: "A young teacher reads from a book in a full classroom of students",
    width: 1600,
    height: 1068,
    credit: u("1632215861513-130b66fe97f4"),
  },
  causeHealthcare: {
    src: "/images/cause-healthcare.jpg",
    alt: "A smiling mother sits beside her young son",
    width: 1600,
    height: 1022,
    credit: u("1735792339621-2846f164b78f"),
  },
  causeFood: {
    src: "/images/cause-food.jpg",
    alt: "Cupped hands let grain fall through the fingers",
    width: 1600,
    height: 1089,
    credit: u("1710149484964-d966b771c204"),
  },
  causeWater: {
    src: "/images/cause-water.jpg",
    alt: "Children stand beside a hand water pump in a green village",
    width: 1600,
    height: 2133,
    credit: u("1760873059715-7c7cfbe2a2c6"),
  },
  causeEmergency: {
    src: "/images/cause-emergency.jpg",
    alt: "A woman carries a child on her back beside a traditional homestead",
    width: 1600,
    height: 1067,
    credit: u("1687461312437-7a9c316d7998"),
  },
  causeFamily: {
    src: "/images/cause-family.jpg",
    alt: "A mother holds her baby close, standing beside a tree",
    width: 1600,
    height: 2133,
    credit: u("1638628982284-77a437c37089"),
  },
  causeCommunity: {
    src: "/images/cause-community.jpg",
    alt: "A gathering of women in colourful head wraps and dresses",
    width: 1600,
    height: 1065,
    credit: u("1509099896299-af46ad97ff57"),
  },
  volunteers: {
    src: "/images/volunteers.jpg",
    alt: "Three volunteers in matching yellow volunteer t-shirts stand together",
    width: 1600,
    height: 1067,
    credit: u("1560220604-1985ebfe28b1"),
  },
  storyFarming: {
    src: "/images/story-farming.jpg",
    alt: "A smiling woman in a patterned head wrap tends young crops by hand",
    width: 1600,
    height: 1067,
    credit: u("1509100194014-d49809396daa"),
  },
  storyDoorway: {
    src: "/images/story-doorway.jpg",
    alt: "A small child in a striped shirt peers out from a wooden doorway",
    width: 1600,
    height: 2400,
    credit: u("1576685894355-2437748baa08"),
  },
  storyBooks: {
    src: "/images/story-books.jpg",
    alt: "Smiling schoolgirls in blue head scarves hold up their exercise books",
    width: 1600,
    height: 1067,
    credit: u("1666281269793-da06484657e8"),
  },
  storyBoy: {
    src: "/images/story-boy.jpg",
    alt: "A laughing boy in a yellow jacket leans against a red wall",
    width: 1600,
    height: 1067,
    credit: u("1547496726-790c1d3d78f4"),
  },
  stepDonate: {
    src: "/images/step-donate.jpg",
    alt: "Two women in traditional dress walk hand in hand",
    width: 2000,
    height: 1333,
    credit: u("1524414621493-7dec026782c3"),
  },
  stepAllocate: {
    src: "/images/step-allocate.jpg",
    alt: "A team gathers beside a vehicle and laid-out pipes at golden hour",
    width: 2000,
    height: 3020,
    credit: u("1543181139-a1916d8dd9aa"),
  },
  stepImplement: {
    src: "/images/step-implement.jpg",
    alt: "Farm workers plant crops in long rows of freshly turned soil",
    width: 2000,
    height: 1332,
    credit: u("1761634373241-5abcfcaa0c39"),
  },
  stepVerify: {
    src: "/images/step-verify.jpg",
    alt: "A teacher instructs students in a classroom",
    width: 2000,
    height: 1333,
    credit: u("1744809482817-9a9d4fc280af"),
  },
  stepReport: {
    src: "/images/step-report.jpg",
    alt: "Two women in blue robes read together",
    width: 2000,
    height: 1333,
    credit: u("1666281238998-59842bf7e10c"),
  },
  ctaChildren: {
    src: "/images/cta-children.jpg",
    alt: "A crowd of laughing children gathers close to the camera",
    width: 2400,
    height: 1906,
    credit: u("1509099836639-18ba1795216d"),
  },
} satisfies Record<string, ImageAsset>;

/** Small images that fan out behind the mission headline. */
export const collage: ImageAsset[] = [
  { src: "/images/collage-1.jpg", alt: "", width: 800, height: 1200, credit: u("1547496613-4e19af6736dc") },
  { src: "/images/collage-2.jpg", alt: "", width: 800, height: 1000, credit: u("1664990594667-9bd4c60cbcfb") },
  { src: "/images/collage-3.jpg", alt: "", width: 800, height: 533, credit: u("1576830886922-02b61aee42ad") },
  { src: "/images/collage-4.jpg", alt: "", width: 800, height: 1135, credit: u("1515658323406-25d61c141a6e") },
  { src: "/images/collage-5.jpg", alt: "", width: 800, height: 590, credit: u("1553775927-a071d5a6a39a") },
  { src: "/images/collage-6.jpg", alt: "", width: 800, height: 1208, credit: u("1543335547-334c05de28c2") },
  { src: "/images/collage-7.jpg", alt: "", width: 800, height: 533, credit: u("1744809495173-217ca4faa8bc") },
  { src: "/images/collage-8.jpg", alt: "", width: 800, height: 533, credit: u("1509099342178-e323b1717dba") },
];
