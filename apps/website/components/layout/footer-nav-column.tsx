import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import type { NavGroup } from "@/lib/navigation";
import { cn } from "@/lib/cn";

type FooterNavColumnProps = ComponentPropsWithoutRef<"div"> & {
  group: NavGroup;
};

/**
 * One titled column of footer links (Figma 3025:4648).
 *
 * A `<nav>` with its heading as the accessible name, so a screen reader can
 * tell "Products" from "Quick links" when skipping between landmarks.
 */
export function FooterNavColumn({
  group,
  className,
  ...props
}: FooterNavColumnProps) {
  const headingId = `footer-${group.title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <nav aria-labelledby={headingId} className={cn(className)} {...props}>
      <h2
        id={headingId}
        className="font-display text-xl font-medium text-ink-strong"
      >
        {group.title}
      </h2>
      <ul className="mt-px flex flex-col gap-px">
        {group.links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="rounded-sm text-lg text-ink-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
