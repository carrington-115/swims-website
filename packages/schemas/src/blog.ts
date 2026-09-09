import { z } from "zod";
import { authorSchema } from "./author";
import { blogCategorySchema } from "./category";
import { createSectionSchema } from "./section";

/**
 * A blog is a draft until it is published. Only published blogs are reachable
 * through the public list; a draft is visible to its own author, through the
 * authenticated routes.
 */
export const blogStatusSchema = z.enum(["draft", "published"]);

export type BlogStatus = z.infer<typeof blogStatusSchema>;

/**
 * The blog entity as the API returns it (camelCase). Rows come out of
 * Postgres in snake_case; the API's models do the mapping, so this is the
 * shape both frontends actually see.
 *
 * `author` is an object joined from the `authors` table, not a string the
 * client sent -- see `authorSchema`.
 */
export const blogSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  dateCreated: z.string(),
  timeToRead: z.number().int(),
  author: authorSchema,
  name: z.string(),
  description: z.string().nullable(),
  category: blogCategorySchema.nullable(),
  coverImage: z.string().nullable(),
  status: blogStatusSchema,
  publishedAt: z.string().nullable(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string().uuid(),
});

export type Blog = z.infer<typeof blogSchema>;

/**
 * One request creates the whole post: the blog and every section under it, in a
 * single transaction. Sending the blog and then each section separately left a
 * half-written post behind whenever one of the calls failed.
 *
 * There is deliberately no `author` or `profileImage` field. `strict` means
 * sending one is a 400 rather than a value quietly ignored, which is the honest
 * answer to a client trying to choose its own byline.
 */
export const createBlogSchema = z
  .object({
    title: z.string().min(1),
    timeToRead: z.number().int().positive(),
    /** Internal label. Defaults to `title`. */
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    /** One of `BLOG_CATEGORY_IDS`; omit for an uncategorised post. */
    category: blogCategorySchema.optional(),
    coverImage: z.string().url().optional(),
    /** Defaults to `draft`; publishing stamps `publishedAt`. */
    status: blogStatusSchema.optional(),
    /** Omit to derive from the title, de-duplicated with a numeric suffix. */
    slug: z.string().optional(),
    sections: z.array(createSectionSchema).optional(),
  })
  .strict();

/**
 * Every create field except the nested sections, optional, with the same inner
 * constraints. Sections are managed through their own routes once the blog
 * exists, so that a partial update cannot be read as "replace them all".
 *
 * `category` is the one field widened here: null clears it, which an editor
 * needs in order to take a post back out of a category. Omitting the field
 * still leaves whatever is stored alone -- the two are different requests.
 */
export const updateBlogSchema = createBlogSchema
  .omit({ sections: true })
  .partial()
  .extend({ category: blogCategorySchema.nullable().optional() });

export type CreateBlogRequest = z.infer<typeof createBlogSchema>;
export type UpdateBlogRequest = z.infer<typeof updateBlogSchema>;

/**
 * The public listing. It has no `status`: it only ever returns published
 * blogs, because the route is unauthenticated and a `?status=draft` on it would
 * hand every unfinished post to anyone who asked.
 *
 * `?category=` is checked against the known set rather than passed through as
 * free text, so a category that does not exist is a 400 naming the ones that
 * do, instead of an empty page that looks like a listing with nothing in it.
 */
export const listBlogsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().nonnegative().default(0),
  category: blogCategorySchema.optional(),
  /** Free-text match over the title and description. */
  q: z.string().min(1).optional(),
});

export type ListBlogsQuery = z.infer<typeof listBlogsQuerySchema>;

/** The author's own listing, which is where drafts are reachable. */
export const listMyBlogsQuerySchema = listBlogsQuerySchema.extend({
  /** Omit for every status. */
  status: blogStatusSchema.optional(),
});

export type ListMyBlogsQuery = z.infer<typeof listMyBlogsQuerySchema>;
