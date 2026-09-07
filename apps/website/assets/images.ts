/**
 * SWIMS website image registry.
 *
 * The single source of truth for every image shipped with the site. Components
 * import from here -- never from a raw file path, and never with a hand-written
 * `alt` string at the call site:
 *
 *     import { images } from "@/assets/images";
 *     <SiteImage image={images.home.phone} className="w-64" />
 *
 * Why a registry:
 *  - static imports give Next.js the intrinsic width/height, so `next/image`
 *    can reserve space and generate a blur placeholder;
 *  - alt text lives next to the file, so it is written once and reviewed once;
 *  - `focal` records the crop point a photo needs when it is used as a cover
 *    image, which is otherwise re-guessed on every page.
 *
 * Adding an image: drop the file under `assets/`, add an entry below, and
 * describe it in `docs/IMAGES.md` if it is a photograph. That doc also carries
 * the format/size budget every file must meet before it is committed.
 */
import type { StaticImageData } from "next/image";

import dtrackerLogo from "./figma-images/dtracker-logo.svg";
import logo from "./figma-images/logo.png";
import phonesHero from "./figma-images/phones-hero.png";
import phonesMobileHero from "./figma-images/phones-mobile-hero.png";

import menuFeature from "./figma-images/menu/collectors-dumpsite.webp";

import cmrMap from "./figma-images/home/cmr-map.svg";
import homeIotSensor from "./figma-images/home/iot-sensor.png";
import homePhone from "./figma-images/home/phone-1.png";

import blogPlaceholderCover from "./figma-images/home/blog/placeholder-cover.webp";
import newsletterCollectors from "./figma-images/home/newsletter/collectors.webp";

import heroCommunity from "./figma-images/home/hero/community.webp";
import heroPhone from "./figma-images/home/hero/dtracker-phone.webp";
import heroPlatform from "./figma-images/home/hero/platform.webp";
import heroStory from "./figma-images/home/hero/story.webp";

import dtrackerHeroPhone from "./figma-images/dtracker/hero-phone.webp";
import dtracker247 from "./figma-images/dtracker/phone-24-7.png";
import dtrackerGoals from "./figma-images/dtracker/phone-goals.png";
import dtrackerGoalsMobile from "./figma-images/dtracker/phone-goals-mobile.png";
import dtrackerPayment from "./figma-images/dtracker/phone-payment.png";
import dtrackerSchedule from "./figma-images/dtracker/phone-schedule.png";
import dtrackerSecurity from "./figma-images/dtracker/phone-security.png";

import whyUsPhone from "./figma-images/why-us/phone-2.png";
import whyUsPhones from "./figma-images/why-us/dtracker-phones.webp";
import whyUsPhonePickup from "./figma-images/why-us/phone-pickup.webp";
import whyUsPhoneVerification from "./figma-images/why-us/phone-verification.webp";
import whyUsHero from "./figma-images/why-us/hero.webp";

import platformDrone from "./figma-images/swims-platform/drone.png";
import platformSensor from "./figma-images/swims-platform/labelled-sensor.png";
import platformMonitor from "./figma-images/swims-platform/monitor.png";

import productDtracker from "./figma-images/product-images/dtracker.png";
import productDesignChallenge from "./figma-images/product-images/swims-design-challenge.png";

import teamCeo from "./figma-images/team/ceo.png";
import teamCmo from "./figma-images/team/cmo.png";
import teamCoo from "./figma-images/team/coo.png";
import teamCto from "./figma-images/team/cto.png";

import partnersHero from "./figma-images/partners/hero.webp";

