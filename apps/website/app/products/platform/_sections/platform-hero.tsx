import { images } from "@/assets/images";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SiteImage } from "@/components/media/site-image";
import { Button } from "@/components/ui/button";
import { PhoneIncomingIcon } from "@/components/ui/icons";

/**
 * SWIMS Platform hero (Figma 3049:35583).
 *
 * Not the site's photo hero: this page opens on a short dark plate with the
 * proposition on the left and the hardware on the right, so it does not use
 * `heroFrame` -- there is no photograph, no scrim and no 763px frame to fill.
 * It is the `FeatureBand` shape with the page's `h1` and a larger type scale,
 * which is why it lives here rather than being a fifth band tone.
 *
 * The artwork is one flat render that already contains both the sensor and the
 * monitor, which is how Figma composes it.
 */
export function PlatformHero() {
  return (
    <Section
      tone="tertiary"
      spacing="md"
      aria-labelledby="platform-hero-heading"
    >
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-center lg:gap-10">
        <div className="flex flex-col items-start gap-2.5 lg:w-140">
          <h1
            id="platform-hero-heading"
            className="font-display text-2xl font-semibold text-white lg:text-[2.5rem] lg:leading-13"
          >
            SWIMS Platform for Business Intelligence
          </h1>
          <p className="text-sm text-tertiary-100 lg:text-2xl">
            Empowering organisations and governments with data informed
            decisions to manage waste and recycle smarter.
          </p>
          <Button
            href="/contact?enquiry=platform"
            variant="onImageSolid"
            shape="square"
            className="gap-3 px-3"
          >
            <PhoneIncomingIcon className="size-6 shrink-0" />
            Request our services today
          </Button>
        </div>

        <SiteImage
          image={images.platform.monitor}
          className="h-auto w-full shrink-0 lg:w-164"
          sizes="(min-width: 1024px) 657px, 100vw"
          priority
        />
      </Container>
    </Section>
  );
}
