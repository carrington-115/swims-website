import { z } from "zod";
import { blogSchema } from "./blog";
import { sectionSchema } from "./section";
import { tableOfContentsSchema } from "./toc";

/** A blog with its sections and table of contents, as returned by the detail routes. */
export const blogResponseSchema = blogSchema.extend({
  sections: z.array(sectionSchema),
  tableOfContents: tableOfContentsSchema.nullable(),
});

export type BlogResponse = z.infer<typeof blogResponseSchema>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

/** Every Blogs API route returns this envelope, including errors. */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
}

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: z.array(item),
    total: z.number().int(),
    limit: z.number().int(),
    offset: z.number().int(),
  });

export const apiResponseSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    success: z.boolean(),
    data: data.nullable(),
    error: z.string().nullable(),
    timestamp: z.string(),
  });
