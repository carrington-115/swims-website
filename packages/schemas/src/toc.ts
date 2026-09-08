import { z } from "zod";

/**
 * One entry in a blog's table of contents.
 *
 * There is no stored table behind this: the contents are a projection of the
 * blog's sections, built on read by `buildToc` in the API. A section and its
 * entry therefore cannot drift -- renaming a heading renames the entry, and
 * deleting a section removes it, with nothing to keep in step by hand.
 *
 * `sectionId` is the identity (one entry per section, always). `anchor` is the
 * slug the page links to and the reader's scroll spy watches, unique within a
 * post even when two sections share a heading.
 */
export const tableOfContentsItemSchema = z.object({
  sectionId: z.string().uuid(),
  title: z.string(),
  anchor: z.string(),
  level: z.number().int(),
});

export type TableOfContentsItem = z.infer<typeof tableOfContentsItemSchema>;

/** A whole table of contents: the blog's sections, in order. */
export const tableOfContentsSchema = z.array(tableOfContentsItemSchema);

export type TableOfContents = z.infer<typeof tableOfContentsSchema>;
