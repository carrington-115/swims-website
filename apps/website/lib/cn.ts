import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge cannot tell `text-menu` (a font size) from `text-on-surface`
 * (a colour) on its own -- both are `text-<name>` -- so it treated the size as
 * a colour and let the colour win. Every custom `text-*` token has to be
 * declared here, or the two silently cancel each other out.
 *
 * Sizes and colours both come from `@theme` in `app/globals.css`; when you add
 * a `--text-*` or a `--color-*` that is used with the `text-` utility, add it
 * to the matching list below.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["menu", "menu-lg"] }],
      "text-color": [{ text: ["ink", "ink-strong", "ink-muted", "on-surface"] }],
    },
  },
});

/**
 * Join conditional class names and let later Tailwind classes win over earlier
 * conflicting ones. Every component that accepts a `className` prop must merge
 * it through `cn` so callers can override styling.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
