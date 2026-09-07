import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  /** Background treatment. Keep to these five so pages stay rhythmic. */
  tone?: "surface" | "muted" | "primary" | "secondary" | "tertiary";
  /** Vertical rhythm. `none` when the section paints its own spacing. */
  spacing?: "none" | "sm" | "md" | "lg";
};

const tones = {
  surface: "bg-surface text-ink",
  muted: "bg-surface-muted text-ink",
  primary: "bg-primary text-primary-fg",
  secondary: "bg-secondary text-secondary-fg",
  tertiary: "bg-tertiary text-tertiary-fg",
} as const;

const spacings = {
  none: "",
  sm: "py-10 lg:py-14",
  md: "py-16 lg:py-24",
  lg: "py-24 lg:py-32",
} as const;

/**
 * Vertical band of a page. Page sections in `components/sections/` render one
 * of these as their root so spacing and background tones stay consistent.
 */
export function Section({
  tone = "surface",
  spacing = "md",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(tones[tone], spacings[spacing], className)}
      {...props}
    />
  );
}
