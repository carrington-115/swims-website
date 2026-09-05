import { z } from "zod";

export const tableOfContentsItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  sectionId: z.string().uuid(),
  level: z.number().int(),
});

export type TableOfContentsItem = z.infer<typeof tableOfContentsItemSchema>;

export const tableOfContentsSchema = z.object({
  id: z.string().uuid(),
  blogId: z.string().uuid(),
  items: z.array(tableOfContentsItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TableOfContents = z.infer<typeof tableOfContentsSchema>;
