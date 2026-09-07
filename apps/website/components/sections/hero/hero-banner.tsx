import type { ComponentPropsWithoutRef } from "react";

import { Section } from "@/components/layout/section";
import { cn } from "@/lib/cn";

import { HeroBackdrop } from "./hero-backdrop";
import { heroFrame, heroFrameCopy } from "./hero-frame";
import type { HeroSlideContent } from "./hero-slide-content";
import { HeroCopy } from "./hero-copy";

type HeroBannerProps = ComponentPropsWithoutRef<"section"> & {
  slide: HeroSlideContent;
  /** `1` when the banner opens a page, which is the usual case. */
  headingLevel?: 1 | 2;
};

/**
 * One hero panel standing on its own, at the top of a page that has no
 * carousel -- the DTRACKER product page opens with the same panel the home
 * slider runs second.
 *
 * The geometry is the slider's: full bleed, `h-hero` tall, copy sitting low in
 * the frame. It keeps the slider's bottom padding even though there are no
 * slide pickers to clear, so a visitor arriving from the home page sees the
 * panel land in the same place.
 *
 * No carousel semantics: this is a banner, not a slide, so it carries no
 * `role="group"` and no "1 of 4" label.
 */
export function HeroBanner({
  slide,
  headingLevel = 1,
  className,
  ...props
}: HeroBannerProps) {
  return (
    <Section spacing="none" className={cn(className)} {...props}>
      {/* No `Container`: `heroFrame` runs the full width of the viewport. */}
      <div className={heroFrame}>
        <HeroBackdrop slide={slide} priority />
        <div className={heroFrameCopy}>
          <HeroCopy slide={slide} headingLevel={headingLevel} />
        </div>
      </div>
    </Section>
  );
}
