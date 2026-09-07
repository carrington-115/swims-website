import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import type { SiteImage as SiteImageAsset } from "@/assets/images";
import { SiteImage } from "@/components/media/site-image";
import { cn } from "@/lib/cn";

/** One person as a card needs them. */
export type Person = {
  id: string;
  name: string;
  role: string;
  portrait: SiteImageAsset;
  /**
   * Where the card leads. Set on the People page, where a card opens the
   * member's profile (Figma 3138:251); left off wherever the roster is just a
   * roster, as on Why Us.
   */
  href?: string;
};

type PersonCardProps = Omit<ComponentPropsWithoutRef<"figure">, "id"> & {
  person: Person;
  sizes?: string;
};

/**
 * Portrait with a name and a role (Figma 3033:4751).
 *
 * The Figma cards each crop their portrait slightly differently; this uses one
 * aspect for all of them so a row of people lines up on both edges.
 *
 * When the person carries an `href` the whole card is clickable, but only the
 * name is a link: `figcaption` has to stay a direct child of `figure`, so the
 * link stretches over the card with a pseudo-element instead of wrapping it.
 * That keeps one link per card, named by the person, rather than a second
 * anonymous one around the portrait.
 */
export function PersonCard({
  person,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  className,
  ...props
}: PersonCardProps) {
  return (
    <figure
      className={cn("relative flex flex-col gap-2.5", className)}
      {...props}
    >
      <div className="relative aspect-[840/898] w-full overflow-hidden">
        <SiteImage image={person.portrait} cover sizes={sizes} />
      </div>
      <figcaption className="flex flex-col">
        <span className="font-display text-sm font-semibold text-ink lg:text-2xl">
          {person.href ? (
            <Link
              href={person.href}
              className="rounded-card transition-colors after:absolute after:inset-0 after:content-[''] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {person.name}
            </Link>
          ) : (
            person.name
          )}
        </span>
        <span className="text-xs text-ink-muted lg:text-xl">{person.role}</span>
      </figcaption>
    </figure>
  );
}
