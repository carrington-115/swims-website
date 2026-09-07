import { images } from "@/assets/images";
import { Section } from "@/components/layout/section";
import { SiteImage } from "@/components/media/site-image";
import { heroFrame } from "@/components/sections/hero/hero-frame";
import { AppStoreButtons } from "@/components/ui/app-store-buttons";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@/components/ui/icons";

/**
 * The DTRACKER page hero (Figma 3046:5156 desktop, 3076:37769 mobile, both
 * named `dtracker-app-frame`).
 *
 * The two frames are not the same panel, which is why so much here is
 * breakpoint-specific rather than one layout that reflows:
 *
 * | | desktop 3046:5156 | mobile 3076:37769 |
 * | --- | --- | --- |
 * | headline | Join the workforce serving 100+ homes and Businesses | Transform Waste Management with Ease |
 * | call to action | both store buttons | one "Download the app" button |
 * | artwork | the four-phone cluster, bottom-right | one handset, tilted into the top-right |
 *
 * The mobile frame is the home carousel's DTRACKER slide (3070:36701) with its
 * slide pickers taken away and the copy dropped 20px into the space they leave,
 * so the handset is placed exactly as `hero-backdrop.tsx` places it there.
 *
 * Flat brand-secondary green -- no photograph, so no scrim -- and the frame's
 * `overflow-hidden` crops whichever artwork is showing. `max-h-full` stops the
 * desktop cluster climbing over the copy on a short, wide window, where half
 * the width is taller than the hero itself.
 *
 * Measurements are each frame's own, read as proportions of it. Desktop
 * (1440x763): copy on the 60px gutter, 640px wide, its baseline 103px off the
 * bottom; wordmark 60px; headline 40/52; body 24px. Mobile (390x763): copy on
 * the 16px gutter, 82px off the bottom, 20px between its three parts; wordmark
 * 45px; headline 30px; body 16px, white rather than the desktop grey.
 */
export function DtrackerHero() {
  return (
    <Section spacing="none" aria-labelledby="dtracker-hero-heading">
      {/* No `Container`: `heroFrame` runs the full width of the viewport, and
       * the copy takes the page gutter directly so it keeps the frame's own
       * proportions instead of stopping at the 1440px content shell. */}
      <div className={`${heroFrame} bg-secondary`}>
        {/* The tilted handset, on phones. Centred on a point outside the frame
         * so it bleeds off the top and the right edge, which is what leaves
         * only the corner of the screen showing. */}
        <SiteImage
          image={images.dtracker.heroPhone}
          alt=""
          priority
          sizes="(min-width: 1024px) 0px, 325px"
          className="absolute top-62.5 left-[113.7%] w-81.25 max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-[32.47deg] lg:hidden"
        />

        <SiteImage
          image={images.home.phonesHero}
          alt=""
          priority
          sizes="(min-width: 1024px) 50vw, 0px"
          className="absolute right-0 bottom-0 hidden h-auto max-h-full w-1/2 max-w-none lg:block"
        />

        <div className="flex size-full flex-col items-start justify-end gap-5 px-gutter pb-20.5 lg:gap-7.5 lg:px-15 lg:pb-27">
          <SiteImage
            image={images.brand.dtrackerLogo}
            alt="DTRACKER"
            priority
            className="h-11.25 w-auto lg:h-15"
          />

          <div className="flex max-w-160 flex-col gap-5 lg:gap-12.5">
            <div className="flex flex-col">
              <h1
                id="dtracker-hero-heading"
                className="text-3xl leading-normal font-semibold text-white lg:text-[2.5rem] lg:leading-13"
              >
                <span className="lg:hidden">
                  Transform Waste Management with Ease
                </span>
                <span className="hidden lg:inline">
                  Join the workforce serving 100+ homes and Businesses
                </span>
              </h1>
              <p className="text-base text-white lg:text-2xl lg:text-tertiary-100">
                Empowering communities to manage waste and recycle smarter.
              </p>
            </div>

            {/* The mobile frame collapses the two store buttons into one that
             * takes the visitor down to the band carrying both. */}
            <Button
              href="#download-dtracker-heading"
              variant="onImageSolid"
              shape="square"
              size="lg"
              className="gap-3 px-3 text-xl text-secondary lg:hidden"
            >
              <DownloadIcon className="size-6" />
              Download the app
            </Button>

            <AppStoreButtons className="hidden lg:flex lg:w-auto" />
          </div>
        </div>
      </div>
    </Section>
  );
}
