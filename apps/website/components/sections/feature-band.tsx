import type { ComponentPropsWithoutRef } from "react";

import type { SiteImage as SiteImageAsset } from "@/assets/images";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SiteImage } from "@/components/media/site-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Background treatment. Each one carries its own heading ink, body ink and
 * button, because the Figma bands change all four together -- a dark band with
 * the white band's green heading, or the green band with the dark band's black
 * button, is not a combination the design has.
 */
type FeatureBandTone =
  | "surface"
  | "surface-accent"
  | "primary"
  | "secondary"
  | "surface-primary"
  | "tertiary";

type FeatureBandProps = ComponentPropsWithoutRef<"section"> & {
  heading: string;
  body: string;
  /** Omit for a band that is copy only -- the DTRACKER feature bands have no button. */
  cta?: { label: string; href: string };
  image: SiteImageAsset;
  /**
   * A second crop of the same media for phones, shown below `lg` in place of
   * `image`. Only for bands whose desktop render does not survive the phone
   * width -- the DTRACKER earnings band is two tilted handsets on desktop and
   * one upright screen on mobile (Figma 3076:37854). Omit it and `image` is
   * used at every width.
   */
  mobileImage?: SiteImageAsset;
  /** Sizing for the media column; the image fills whatever width it is given. */
  mediaClassName?: string;
  /** `sizes` for the image, since it is never the full viewport on desktop. */
  sizes?: string;
  /** `sizes` for `mobileImage`, which is never rendered above `lg`. */
  mobileSizes?: string;
  /**
   * Width of the copy column from `lg`. The Figma bands do not share one --
   * they run 490px or 559px depending on the band -- so each caller sets its
   * own rather than everything inheriting the home page's 660px.
   */
  copyClassName?: string;
  /**
   * Gap between the media and the copy from `lg`. Also per-band: a mockup that
   * already carries its own whitespace sits much closer to the copy than a
   * tightly cropped one.
   */
  gapClassName?: string;
  tone?: FeatureBandTone;
  /**
   * Put the media above the copy on phones. Desktop is always media-left, which
   * is how all three home bands are drawn.
   */
  mediaFirst?: boolean;
  /**
   * Which end of the copy column the button sits at *on phones*. Desktop is
   * always `start`, which is how every frame draws it. The DTRACKER surplus
   * band is the one mobile frame that pushes it to the right edge instead
   * (Figma 3143:286).
   */
  ctaAlign?: "start" | "end";
  /**
   * How the media sits against the copy from `lg`.
   *
   * `center` is the home page: a self-contained image, centred on the copy.
   * `bottom` is the DTRACKER page, where every frame runs the phone off the
   * bottom edge of the band -- the mockup is flush with the band's own bottom
   * (the band drops its lower padding to allow it) and the copy stays centred
   * beside it.
   */
  mediaAlign?: "center" | "bottom";
  /**
   * Type scale for the copy *on phones*. `base` is 24/16, the size the mobile
   * home frames carry (Figma 3070:36918, 3143:286). `lg` is 30/18, which the
   * DTRACKER mobile frames use (Figma 3076:37807 and its four siblings).
   * Desktop is 36/20 either way.
   */
  typeScale?: "base" | "lg";
  /**
   * Which side the media takes from `lg`. `start` is every home and DTRACKER
   * band; `end` is the SWIMS Platform sensor band and its hero, which lead with
   * the copy instead (Figma 3063:35618).
   */
  mediaSide?: "start" | "end";
  headingId: string;
};

const tones = {
  surface: {
    section: "surface",
    heading: "text-primary",
    body: "text-ink-muted",
    button: "primary",
  },
  /**
   * The DTRACKER product bands: the same white plate, but titled in the
   * secondary green and set in the near-black "on surface" ink rather than the
   * muted grey the home band uses (Figma 3049:5226, 3049:5265).
   */
  "surface-accent": {
    section: "surface",
    heading: "text-secondary",
    body: "text-on-surface",
    button: "secondary",
  },
  /**
   * The SWIMS Platform bands: a white plate titled in the *primary* green with
   * body copy in the near-black "on surface" ink (Figma 3063:35618,
   * 3063:35617). Distinct from `surface-accent`, which titles in the secondary
   * green, and from `surface`, whose body is the muted grey.
   */
  "surface-primary": {
    section: "surface",
    heading: "text-primary",
    body: "text-on-surface",
    button: "primary",
  },
  /** The 24/7 band: brand-secondary plate, white heading (Figma 3049:5244). */
  secondary: {
    section: "secondary",
    heading: "text-white",
    body: "text-tertiary-100",
    button: "onImageSolid",
  },
  primary: {
    section: "primary",
    heading: "text-white",
    body: "text-primary-50",
    button: "onPrimary",
  },
  tertiary: {
    section: "tertiary",
    heading: "text-white",
    body: "text-tertiary-100",
    button: "onImageSolid",
  },
} as const satisfies Record<
  FeatureBandTone,
  {
    section: "surface" | "primary" | "secondary" | "tertiary";
    heading: string;
    body: string;
    button: "primary" | "secondary" | "onPrimary" | "onImageSolid";
  }
