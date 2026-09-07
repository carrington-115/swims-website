import type { ComponentPropsWithoutRef } from "react";

import { HeroBackdrop } from "@/components/sections/hero/hero-backdrop";
import { HeroCopy } from "@/components/sections/hero/hero-copy";
import { heroFrameCopy } from "@/components/sections/hero/hero-frame";
import { cn } from "@/lib/cn";

import type { HeroSlideContent } from "./hero-content";

type HeroSlideProps = ComponentPropsWithoutRef<"div"> & {
  slide: HeroSlideContent;
  index: number;
  total: number;
};

/**
 * One panel of the hero slider: the backdrop with the copy sitting low in the
 * frame, clear of the slide pickers along the bottom edge.
 *
 * A server component -- the slider hands these to the client wrapper as
 * children so `next/image` and the copy never ship to the browser.
 */
export function HeroSlide({
  slide,
  index,
  total,
  className,
  ...props
}: HeroSlideProps) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${slide.label}`}
      className={cn("relative isolate overflow-hidden", heroFrameCopy, className)}
      {...props}
    >
      <HeroBackdrop slide={slide} priority={index === 0} />
      <HeroCopy slide={slide} headingLevel={index === 0 ? 1 : 2} />
    </div>
  );
}