import partnerAthena from "./figma-images/partners/athena-vc-logo.avif";
import partnerBv from "./figma-images/partners/bv-logo.webp";
import partnerFi from "./figma-images/partners/fi-logo.png";
import partnerMecitech from "./figma-images/partners/mecitech.png";
import partnerMicrosoft from "./figma-images/partners/microsoft-logo.png";
import partnerMitSolve from "./figma-images/partners/MIT_Solve.png";
import partnerMountainAngel from "./figma-images/partners/mountain-angel-network.png";
import partnerMountainHub from "./figma-images/partners/mountain-hub.png";
import partnerTicSummit from "./figma-images/partners/tic-summit-logo.png";

export type SiteImage = {
  src: StaticImageData;
  /**
   * Describes the content AND why it matters, e.g.
   * "[Subject] in [Location], representing [theme]".
   * Use an empty string only for images that are purely decorative and always
   * accompanied by equivalent text.
   */
  alt: string;
  /**
   * Set on artwork with an alpha channel -- cut-out phone mockups, logos,
   * diagrams. It turns off the blur placeholder, which would otherwise show
   * through the transparent parts as a pale box. Photographs leave it unset.
   */
  transparent?: true;
  /**
   * `object-position` to apply when the image is rendered as a cover fill.
   * `base` is the mobile crop, `md` the >=768px crop. Omit for images that are
   * never cropped (logos, product shots, phone mockups).
   */
  focal?: { base: string; md?: string };
};

const defineImages = <T extends Record<string, SiteImage>>(group: T): T =>
  group;

export const brand = defineImages({
  logo: {
    src: logo,
    alt: "SWIMS logo",
    transparent: true,
  },
  dtrackerLogo: {
    src: dtrackerLogo,
    alt: "DTRACKER",
    transparent: true,
  },
});

export const menu = defineImages({
  feature: {
    src: menuFeature,
    alt: "Two children picking through an open dumpsite in Cameroon, the everyday reality SWIMS exists to formalise",
    focal: { base: "center center", md: "center center" },
  },
});

export const home = defineImages({
  /* --- Hero slider (Figma 3013:161, 3014:199, 3015:289, 3017:332) --------- */
  heroCommunity: {
    src: heroCommunity,
    alt: "A crowd cheering with raised hands at a community gathering, representing the collectors and residents SWIMS is building a formal waste system with",
    focal: { base: "center 30%", md: "center center" },
  },
  heroStory: {
    src: heroStory,
    alt: "A woman standing on a smoking open dumpsite at dawn, the conditions that led two cities to start using DTRACKER",
    focal: { base: "center 45%", md: "center center" },
  },
  heroPlatform: {
    src: heroPlatform,
    alt: "A collector bagging plastic bottles on a field of discarded waste, the material flow the SWIMS platform makes measurable",
    focal: { base: "center 55%", md: "center center" },
  },
  heroPhone: {
    src: heroPhone,
    alt: "DTRACKER on a phone, showing pickup options and a collector's monthly earnings",
    transparent: true,
  },

  /* --- Latest blogs + newsletter (Figma 3024:3705, 3024:4582) ------------ */
  blogPlaceholderCover: {
    src: blogPlaceholderCover,
    alt: "Waste management volunteers gathered for a community clean-up",
    /* Matches the crop the Figma card uses on this portrait source. */
    focal: { base: "46% 60%" },
  },
  newsletterCollectors: {
    src: newsletterCollectors,
    alt: "Three collectors in high-visibility vests holding bags of sorted waste after a neighbourhood pickup",
    focal: { base: "center center" },
  },

  phonesHero: {
    src: phonesHero,
    alt: "DTRACKER shown on three phones: collector dashboard, pickup map and earnings",
    transparent: true,
  },
  phonesHeroMobile: {
    src: phonesMobileHero,
    alt: "DTRACKER shown on a phone: collector dashboard with pickups and earnings",
    transparent: true,
  },
  phone: {
    src: homePhone,
    alt: "DTRACKER collector dashboard showing pending pickup requests",
    transparent: true,
  },
  iotSensor: {
    src: homeIotSensor,
    alt: "SWIMS IoT fill-level sensor mounted inside a waste bin",
    transparent: true,
  },
  cameroonMap: {
    src: cmrMap,
    alt: "Map of Cameroon marking the cities where SWIMS operates",
    transparent: true,
  },
});

