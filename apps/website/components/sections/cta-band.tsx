import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { cn } from "@/lib/cn";

type CtaBandTone = "surface" | "primary" | "secondary" | "tertiary";

type CtaBandProps = ComponentPropsWithoutRef<"section"> & {
  heading: string;
  body: string;
  /** The button, or buttons, under the copy. */
  action: ReactNode;
  tone?: CtaBandTone;
  headingId: string;
};

/**
 * Background treatment, paired the way the frames pair them: a plate, its
 * heading ink and its body ink change together.
 */
const tones = {
  surface: { section: "surface", heading: "text-on-surface", body: "text-ink" },
  primary: { section: "primary", heading: "text-white", body: "text-primary-50" },
  secondary: {
    section: "secondary",
    heading: "text-white",
    body: "text-tertiary-100",
  },
  tertiary: {
    section: "tertiary",
    heading: "text-white",
    body: "text-tertiary-100",
  },
} as const satisfies Record<
  CtaBandTone,
  { section: CtaBandTone; heading: string; body: string }
>;

/**
 * The band that closes a page's own content, before the shared blog and
 * newsletter bands: a centred heading, one paragraph, and the action.
 *
 * The SWIMS Platform page uses it for "Request our services today" (Figma
 * 3063:35631); the DTRACKER page draws the same shape for its store buttons and
 * could fold into this too.
 *
 * The action is a slot rather than a `cta` object because the pages genuinely
 * differ -- one wants a single button with an icon, another wants the pair of
 * store buttons.
 */
export function CtaBand({
  heading,
  body,
  action,
  tone = "surface",
  headingId,
  className,
  ...props
}: CtaBandProps) {
  const styles = tones[tone];

  return (
    <Section
      tone={styles.section}
      spacing="md"
      aria-labelledby={headingId}
      className={cn(className)}
      {...props}
    >
      <Container className="flex flex-col items-center gap-3 text-center">
        <h2
          id={headingId}
          className={cn(
            "font-display text-xl font-semibold lg:text-4xl",
            styles.heading,
          )}
        >
          {heading}
        </h2>
        <p className={cn("max-w-184 text-sm lg:text-xl", styles.body)}>{body}</p>
        {action}
      </Container>
    </Section>
  );
}
