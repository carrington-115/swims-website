"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

type TableOfContentsProps = {
  /** In document order; `id` is the anchor on the matching section. */
  items: readonly { id: string; title: string }[];
  className?: string;
};

/**
 * How far below the top of the viewport a section has to cross before it counts
 * as the one being read. The sticky header is 78px, so this sits just under it
 * -- a section is "current" from the moment its heading clears the header.
 */
const ACTIVE_LINE = 96;

/**
 * The table of contents (Figma 3070:36266), with the entry for the section the
 * reader is in marked by a green rule and darker, heavier type.
 *
 * The only client component on the page, and the only reason there is one: the
 * active entry has to follow the scroll position. It reads positions rather
 * than using an `IntersectionObserver` because the question is not "is this
 * section on screen" -- several always are -- but "which heading was the last
 * to pass under the header", which is a comparison, not a threshold. Positions
 * are only measured inside a `requestAnimationFrame`, so a scroll never does
 * layout work more than once a frame.
 */
export function TableOfContents({ items, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    let frame = 0;

    const measure = () => {
      frame = 0;

      // The last heading to have passed the line is the one being read. Before
      // any has, the first entry stays lit rather than none of them.
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top > ACTIVE_LINE) break;
        current = section;
      }

      // A short last section can never reach the line, so once the page is
      // scrolled to the end it always wins.
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      setActiveId(atEnd ? sections[sections.length - 1].id : current.id);
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-labelledby="toc-heading"
      className={cn("flex flex-col gap-1.25", className)}
    >
      <h2 id="toc-heading" className="font-display text-xl text-ink-strong">
        TABLE OF CONTENTS
      </h2>

      <ul className="flex flex-col">
        {items.map(({ id, title }) => {
          const active = id === activeId;

          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active ? "true" : undefined}
                /*
                 * The transparent rule on the inactive entries reserves the
                 * 2px the active one paints, so the list does not twitch
                 * sideways every time the current section changes.
                 */
                className={cn(
                  "block truncate border-l-2 px-2.5 py-1.25 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  active
                    ? "border-primary font-medium text-ink-strong"
                    : "border-transparent text-outline hover:text-ink",
                )}
              >
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