export const dtracker = defineImages({
  /*
   * The single handset the DTRACKER hero tilts into its top-right corner on
   * phones (Figma 3076:37779). Close to `home.heroPhone`, which the home
   * carousel's DTRACKER slide uses for the same shot, but that one is a
   * tighter, opaque crop on a green plate; this is the frame's own 325x679
   * export with its alpha, which the rotation needs.
   */
  heroPhone: {
    src: dtrackerHeroPhone,
    alt: "DTRACKER pickup options and a collector's January earnings",
    transparent: true,
  },
  availability: {
    src: dtracker247,
    alt: "DTRACKER screen showing 24/7 pickup availability",
    transparent: true,
  },
  goals: {
    src: dtrackerGoals,
    alt: "DTRACKER screen showing a collector's monthly collection goals and progress",
    transparent: true,
  },
  /*
   * The same band on phones (Figma 3076:37854). The desktop render is two
   * tilted handsets 692px wide; at 358px the numbers on it are unreadable, so
   * the mobile frame draws a single upright earnings screen instead.
   */
  goalsMobile: {
    src: dtrackerGoalsMobile,
    alt: "DTRACKER screen showing a collector's monthly collection goals and progress",
    transparent: true,
  },
  payment: {
    src: dtrackerPayment,
    alt: "DTRACKER screen showing mobile money payment for a completed pickup",
    transparent: true,
  },
  schedule: {
    src: dtrackerSchedule,
    alt: "DTRACKER screen showing a collector's scheduled pickups for the week",
    transparent: true,
  },
  security: {
    src: dtrackerSecurity,
    alt: "DTRACKER screen showing account security and verification settings",
    transparent: true,
  },
});

export const whyUs = defineImages({
  phone: {
    src: whyUsPhone,
    alt: "DTRACKER showing waste collection data captured in the field",
    transparent: true,
  },
  /* --- Why Us page (Figma 3025:4695 desktop, 3076:37272 mobile) ---------- */
  hero: {
    src: whyUsHero,
    alt: "Waste collectors at work in their community, the informal system SWIMS exists to formalise",
    focal: { base: "center 35%", md: "center center" },
  },
  dtrackerPhones: {
    src: whyUsPhones,
    alt: "Two phones running DTRACKER, showing a collector's pickups and earnings",
    transparent: true,
  },
  /*
   * The same two handsets as `dtrackerPhones`, but cut apart: the mobile
   * collector-pitch frame tilts them individually and spreads them across the
   * band, which the single composite cannot do (Figma 3076:37395, 3076:37399).
   */
  dtrackerPhonePickup: {
    src: whyUsPhonePickup,
    alt: "DTRACKER pickup options, with a collector's monthly earnings underneath",
    transparent: true,
  },
  dtrackerPhoneVerification: {
    src: whyUsPhoneVerification,
    alt: "DTRACKER agent verification, listing the three steps to activate a collector account",
    transparent: true,
  },
});

export const platform = defineImages({
  drone: {
    src: platformDrone,
    alt: "Drone used by SWIMS to survey dumpsites from the air",
    transparent: true,
  },
  sensor: {
    src: platformSensor,
    alt: "Labelled diagram of the SWIMS bin sensor and its components",
    transparent: true,
  },
  monitor: {
    src: platformMonitor,
    alt: "SWIMS monitoring dashboard displaying live waste collection data",
    transparent: true,
  },
});

export const products = defineImages({
  dtracker: {
    src: productDtracker,
    alt: "DTRACKER, the mobile app connecting waste collectors and customers",
    transparent: true,
  },
  designChallenge: {
    src: productDesignChallenge,
    alt: "The SWIMS Design Challenge, an open call for waste innovation projects",
    transparent: true,
  },
});

