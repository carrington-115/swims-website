import { z } from "zod";

/**
 * The blog categories, in the order the marketing site's filter rail lists
 * them (Figma 3146:301).
 *
 * This is the single definition of the set. The API validates writes and the
 * `?category=` filter against it, the dashboard builds its picker from it, and
 * the website builds its filter rail from it -- so a category cannot exist on
 * one side of the wire and not the other. The list was previously written out
 * twice, once in the dashboard's form and once in the website's content file,
 * and the two were free to drift into a category no post could ever be found
 * under.
 *
 * An id is what `blogs.category` stores and what `?category=` carries, so it
 * is part of every published URL: renaming one orphans links and needs a
 * migration that rewrites the rows. A label is display text and can change
 * freely.
 */
export const BLOG_CATEGORY_IDS = [
  "company",
  "waste-management-in-africa",
  "global-waste-management",
  "technology-in-waste-management",
  "case-study",
] as const;

export const blogCategorySchema = z.enum(BLOG_CATEGORY_IDS);

/** The stored value: one of `BLOG_CATEGORY_IDS`. */
export type BlogCategoryId = z.infer<typeof blogCategorySchema>;

const BLOG_CATEGORY_LABELS: Record<BlogCategoryId, string> = {
  company: "Company",
  "waste-management-in-africa": "Waste management in Africa",
  "global-waste-management": "Global waste management",
  "technology-in-waste-management": "Technology in waste management",
  "case-study": "Case study",
};

/** One entry as the pickers and the filter rail render it. */
export type BlogCategory = { id: BlogCategoryId; label: string };

/**
 * Every category, in listing order. "All" is deliberately not one of them: it
 * is the absence of a filter, so it carries no id and no query parameter.
 */
export const BLOG_CATEGORIES: readonly BlogCategory[] = BLOG_CATEGORY_IDS.map(
  (id) => ({ id, label: BLOG_CATEGORY_LABELS[id] }),
);

export function isBlogCategory(value: unknown): value is BlogCategoryId {
  return (
    typeof value === "string" &&
    (BLOG_CATEGORY_IDS as readonly string[]).includes(value)
  );
}

/** The entry for an id, or `undefined` for anything not in the set. */
export function findBlogCategory(
  id: string | null | undefined,
): BlogCategory | undefined {
  return isBlogCategory(id)
    ? { id, label: BLOG_CATEGORY_LABELS[id] }
    : undefined;
}

/**
 * Display text for a stored value. Falls back to the raw value so a row
 * written before this set existed still renders as something rather than
 * disappearing from a listing.
 */
export function blogCategoryLabel(id: string): string {
  return isBlogCategory(id) ? BLOG_CATEGORY_LABELS[id] : id;
}
