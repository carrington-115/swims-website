import type { ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

/**
 * Text field (Figma 1:40865). A flat white plate with square corners, 59px
 * tall, 16px text and a `--color-outline` placeholder -- the same control the
 * newsletter, the contact form and search all use.
 *
 * `tone` says which background the field sits on, so the focus ring stays
 * visible: `onDark` rings in white, the default rings in brand green.
 */
export const inputVariants = cva(
  "block w-full bg-white px-3.5 py-4 text-base text-ink placeholder:text-outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      tone: {
        default: "focus-visible:outline-primary",
        onDark: "focus-visible:outline-white",
      },
      size: {
        md: "h-11",
        lg: "h-15",
      },
    },
    defaultVariants: { tone: "default", size: "lg" },
  },
);

type InputProps = Omit<ComponentPropsWithoutRef<"input">, "size"> &
  VariantProps<typeof inputVariants>;

export function Input({ tone, size, className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(inputVariants({ tone, size }), className)}
      {...props}
    />
  );
}