export const team = defineImages({
  ceo: {
    src: teamCeo,
    alt: "Portrait of Fru-Mark Carrington Chei, SWIMS founder and CEO",
  },
  cto: {
    src: teamCto,
    alt: "Portrait of Arrey-Etta Bessong, SWIMS co-founder and technology systems director",
  },
  coo: {
    src: teamCoo,
    alt: "Portrait of Ntoh Epotie Alida, SWIMS co-founder and COO",
  },
  cmo: {
    src: teamCmo,
    alt: "Portrait of Tardzenyuy Brian Harris, SWIMS co-founder and marketing director",
  },
});

export const partners = defineImages({
  /* --- Partners page (Figma 3065:35738) --------------------------------- */
  hero: {
    src: partnersHero,
    alt: "A collector lifting plastic bottles out of a littered riverbank, the informal work SWIMS partners with institutions to formalise",
    focal: { base: "center 45%", md: "center center" },
  },

  /* --- Partner and investor marks --------------------------------------- */
  athenaVc: { src: partnerAthena, alt: "Athena VC logo", transparent: true },
  bv: {
    src: partnerBv,
    alt: "BeVisioneers, the Mercedes-Benz Fellowship, logo",
    transparent: true,
  },
  fi: { src: partnerFi, alt: "Founder Institute logo", transparent: true },
  mecitech: { src: partnerMecitech, alt: "Mecitech logo", transparent: true },
  microsoft: {
    src: partnerMicrosoft,
    alt: "Microsoft for Startups Founders Hub logo",
    transparent: true,
  },
  mitSolve: { src: partnerMitSolve, alt: "MIT Solve logo", transparent: true },
  mountainAngelNetwork: {
    src: partnerMountainAngel,
    alt: "Mountain Angel Network logo",
    transparent: true,
  },
  mountainHub: {
    src: partnerMountainHub,
    alt: "Mountain Hub logo",
    transparent: true,
  },
  ticSummit: {
    src: partnerTicSummit,
    alt: "TIC Summit logo",
    transparent: true,
  },
});

/**
 * Editorial photography (Pexels, CC0).
 *
 * The files are NOT in the repo yet. Download them per the checklist in
 * `docs/IMAGES.md`, save them as `assets/photography/<name>.webp`, then move
 * the matching entry out of the block below into `photography`. Alt text and
 * focal points are already decided -- copy them, do not rewrite them.
 *
 *   import wasteCrisis from "./photography/waste-crisis-burundi.webp";
 *   import landfill from "./photography/environmental-impact-burundi.webp";
 *   import rustyCans from "./photography/garbage-dump-rusty-cans.webp";
 *   import youthPath from "./photography/youth-dirt-path-nigeria.webp";
 *
 *   wasteCrisis: {
 *     src: wasteCrisis,
 *     alt: "Woman standing amid piles of plastic waste in Burundi, representing the scale of Africa's waste crisis",
 *     focal: { base: "center 20%", md: "center center" },
 *   },
 *   landfill: {
 *     src: landfill,
 *     alt: "Landfill site in Burundi, showing the environmental degradation caused by mismanaged waste",
 *     focal: { base: "center 40%", md: "center center" },
 *   },
 *   rustyCans: {
 *     src: rustyCans,
 *     alt: "Garbage dump full of rusty cans and discarded metal, showing uncontrolled dumping of recoverable material",
 *     focal: { base: "center 35%", md: "center center" },
 *   },
 *   youthPath: {
 *     src: youthPath,
 *     alt: "Young boy walking on a dirt path in Nigeria, representing the communities SWIMS builds for",
 *     focal: { base: "center 45%", md: "center center" },
 *   },
 */
export const photography = defineImages({});

/** Every group in one object, for `images.<group>.<name>` lookups. */
export const images = {
  brand,
  menu,
  home,
  dtracker,
  whyUs,
  platform,
  products,
  team,
  partners,
  photography,
};
