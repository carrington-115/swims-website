import { images } from "@/assets/images";
import {
  dtrackerSlide,
  type HeroSlideContent,
} from "@/components/sections/hero/hero-slide-content";

export type { HeroSlideContent };

/**
 * The four home hero slides, in order (Figma desktop 3013:161, 3014:199,
 * 3015:289, 3017:332; mobile 3070:36670, 3070:36701, 3070:36755, 3070:36784).
 *
 * The DTRACKER panel is not written here: the product page opens with the same
 * panel, so it lives in `components/sections/hero/hero-slide-content.ts` and is
 * dropped into second place below. The other three are home's alone.
 */
export const heroSlides: readonly HeroSlideContent[] = [
  {
    id: "better-future",
    tone: "photo",
    image: images.home.heroCommunity,
    heading:
      "How we are building a better future for Smart Waste Management in Africa",
    body: "Connecting the collectors who already manage Africa's waste, and embedding their work into national and continental policy.",
    cta: { label: "Read the article", href: "/why-us" },
    label: "A better future for waste management",
  },
  dtrackerSlide,
  {
    id: "dtracker-story",
    tone: "photo",
    image: images.home.heroStory,
    heading: "Discover the story behind DTRACKER",
    body: "The two-city network that proved collectors and households were already waiting for a way to find each other, we just had to build the bridge.",
    cta: { label: "Read the article", href: "/products/dtracker" },
    label: "The story behind DTRACKER",
  },
  {
    id: "swims-platform",
    tone: "photo",
    image: images.home.heroPlatform,
    heading: "SWIMS Platform for Advanced waste tracking",
    body: "The data layer that turns invisible waste networks into formal infrastructure, and gives institutions the tools to plan, fund, and scale them.",
    cta: { label: "Read the article", href: "/products/platform" },
    label: "The SWIMS platform",
  },
];
