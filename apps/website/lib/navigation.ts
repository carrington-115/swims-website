/**
 * Site navigation, in one place.
 *
 * The header, the collapse menu and the footer all read from here, so a route
 * change is a one-line edit. The labels and their order come from the Figma
 * menu frames (desktop 3012:101, mobile 3070:36476) -- edit this file, not the
 * components.
 */

export type NavLink = {
  label: string;
  href: string;
  /** Shown under the label when the item is expanded in the collapse menu. */
  description?: string;
};

export type NavItem = NavLink & {
  /** Present when the item expands a submenu instead of navigating directly. */
  children?: readonly NavLink[];
};

export const mainNav: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Why SWIMS?", href: "/why-us" },
  {
    label: "Products",
    href: "/products",
    children: [
      {
        label: "DTRACKER",
        href: "/products/dtracker",
        description: "The app that connects collectors, households and businesses",
      },
      {
        label: "SWIMS Platform",
        href: "/products/platform",
        description: "Live waste data for municipalities and partners",
      },
      {
        label: "Design challenge",
        href: "/products/design-challenge",
        description: "Our open call for waste innovation",
      },
    ],
  },
  { label: "Our Partners", href: "/partners" },
  { label: "Our people", href: "/people" },
  { label: "Join our team", href: "/careers" },
  { label: "Contact us", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

/** A titled column of links in the footer (Figma 3025:4647). */
export type NavGroup = {
  title: string;
  links: readonly NavLink[];
};

/**
 * Footer link columns. Deliberately separate from `mainNav`: the footer repeats
 * the popular destinations rather than mirroring the menu, and the Figma frame
 * lists items (`Our Mission`, `FAQs`, `DTRACKER story`) the menu does not have.
 */
export const footerNav: readonly NavGroup[] = [
  {
    title: "Popular links",
    links: [
      { label: "Home", href: "/" },
      { label: "About us", href: "/why-us" },
      { label: "DTRACKER", href: "/products/dtracker" },
      { label: "Blogs", href: "/blog" },
      { label: "Our Mission", href: "/why-us#mission" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "DTRACKER", href: "/products/dtracker" },
      { label: "SWIMS Platform", href: "/products/platform" },
      { label: "SWIMS design challenge", href: "/products/design-challenge" },
    ],
  },
  {
    title: "Quick links",
    links: [
      { label: "About us", href: "/why-us" },
      { label: "Contact us", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
      { label: "Blogs", href: "/blog" },
      { label: "DTRACKER story", href: "/products/dtracker#story" },
    ],
  },
];

/**
 * Which glyph `SocialLinks` draws for a profile. The last two are only ever
 * used by a team member (Figma 3138:251); SWIMS itself has no GitHub or X.
 */
export type SocialNetwork =
  | "linkedin"
  | "facebook"
  | "instagram"
  | "youtube"
  | "github"
  | "x";

export type SocialLink = {
  network: SocialNetwork;
  /** Used as the link's accessible name: "SWIMS on LinkedIn". */
  label: string;
  href: string;
};

export const socialLinks: readonly SocialLink[] = [
  {
    network: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/swims-africa",
  },
  { network: "facebook", label: "Facebook", href: "https://www.facebook.com/swimsafrica" },
  {
    network: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/swimsafrica",
  },
  { network: "youtube", label: "YouTube", href: "https://www.youtube.com/@swimsafrica" },
];

/** Shown in the footer and used as the `mailto:` target. */
export const contactEmail = "contact@swims.africa";
