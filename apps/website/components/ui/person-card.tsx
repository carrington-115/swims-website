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
 */
export function PersonCard({
  person,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  className,
  ...props
}: PersonCardProps) {
  return (
    <figure className={cn("flex flex-col gap-2.5", className)} {...props}>
      <div className="relative aspect-[840/898] w-full overflow-hidden">
        <SiteImage image={person.portrait} cover sizes={sizes} />
      </div>
      <figcaption className="flex flex-col">
        <span className="font-display text-sm font-semibold text-ink lg:text-2xl">
          {person.name}
        </span>
        <span className="text-xs text-ink-muted lg:text-xl">{person.role}</span>
      </figcaption>
    </figure>
  );
}
