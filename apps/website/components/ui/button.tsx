import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

/**
 * Reference implementation of the component standard in docs/COMPONENTS.md:
 * variants declared with `cva`, tokens only (no raw hex), `className` merged
 * through `cn`, no "use client" because it holds no state.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-fg hover:bg-primary-600",
        secondary: "bg-secondary text-secondary-fg hover:bg-secondary-600",
        outline:
          "border border-primary text-primary hover:bg-primary-50 hover:text-primary-600",
        ghost: "text-ink hover:bg-surface-muted",
        onImage: "bg-white/10 text-white backdrop-blur hover:bg-white/20",
        /** Opaque white plate for copy sitting on photography or brand colour. */
        onImageSolid:
          "bg-white text-ink-strong hover:bg-tertiary-50 focus-visible:outline-white",
        /**
         * White plate that keeps the brand green in its label -- the button on
         * a `tone="primary"` band, where `onImageSolid`'s near-black ink reads
         * as a hole in the colour (Figma 3020:3540).
         */
        onPrimary:
          "bg-white text-primary hover:bg-primary-50 focus-visible:outline-white",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-13 px-8 text-lg",
      },
      /** Corner treatment. The hero and other Figma plates are square. */
      shape: {
        pill: "rounded-pill",
        square: "rounded-none",
      },
    },
    defaultVariants: { variant: "primary", size: "md", shape: "pill" },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

type ButtonProps = ButtonVariants &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type ButtonLinkProps = ButtonVariants &
  Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & { href: string };

/** Renders a `<button>`, or a `next/link` anchor when `href` is given. */
export function Button(props: ButtonProps | ButtonLinkProps) {
  if (props.href !== undefined) {
    const { href, variant, size, shape, className, ...rest } = props;
    return (
      <Link
        href={href}
        className={cn(buttonVariants({ variant, size, shape }), className)}
        {...rest}
      />
    );
  }

  const { variant, size, shape, className, type = "button", ...rest } = props;
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...rest}
    />
  );
}
