import { z } from "zod";

export const sectionImageSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  caption: z.string().optional(),
});

export type SectionImage = z.infer<typeof sectionImageSchema>;

export const sectionSchema = z.object({
  id: z.string().uuid(),
  blogId: z.string().uuid(),
  title: z.string(),
  content: z.string().nullable(),
  images: z.array(sectionImageSchema).nullable(),
  imageOnly: z.string().nullable(),
  orderIndex: z.number().int(),
  createdAt: z.string(),
});

export type Section = z.infer<typeof sectionSchema>;

/**
 * `strict` so a typo in a field name is a 400 rather than a value that silently
 * never lands. Same reasoning on every write schema in this package.
 */
export const createSectionSchema = z
  .object({
    title: z.string().min(1),
    content: z.string().optional(),
    images: z.array(sectionImageSchema).optional(),
    imageOnly: z.string().url().optional(),
    /** Omit to append. Ignored when the section arrives nested in a blog. */
    orderIndex: z.number().int().nonnegative().optional(),
  })
  .strict();

export const updateSectionSchema = createSectionSchema.partial();

export type CreateSectionRequest = z.infer<typeof createSectionSchema>;
export type UpdateSectionRequest = z.infer<typeof updateSectionSchema>;

/**
 * A whole new order for a blog's sections, as the complete list of its section
 * ids. Reordering one section at a time through `updateSection` cannot work:
 * `order_index` is unique per blog, so the first of any two swapped writes
 * collides with the row it is trying to trade places with.
 */
export const reorderSectionsSchema = z
  .object({
    sectionIds: z.array(z.string().uuid()).min(1),
  })
  .strict();

export type ReorderSectionsRequest = z.infer<typeof reorderSectionsSchema>;
