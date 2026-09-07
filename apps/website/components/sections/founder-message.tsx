import type { ComponentPropsWithoutRef } from "react";

import type { SiteImage as SiteImageAsset } from "@/assets/images";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SiteImage } from "@/components/media/site-image";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

type FounderMessageProps = ComponentPropsWithoutRef<"section"> & {
  heading?: string;
  /** One string per paragraph, in order. */
  paragraphs: readonly string[];
  portrait: SiteImageAsset;
  name: string;
  role: string;
};

/**
 * The founder's letter (Figma 3033:4737 desktop, 3076:37301 mobile): a long
 * piece of prose with a portrait and credit beside it.
 *
 * The portrait drops below the letter on phones. `id` is fixed so the hero
 * button can jump here.
 */
export function FounderMessage({
  heading = "A Message from the Founder",
  paragraphs,
  portrait,
  name,
  role,
  className,
  ...props
}: FounderMessageProps) {
  return (
    <Section
      id="founder-message"
      spacing="md"
      aria-labelledby="founder-message-heading"
      className={cn("scroll-mt-header lg:scroll-mt-header-lg", className)}
      {...props}
    >
      <Container className="flex flex-col items-start gap-5 lg:flex-row lg:justify-between lg:gap-10">
        <div className="flex flex-col gap-2.5 lg:w-231">
          <SectionHeading
            id="founder-message-heading"
            align="start"
            className="font-medium"
          >
            {heading}
          </SectionHeading>
          <div className="flex flex-col gap-5 text-base text-ink-muted lg:text-xl">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>

        <figure className="flex w-full shrink-0 flex-col gap-3 lg:w-89">
          <div className="relative aspect-[840/898] w-full overflow-hidden">
            <SiteImage
              image={portrait}
              cover
              sizes="(min-width: 1024px) 356px, 100vw"
            />
          </div>
          <figcaption className="flex flex-col text-lg text-ink-muted">
            <span>{name}</span>
            <span>{role}</span>
          </figcaption>
        </figure>
      </Container>
    </Section>
  );
}
