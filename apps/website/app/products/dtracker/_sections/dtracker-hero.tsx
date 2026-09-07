import { images } from "@/assets/images";
import { Section } from "@/components/layout/section";
import { SiteImage } from "@/components/media/site-image";
import { heroFrame } from "@/components/sections/hero/hero-frame";
import { AppStoreButtons } from "@/components/ui/app-store-buttons";

/**
 * The DTRACKER page hero (Figma 3046:5156, `dtracker-app-frame`).
 *
 * Not the home carousel's DTRACKER slide: the product page has its own frame,
 * with a different headline, the full wordmark rather than the small one, and
 * both store buttons in place of the single download link.
 *
 * Flat brand-secondary green -- no photograph, so no scrim. The phone cluster
 * is the frame's only artwork and sits flush in the bottom-right corner at just
 * under half the width, running off the bottom edge; the frame's
 * `overflow-hidden` crops it. `max-h-full` stops it climbing over the copy on a
 * short, wide window, where half the width is taller than the hero itself.
 *
 * Measurements are the 1440x763 frame's, read as proportions of it: copy on the
 * 60px gutter, 640px wide, sitting low rather than centred (its baseline is
 * 103px off the bottom); wordmark 60px; headline 40/52; body 24px.
 *
 * Below `lg` the cluster is hidden -- four phones at half width are unreadable
 * on a phone, and Figma draws no mobile frame for this hero.
 */
export function DtrackerHero() {
  return (
    <Section spacing="none" aria-labelledby="dtracker-hero-heading">
      {/* No `Container`: `heroFrame` runs the full width of the viewport, and
       * the copy takes the page gutter directly so it keeps the frame's own
       * proportions instead of stopping at the 1440px content shell. */}
      <div className={`${heroFrame} bg-secondary`}>
        <SiteImage
          image={images.home.phonesHero}
          alt=""
          priority
          sizes="(min-width: 1024px) 50vw, 0px"
          className="absolute right-0 bottom-0 hidden h-auto max-h-full w-1/2 max-w-none lg:block"
        />

        <div className="flex size-full flex-col items-start justify-end gap-7.5 px-gutter pb-25 lg:px-15 lg:pb-27">
          <SiteImage
            image={images.brand.dtrackerLogo}
            alt="DTRACKER"
            priority
            className="h-10 w-auto lg:h-15"
          />

          <div className="flex max-w-160 flex-col gap-12.5">
            <div className="flex flex-col">
              <h1
                id="dtracker-hero-heading"
                className="text-3xl leading-tight font-semibold text-white lg:text-[2.5rem] lg:leading-13"
              >
                Join the workforce serving 100+ homes and Businesses
              </h1>
              <p className="text-base text-tertiary-100 lg:text-2xl">
                Empowering communities to manage waste and recycle smarter.
              </p>
            </div>

            <AppStoreButtons className="lg:w-auto" />
          </div>
        </div>
      </div>
    </Section>
  );
}
