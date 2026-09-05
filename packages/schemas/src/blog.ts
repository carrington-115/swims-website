import { z } from "zod";

/**
 * The blog entity as the API returns it (camelCase). Rows come out of
 * Postgres in snake_case; the API's models do the mapping, so this is the
 * shape both frontends actually see.
 */
export const blogSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  dateCreated: z.string(),
  timeToRead: z.number().int(),
  author: z.string(),
  profileImage: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string().uuid(),
});

export type Blog = z.infer<typeof blogSchema>;

export const createBlogSchema = z.object({
  title: z.string().min(1),
  timeToRead: z.number().int().positive(),
  author: z.string().min(1),
  profileImage: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  slug: z.string().optional(),
});

/**
 * Every create field, optional, with the same inner constraints -- which is
 * exactly what the API's hand-written update schema spelled out field by field.
 */
export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogRequest = z.infer<typeof createBlogSchema>;
export type UpdateBlogRequest = z.infer<typeof updateBlogSchema>;

export const listBlogsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type ListBlogsQuery = z.infer<typeof listBlogsQuerySchema>;
