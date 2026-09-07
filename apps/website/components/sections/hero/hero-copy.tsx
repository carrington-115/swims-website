import type { ComponentPropsWithoutRef } from "react";

import { SiteImage } from "@/components/media/site-image";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

import type { HeroSlideContent } from "./hero-slide-content";

type HeroCopyProps = ComponentPropsWithoutRef<"div"> & {
  slide: HeroSlideContent;
  /**
   * The first slide carries the page's `h1`; the others are `h2` so the
   * document keeps exactly one top-level heading whichever slide is showing.
   */
  headingLevel?: 1 | 2;
};

/**
 * Wordmark, heading, body and call to action of a hero slide.
 *
 * Type scale is Figma's: 30/16 on phones, 48/24 from `lg`. The photo slides run
 * wider than the DTRACKER slide, which has to leave room for the phone cluster
 * on its right.
 */
export function HeroCopy({
  slide,
  headingLevel = 2,
  className,
  ...props
}: HeroCopyProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const isBrand = slide.tone === "brand";

  return (
    <div
      className={cn("flex w-full flex-col items-start gap-5", className)}
      {...props}
    >
      {slide.logo ? (
        <SiteImage
          image={slide.logo}
          className="h-11 w-auto lg:h-15"
          priority
        />
      ) : null}

      {/*
       * `w-full` matters: the column is `items-start`, so without it the
       * headline would size to its own max-content width and run off a phone
       * screen instead of wrapping.
       */}
      <div className={cn("flex w-full flex-col", !isBrand && "text-on-image")}>
        <Heading
          className={cn(
            "text-3xl leading-normal font-semibold text-white lg:text-5xl",
            isBrand
              ? "lg:max-w-96 lg:leading-[3.875rem] xl:max-w-144"
              : "lg:max-w-216 lg:leading-15",
          )}
        >
          {slide.heading}
        </Heading>
        <p
          className={cn(
            "text-base leading-normal text-white lg:text-2xl",
            isBrand ? "lg:max-w-96 xl:max-w-144" : "lg:max-w-184",
          )}
        >
          {slide.body}
        </p>
      </div>

      <Button
        href={slide.cta.href}
        variant="onImageSolid"
        shape="square"
        size={isBrand ? "lg" : "md"}
        className={cn("px-3", isBrand && "gap-3 text-xl text-secondary")}
      >
        {slide.cta.icon === "download" ? (
          <DownloadIcon className="size-6" />
        ) : null}
        {slide.cta.label}
      </Button>
    </div>
  );
}
