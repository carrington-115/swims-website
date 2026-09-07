import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { SiteImage as SiteImageAsset } from "@/assets/images";
import { Section } from "@/components/layout/section";
import { SiteImage } from "@/components/media/site-image";
import {
  heroFrame,
  heroFrameCopy,
} from "@/components/sections/hero/hero-frame";
import { cn } from "@/lib/cn";

type PageHeroProps = ComponentPropsWithoutRef<"section"> & {
  image: SiteImageAsset;
  heading: string;
  /**
   * Standfirst under the heading -- the "Subheading" column in IMAGES.md.
   *
   * Passing one switches the band to its second shape: a narrower copy column
   * with a smaller headline, sitting mid-frame instead of low. The two shapes
   * are the two the design has, so this stays one prop rather than separate
   * width/size/alignment knobs.
   */
  body?: string;
  /** Rendered under the copy -- usually a `Button`. */
  action?: ReactNode;
  /** `h1` unless the page already has one above this band. */
  headingLevel?: 1 | 2;
};

/**
 * Standing hero for an interior page (Figma 3033:4734 desktop, 3076:37288
 * mobile; 3065:35738 for the standfirst shape on Partners).
 *
 * Draws itself in the shared `heroFrame` -- full bleed, 90vh, square corners --
 * so this, the home carousel and the DTRACKER banner are the same furniture and
 * can only ever change together. Every page that opens on a photograph should
 * use this rather than rebuilding it.
 *
 * The copy stays low on phones either way: `.hero-scrim` darkens the frame from
 * the bottom there and only swings to the left edge at `lg`, so mid-frame copy
 * would sit on undarkened photograph on a phone.
 */
export function PageHero({
  image,
  heading,
  body,
  action,
  headingLevel = 1,
  className,
  ...props
}: PageHeroProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <Section spacing="none" className={cn(className)} {...props}>
      {/* No `Container`: `heroFrame` runs the full width of the viewport. */}
      <div className={heroFrame}>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <SiteImage image={image} alt="" cover priority sizes="100vw" />
          <div className="hero-scrim absolute inset-0" />
        </div>

        <div
          className={cn(
            heroFrameCopy,
            "items-start",
            body ? "gap-2.5 lg:justify-center lg:pb-0" : "gap-5",
          )}
        >
          {/*
            `items-start` so `action` -- an inline-flex button -- keeps its own
            width. A flex column stretches its children by default, which sized
            every hero button to the whole copy column.
          */}
          <div
            className={cn(
              "flex flex-col items-start",
              body ? "gap-2.5 lg:max-w-140" : "gap-5 lg:max-w-252",
            )}
          >
            <Heading
              className={cn(
                "max-w-full text-3xl leading-normal font-semibold text-white",
                body
                  ? "lg:text-[2.5rem] lg:leading-13"
                  : "lg:text-5xl lg:leading-15",
              )}
            >
              {heading}
            </Heading>

            {body ? (
              <p className="text-base text-white/90 lg:text-2xl">{body}</p>
            ) : null}

            {action}
          </div>
        </div>
      </div>
    </Section>
  );
}
