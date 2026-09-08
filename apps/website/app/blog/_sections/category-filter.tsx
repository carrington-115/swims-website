"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { CheckIcon, TuneIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

import type { BlogCategory } from "../_content";

type CategoryFilterProps = {
  categories: readonly BlogCategory[];
  /** The category currently filtered on; unset is "All". */
  activeCategory?: string;
  /** Carried into every option's href so a category change keeps the search. */
  query?: string;
  className?: string;
};

/**
 * The filter glyph at the trailing end of the blog search field, and the
 * category menu it opens.
 *
 * This exists for the phone layout: from `lg` up the frame lists the categories
 * in the rail beside the grid, so there the glyph is decorative and the rail
 * does the filtering. Below `lg` the rail is gone and the categories live here.
 *
 * The options stay `Link`s -- filtering is a URL, as it is in the rail -- so a
 * pick is a normal navigation and the filtered listing is still shareable. The
 * menu closes on Escape, on a click outside it, and on the route change a pick
 * causes.
 */
export function CategoryFilter({
  categories,
  activeCategory,
  query,
  className,
}: CategoryFilterProps) {
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const options = [{ id: undefined, label: "All" }, ...categories];
  const selected = options.find(({ id }) => id === activeCategory) ?? options[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Filter posts by category. Showing ${selected.label}`}
        className="flex size-6 items-center justify-center rounded-sm text-on-surface transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <TuneIcon className="size-6" />
      </button>

      {open ? (
        <nav
          id={menuId}
          aria-label="Filter posts by category"
          // Right-aligned under the glyph, and wide enough for the longest
          // label without stretching the field it hangs off.
          className="absolute top-[calc(100%+0.75rem)] right-0 z-20 min-w-48 rounded-card border border-outline bg-surface p-1.5 shadow-card"
        >
          <ul className="flex flex-col">
            {options.map(({ id, label }) => {
              const active = id === activeCategory;

              return (
                <li key={id ?? "all"}>
                  <Link
                    href={{
                      pathname: "/blog",
                      query: {
                        ...(id ? { category: id } : {}),
                        ...(query ? { q: query } : {}),
                      },
                    }}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between gap-2.5 rounded-sm px-3 py-2 text-base hover:bg-tertiary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      active
                        ? "font-medium text-on-surface"
                        : "text-ink hover:text-on-surface",
                    )}
                  >
                    {label}
                    {active ? (
                      <CheckIcon className="size-5 shrink-0 text-primary" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
