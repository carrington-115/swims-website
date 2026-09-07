import { images, type SiteImage } from "@/assets/images";

/**
 * The shape of one hero panel.
 *
 * The frames differ in exactly three ways, which is what `tone` encodes:
 *
 *  - a photo slide is a full-bleed photograph under a scrim;
 *  - a brand slide is flat brand green, the wordmark above the heading, phone
 *    mockups floated into the frame instead of a photo, and a call to action in
 *    brand green with a download icon;
 *  - the copy column is wider on the photo slides than on a brand one.
 *
 * Everything else -- geometry, type scale, the slide pickers -- is shared, so
 * it lives in the components rather than in the content.
 */
export type HeroSlideContent = {
  /** Stable key, also used by the slide pickers. */
  id: string;
  tone: "photo" | "brand";
  /** Full-bleed artwork: the photograph, or the desktop phone cluster. */
  image: SiteImage;
  /** Narrow artwork for phones. Only the brand slide swaps its art. */
  imageMobile?: SiteImage;
  /** Wordmark shown above the heading. Brand slide only. */
  logo?: SiteImage;
  heading: string;
  body: string;
  cta: { label: string; href: string; icon?: "download" };
  /** Short name for the previous/next controls and the slide pickers. */
  label: string;
};

/**
 * The DTRACKER panel (Figma 3014:199 desktop, 3070:36701 mobile).
 *
 * Shared, not page-local: the home carousel runs it as its second slide and the
 * DTRACKER product page opens with the same panel standing on its own, so the
 * copy is written once here rather than drifting between the two routes.
 */
export const dtrackerSlide: HeroSlideContent = {
  id: "dtracker-app",
  tone: "brand",
  image: images.home.phonesHero,
  imageMobile: images.home.heroPhone,
  logo: images.brand.dtrackerLogo,
  heading: "Transform Waste Management with Ease",
  body: "Empowering communities to manage waste and recycle smarter.",
  cta: {
    label: "Download the app",
    href: "/products/dtracker",
    icon: "download",
  },
  label: "DTRACKER, the collector app",
};
