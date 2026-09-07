import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/cn";

type ContainerProps<T extends ElementType> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Horizontal page shell: max width plus the responsive gutter. Nothing else in
 * the site should hardcode page padding or a max width.
 */
export function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-content px-gutter lg:px-gutter-lg",
        className,
      )}
      {...props}
    />
  );
}
