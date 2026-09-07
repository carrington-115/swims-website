import type { ComponentPropsWithoutRef } from "react";

import type { SiteImage as SiteImageAsset } from "@/assets/images";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { LogoWall } from "@/components/ui/logo-wall";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

type BackedByCta = {
  label: string;
  href: string;
  /** `primary` is the filled plate, `outline` the bordered one beside it. */
  variant?: "primary" | "outline";
};

type BackedByProps = ComponentPropsWithoutRef<"section"> & {
  logos: readonly SiteImageAsset[];
  heading?: string;
  /** Standfirst under the heading. Pass `null` for a heading-only band. */
  body?: string | null;
  /** Buttons under the wall, in order. */
  ctas?: readonly BackedByCta[];
  /**
   * Layout for the wall itself -- see `LogoWall`. The band scrolls its marks by
   * default; the Partners page, where the marks are the section rather than a
   * credential in passing, asks for the still grid instead.
   */
  logoLayout?: "marquee" | "grid";
};

const defaultCtas = [
  { label: "Become a partner", href: "/partners#become-a-partner" },
  { label: "See all our partners", href: "/partners", variant: "outline" },
] as const satisfies readonly BackedByCta[];

/**
 * Partner and investor strip (Figma 3040:4791 desktop, 3076:37341 mobile;
 * 3065:35757 on Partners): a centred heading, the logo wall, and the partner
 * calls to action.
 *
 * The desktop frame titles this "Join our team", which contradicts its own body
 * copy and buttons; the phone frame's "Backed by" is the one that matches, so
 * that is the default here.
 *
 * Everything it draws is a prop, so the Partners page reuses it for its own
 * heading-only wall of nine marks and its single button.
 */
export function BackedBy({
  logos,
  heading = "Backed by",
  body = "Customers and partners trusting SWIMS as a to transform the smart waste management industry in Africa",
  ctas = defaultCtas,
  logoLayout = "marquee",
  className,
  ...props
}: BackedByProps) {
  return (
    <Section
      spacing="md"
      aria-labelledby="backed-by-heading"
      className={cn(className)}
      {...props}
    >
      <Container className="flex flex-col items-center gap-4.5">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <SectionHeading id="backed-by-heading" className="font-semibold">
            {heading}
          </SectionHeading>
          {body ? (
            <p className="max-w-177 text-xs text-ink-muted lg:text-xl">{body}</p>
          ) : null}
        </div>

        <LogoWall logos={logos} layout={logoLayout} />

        <div className="flex flex-wrap items-start justify-center gap-4.5">
          {ctas.map((cta) => (
            <Button
              key={cta.href}
              href={cta.href}
              variant={cta.variant ?? "primary"}
              shape="square"
              className={cn("px-3", cta.variant === "outline" && "bg-white")}
            >
              {cta.label}
            </Button>
          ))}
        </div>
      </Container>
    </Section>
  );
}
