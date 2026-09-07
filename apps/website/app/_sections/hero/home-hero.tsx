import { Section } from "@/components/layout/section";
import { HeroBackdrop } from "@/components/sections/hero/hero-backdrop";

import { heroSlides } from "./hero-content";
import { HeroSlide } from "./hero-slide";
import { HeroSlider } from "./hero-slider";

/**
 * Home page hero: a four-slide carousel running the full width of the viewport
 * at every breakpoint, built from the Figma frames listed in `hero-content.ts`.
 *
 * Figma insets the desktop slide into a 1320px rounded card; it is full bleed
 * here at the request of the design owner, so the carousel takes no page shell
 * and squares off its corners.
 *
 * Assembly only. The slides and the picker miniatures are rendered here, on the
 * server, and handed to `HeroSlider` as children so the client bundle carries
 * the carousel state and nothing else.
 *
 * Note: Figma sets this type in Poppins. The site still ships Geist from
 * `app/layout.tsx`; swapping the typeface is a site-wide change, so the hero
 * follows the current `--font-sans` rather than introducing a second family.
 */
export function HomeHero() {
  return (
    <Section spacing="none">
      {/* No `Container`: the carousel is full bleed, so it takes the whole
       * viewport width rather than the 1440px page shell. */}
      <HeroSlider
        labels={heroSlides.map((slide) => slide.label)}
        slides={heroSlides.map((slide, index) => (
          <HeroSlide
            key={slide.id}
            slide={slide}
            index={index}
            total={heroSlides.length}
          />
        ))}
        thumbnails={heroSlides.map((slide) => (
          <HeroBackdrop key={slide.id} slide={slide} size="thumb" />
        ))}
      />
    </Section>
  );
}