>;

/**
 * A page band pairing one piece of media with a heading, a paragraph and an
 * optional call to action.
 *
 * The home page repeats it three times, each with a button (Figma 3020:3539,
 * 3022:3574, 3024:3608); the DTRACKER page repeats it five times without one
 * (3049:5210, 3049:5238, 3049:5244, 3049:35466, 3049:35465).
 *
 * Copy comes before the media in the DOM so a heading always introduces its own
 * image; `mediaFirst` only reorders them visually.
 */
export function FeatureBand({
  heading,
  body,
  cta,
  image,
  mobileImage,
  mediaClassName,
  sizes,
  mobileSizes,
  tone = "surface",
  copyClassName = "lg:w-165",
  gapClassName = "lg:gap-25",
  mediaFirst = false,
  ctaAlign = "start",
  mediaAlign = "center",
  mediaSide = "start",
  typeScale = "base",
  headingId,
  className,
  ...props
}: FeatureBandProps) {
  const styles = tones[tone];
  const bottomAligned = mediaAlign === "bottom";

  return (
    <Section
      tone={styles.section}
      spacing="md"
      aria-labelledby={headingId}
      className={cn(bottomAligned && "pb-0 lg:pb-0", className)}
      {...props}
    >
      <Container
        className={cn(
          "flex flex-col gap-8 lg:flex-row lg:justify-center",
          bottomAligned ? "lg:items-end" : "lg:items-center",
          gapClassName,
        )}
      >
        <div
          className={cn(
            "flex flex-col items-start",
            typeScale === "lg" ? "gap-3 lg:gap-5" : "gap-2.5 lg:gap-5",
            mediaSide === "start" ? "lg:order-last" : "lg:order-first",
            // The row is bottom-aligned for the media's sake; the copy opts out
            // and stays centred, which is how every frame draws it.
            bottomAligned && "lg:self-center lg:pb-24",
            copyClassName,
          )}
        >
          {/*
            Desktop is 36/20 everywhere. Phones run 24/16 -- the sizes the
            mobile home frames carry (Figma 3070:36918, 3143:286, 3070:36940) --
            except where `typeScale="lg"` asks for the DTRACKER mobile frames'
            30/18. The Platform page has no mobile frames of its own and
            inherits the 24/16 default.
          */}
          <h2
            id={headingId}
            className={cn(
              "font-display font-semibold lg:text-4xl",
              typeScale === "lg" ? "text-3xl" : "text-2xl",
              styles.heading,
            )}
          >
            {heading}
          </h2>
          <p
            className={cn(
              "lg:text-xl",
              typeScale === "lg" ? "text-lg" : "text-base",
              styles.body,
            )}
          >
            {body}
          </p>
          {cta ? (
            <Button
              href={cta.href}
              variant={styles.button}
              shape="square"
              className={cn(
                "px-3",
                ctaAlign === "end" && "self-end lg:self-start",
              )}
            >
              {cta.label}
            </Button>
          ) : null}
        </div>

        <div
          className={cn(
            "shrink-0",
            mediaFirst && "order-first",
            mediaSide === "start" ? "lg:order-first" : "lg:order-last",
            // `block` on the image kills the inline-baseline gap that would
            // otherwise leave a sliver of band under a bottom-aligned mockup.
            mediaClassName,
          )}
        >
          {mobileImage ? (
            <SiteImage
              image={mobileImage}
              sizes={mobileSizes}
              className="block h-auto w-full lg:hidden"
            />
          ) : null}
          <SiteImage
            image={image}
            sizes={sizes}
            className={cn(
              "h-auto w-full",
              mobileImage ? "hidden lg:block" : "block",
            )}
          />
        </div>
      </Container>
    </Section>
  );
}
