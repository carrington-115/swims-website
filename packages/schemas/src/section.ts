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

export const createSectionSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  images: z.array(sectionImageSchema).optional(),
  imageOnly: z.string().url().optional(),
  orderIndex: z.number().int().nonnegative().optional(),
});

export const updateSectionSchema = createSectionSchema.partial();

export type CreateSectionRequest = z.infer<typeof createSectionSchema>;
export type UpdateSectionRequest = z.infer<typeof updateSectionSchema>;
