import { images, type SiteImage } from "@/assets/images";

/**
 * Copy for the Partners page, transcribed from Figma 3065:35738 (hero),
 * 3065:35757 (the wall) and 3065:35796 (the product grid).
 *
 * Kept out of `page.tsx` so the route stays a list of sections, and out of the
 * sections themselves so they can be reused with other copy.
 */

export const heroHeading = "Partner with us. Transform waste management";

export const heroBody =
  "SWIMS connects collectors, institutions, and innovators to solve Africa's waste crisis together. If you're ready to move waste from invisible to coordinated — let's talk.";

export const wallHeading = "Our partners and supporters";

/**
 * The nine marks the wall draws, in the frame's order: five on the first row,
 * four on the second. `LogoWall` normalises the heights Figma gives each file
 * individually.
 */
export const partnerLogos: readonly SiteImage[] = [
  images.partners.fi,
  images.partners.bv,
  images.partners.athenaVc,
  images.partners.microsoft,
  images.partners.ticSummit,
  images.partners.mitSolve,
  images.partners.mountainHub,
  images.partners.mountainAngelNetwork,
  images.partners.mecitech,
];
