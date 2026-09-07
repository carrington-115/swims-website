import type { ComponentPropsWithoutRef } from "react";

import { images } from "@/assets/images";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SiteImage } from "@/components/media/site-image";
import { AppStoreButtons } from "@/components/ui/app-store-buttons";
import { cn } from "@/lib/cn";

/** One selling point: the bold promise, then what it means. */
export type CollectorBenefit = {
  title: string;
  body: string;
};

type CollectorPitchProps = ComponentPropsWithoutRef<"section"> & {
  heading?: string;
  benefits: readonly CollectorBenefit[];
};

/**
 * The pitch to collectors (Figma 3046:4900 desktop, 3076:37374 mobile): a
 * brand-green band with the benefits list and the two store buttons.
 *
 * Figma sets the benefits as one text block with literal check marks; here it
 * is a real list with the mark as a marker, so a screen reader announces five
 * items rather than reading "tick" five times mid-sentence.
 *
 * The phones sit beside the copy from `lg` as a single render of the pair, and
 * tilt in under it on phones as two separate handsets, which is the only way to
 * hit the spread the mobile frame draws.
 */
export function CollectorPitch({
  heading = "Don't wait for the solution, become the solution",
  benefits,
  className,
  ...props
}: CollectorPitchProps) {
  return (
    <Section
      spacing="none"
      tone="surface"
      aria-labelledby="collector-pitch-heading"
      className={cn("relative overflow-hidden bg-secondary", className)}
      {...props}
    >
      <Container className="flex flex-col items-center pt-8 pb-6 lg:flex-row-reverse lg:gap-12.5 lg:py-14">
        <div className="flex w-full flex-col gap-5 lg:w-160">
          {/* 12px between the heading and the list on phones, 20px from lg. */}
          <div className="flex flex-col gap-3 lg:gap-5">
            <h2
              id="collector-pitch-heading"
              className="font-display text-xl font-medium text-white lg:text-3xl"
            >
              {heading}
            </h2>

            <ul className="flex flex-col gap-1 text-sm text-tertiary-100 lg:text-xl">
              {benefits.map((benefit) => (
                <li key={benefit.title} className="flex gap-2">
                  <span aria-hidden className="shrink-0">
                    ✓
                  </span>
                  <span>
                    <b className="font-medium">{benefit.title}</b> —{" "}
                    {benefit.body}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <AppStoreButtons />
        </div>

        {/* Phones, from `lg`: one render with the pair already arranged. */}
        <SiteImage
          image={images.whyUs.dtrackerPhones}
          className="hidden w-107 shrink-0 lg:block"
          sizes="426px"
        />
      </Container>

      {/*
       * Phones, on phones. The mobile frame tilts the two handsets 52deg,
       * spreads them much further apart than the desktop render has them, and
       * runs them off the left edge, the right edge and the bottom of the band
       * -- so this sits outside `Container`, where it is already viewport-wide,
       * rather than inside the gutter that would clip it early. The window has
       * a fixed height because a rotated element still reserves its upright box
       * in the flow, which would otherwise double the height of the band.
       *
       * Inside it, a 390px stage carries the two phones at the offsets the
       * frame gives them. The stage is centred and does not scale, so a
       * narrower screen crops the composition evenly instead of shrinking the
       * artwork.
       */}
      <div className="relative h-58.25 overflow-hidden lg:hidden">
        <div className="absolute top-0 left-1/2 h-full w-97.5 -translate-x-1/2">
          <SiteImage
            image={images.whyUs.dtrackerPhonePickup}
            className="absolute top-1 -left-14 w-44 max-w-none -rotate-52"
            sizes="176px"
          />
          <SiteImage
            image={images.whyUs.dtrackerPhoneVerification}
            className="absolute top-0 left-58.25 w-43.5 max-w-none -rotate-52"
            sizes="174px"
          />
        </div>
      </div>
    </Section>
  );
}
