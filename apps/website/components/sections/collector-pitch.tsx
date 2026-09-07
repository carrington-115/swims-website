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
 * The phones sit beside the copy on desktop and tilt in under it on phones,
 * where the frame runs them off both edges.
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
      <Container className="flex flex-col items-center gap-8 py-8 lg:flex-row-reverse lg:gap-12.5 lg:py-14">
        <div className="flex w-full flex-col gap-5 lg:w-160">
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
                  <b className="font-medium">{benefit.title}</b> — {benefit.body}
                </span>
              </li>
            ))}
          </ul>

          <AppStoreButtons />
        </div>

        {/*
         * Phones. On a phone screen the frame tilts them and lets the band clip
         * them, so the art sits in a fixed-height window it cannot grow -- a
         * rotated element still reserves its upright box in the flow otherwise,
         * which would double the height of the band.
         */}
        <div className="relative h-56 w-full shrink-0 overflow-hidden lg:hidden">
          <SiteImage
            image={images.whyUs.dtrackerPhones}
            className="absolute top-2 left-1/2 w-104 max-w-none -translate-x-1/2 -rotate-52"
            sizes="416px"
          />
        </div>
        <SiteImage
          image={images.whyUs.dtrackerPhones}
          className="hidden w-107 shrink-0 lg:block"
          sizes="426px"
        />
      </Container>
    </Section>
  );
}
