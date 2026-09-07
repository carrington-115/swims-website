import type { ComponentPropsWithoutRef } from "react";

import { images, type SiteImage as SiteImageAsset } from "@/assets/images";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SiteImage } from "@/components/media/site-image";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

type PartnersStripCta = {
  label: string;
  href: string;
  /** `primary` is the filled plate, `outline` the bordered one beside it. */
  variant?: "primary" | "outline";
};

type PartnersStripProps = ComponentPropsWithoutRef<"section"> & {
  heading?: string;
  body?: string;
  /** Marks to show, in order. Defaults to the five the Figma strip draws. */
  logos?: readonly SiteImageAsset[];
  ctas?: readonly PartnersStripCta[];
  /**
   * `id` given to the heading and pointed at by `aria-labelledby`. Only needs
   * overriding if a page renders the strip twice.
   */
  headingId?: string;
};

/** The marks the Figma strip draws, in its order (3022:3587). */
const defaultLogos = [
  images.partners.fi,
  images.partners.bv,
  images.partners.athenaVc,
  images.partners.microsoft,
  images.partners.ticSummit,
] as const;

const defaultCtas = [
  { label: "Become a partner", href: "/contact", variant: "primary" },
  { label: "See all our partners", href: "/partners", variant: "outline" },
] as const satisfies readonly PartnersStripCta[];

/**
 * "Backed by" band (Figma 3022:3598 desktop, 3070:36887 mobile): the heading, a
 * line of logos, and the two partner calls to action.
 *
 * Shared rather than page-local because the same strip appears under several
 * pages; everything it draws is a prop, so a page that wants a different set of
 * marks or a single button passes them in.
 *
 * The logo row scrolls sideways on phones -- the Figma frame lays the five marks
 * out well past the 390px frame -- and wraps into a centred row from `lg`.
 */
export function PartnersStrip({
  heading = "Backed by",
  body = "Customers and partners trusting SWIMS as a to transform the smart waste management industry in Africa",
  logos = defaultLogos,
  ctas = defaultCtas,
  headingId = "partners-heading",
  className,
  ...props
}: PartnersStripProps) {
  return (
    <Section
      spacing="sm"
      aria-labelledby={headingId}
      className={cn(className)}
      {...props}
    >
      <Container className="flex flex-col items-center gap-4.5">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <SectionHeading
            id={headingId}
            className="text-xl font-semibold lg:text-4xl"
          >
            {heading}
          </SectionHeading>
          <p className="max-w-177 text-xs text-ink-muted lg:text-xl">{body}</p>
        </div>

        {/*
         * `tabIndex` keeps the row operable by keyboard while it is a scroller
         * on phones; from `lg` it wraps and there is nothing left to scroll.
         */}
        <ul
          tabIndex={0}
          aria-label="Partner and investor logos"
          className="flex w-full items-center gap-10 overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:flex-wrap lg:justify-center lg:overflow-visible"
        >
          {logos.map((logo) => (
            <li key={logo.src.src} className="shrink-0">
              <SiteImage
                image={logo}
                className="h-10 w-auto object-contain opacity-60 lg:h-16"
              />
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-center gap-4.5">
          {ctas.map((cta) => (
            <Button
              key={cta.href}
              href={cta.href}
              variant={cta.variant ?? "primary"}
              shape="square"
              className="px-3 text-xs lg:text-base"
            >
              {cta.label}
            </Button>
          ))}
        </div>
      </Container>
    </Section>
  );
}
