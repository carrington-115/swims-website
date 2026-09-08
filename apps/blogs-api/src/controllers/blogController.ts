import type { Request, Response, NextFunction } from 'express';
import {
  createBlogSchema,
  createSectionSchema,
  listBlogsQuerySchema,
  listMyBlogsQuerySchema,
  reorderSectionsSchema,
  updateBlogSchema,
  updateSectionSchema,
} from '@swims/schemas';
import * as Author from '../models/Author';
import * as Blog from '../models/Blog';
import * as Section from '../models/Section';
import { generateSlug } from '../utils/validators';
import { buildToc } from '../utils/toc';
import { AppError } from '../middleware/errorHandler';
import type {
  ApiResponse,
  BlogResponse,
  PaginatedResponse,
  Blog as BlogEntity,
  Section as SectionEntity,
  TableOfContentsItem,
} from '../types';

type IdParams = { id: string };
type SlugParams = { slug: string };
type SectionParams = { id: string; sectionId: string };

function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data, error: null, timestamp: new Date().toISOString() };
}

/** Loads a blog and asserts the caller owns it. */
async function requireOwnedBlog(id: string, userId: string | undefined): Promise<BlogEntity> {
  if (!userId) throw new AppError(401, 'Unauthorized');

  const blog = await Blog.findById(id);
  if (!blog) throw new AppError(404, 'Blog not found');
  if (blog.userId !== userId) throw new AppError(403, 'You do not own this blog');

  return blog;
}

/**
 * A draft is readable only by its author. Public reads are otherwise
 * unauthenticated, so an unowned draft has to look like it does not exist
 * rather than like something being withheld.
 */
function assertReadable(blog: BlogEntity, userId: string | undefined) {
  if (blog.status !== 'published' && blog.userId !== userId) {
    throw new AppError(404, 'Blog not found');
  }
}

/** Assembles the detail payload: the blog, its sections, and the derived contents. */
async function withSections(blog: BlogEntity): Promise<BlogResponse> {
  const sections = await Section.findByBlogId(blog.id);
  return { ...blog, sections, tableOfContents: buildToc(sections) };
}

/**
 * Resolves a free slug. Bounded: the original `while` loop could spin forever
 * against a failing database. A slug taken between this check and the insert
 * surfaces as a 409 via the unique-violation mapping in errorHandler.
 */
async function resolveSlug(requested: string | undefined, title: string): Promise<string> {
  const baseSlug = requested || generateSlug(title);
  let slug = baseSlug;

  for (let counter = 1; counter <= 50 && (await Blog.slugExists(slug)); counter++) {
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

export async function listBlogs(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit, offset, category, q } = listBlogsQuerySchema.parse(req.query);

    // Published only, and not negotiable from the query string: this route is
    // unauthenticated, so a `?status=draft` on it would hand every unfinished
    // post to anyone who asked. Drafts are reachable through /blogs/mine.
    const { rows, total } = await Blog.findMany({
      limit,
      offset,
      category,
      q,
      status: 'published',
    });

    const payload: PaginatedResponse<BlogEntity> = { data: rows, total, limit, offset };
    res.json(ok(payload));
  } catch (err) {
    next(err);
  }
}

/** The caller's own blogs, drafts included. */
export async function listMyBlogs(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    if (!userId) throw new AppError(401, 'Unauthorized');

    const { limit, offset, category, q, status } = listMyBlogsQuerySchema.parse(req.query);
    const { rows, total } = await Blog.findMany({
      limit,
      offset,
      category,
      q,
      status,
      userId,
    });

    const payload: PaginatedResponse<BlogEntity> = { data: rows, total, limit, offset };
    res.json(ok(payload));
  } catch (err) {
    next(err);
  }
}

export async function getBlogById(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) throw new AppError(404, 'Blog not found');
    assertReadable(blog, req.userId);

    res.json(ok(await withSections(blog)));
  } catch (err) {
    next(err);
  }
}

export async function getBlogBySlug(req: Request<SlugParams>, res: Response, next: NextFunction) {
  try {
    const blog = await Blog.findBySlug(req.params.slug);
    if (!blog) throw new AppError(404, 'Blog not found');
    assertReadable(blog, req.userId);

    res.json(ok(await withSections(blog)));
  } catch (err) {
    next(err);
  }
}

export async function getBlogSections(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) throw new AppError(404, 'Blog not found');
    assertReadable(blog, req.userId);

    const sections: SectionEntity[] = await Section.findByBlogId(blog.id);
    res.json(ok(sections));
  } catch (err) {
    next(err);
  }
}

/**
 * The table of contents, derived from the sections on the way out. There is no
 * stored copy to fetch and none to keep in step; the entries are whatever the
 * sections currently are.
 */
export async function getBlogToc(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) throw new AppError(404, 'Blog not found');
    assertReadable(blog, req.userId);

    const sections = await Section.findByBlogId(blog.id);
    const toc: TableOfContentsItem[] = buildToc(sections);
    res.json(ok(toc));
  } catch (err) {
    next(err);
  }
}

/**
 * Creates a blog and, optionally, all of its sections in one request.
 *
 * The byline is not taken from the body -- it is the account on the access
 * token, written through `Author.upsertFromUser`. That upsert also has to
 * happen before the insert, because `blogs.user_id` is a foreign key onto the
 * author row.
 */
export async function createBlog(req: Request, res: Response, next: NextFunction) {
  try {
    const body = createBlogSchema.parse(req.body);
    const user = req.user;

    if (!user) throw new AppError(401, 'Unauthorized');

    await Author.upsertFromUser(user);

    const slug = await resolveSlug(body.slug, body.title);
    const id = await Blog.createWithSections({
      ...body,
      // `name` is an internal label the frame carried separately from the
      // title. Defaulted rather than demanded, so a caller need not send the
      // same string twice.
      name: body.name ?? body.title,
      slug,
      userId: user.id,
    });

    const blog = await Blog.findById(id);
    if (!blog) throw new AppError(500, 'Blog was created but could not be read back');

    res.status(201).json(ok(await withSections(blog)));
  } catch (err) {
    next(err);
  }
}

export async function updateBlog(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const body = updateBlogSchema.parse(req.body);

    const blog = await requireOwnedBlog(id, req.userId);

    if (body.slug && body.slug !== blog.slug) {
      if (await Blog.slugExists(body.slug)) throw new AppError(409, 'Slug already taken');
    }

    const updated = await Blog.update(id, body, blog);
    res.json(ok(updated));
  } catch (err) {
    next(err);
  }
}

export async function deleteBlog(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await requireOwnedBlog(id, req.userId);
    await Blog.remove(id);

    res.json(ok(null));
  } catch (err) {
    next(err);
  }
}

export async function createSection(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const body = createSectionSchema.parse(req.body);

    await requireOwnedBlog(id, req.userId);

    const orderIndex = body.orderIndex ?? (await Section.getNextOrderIndex(id));

    const section = await Section.create({ ...body, blogId: id, orderIndex });
    res.status(201).json(ok(section));
  } catch (err) {
    next(err);
  }
}

export async function updateSection(
  req: Request<SectionParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id, sectionId } = req.params;
    const body = updateSectionSchema.parse(req.body);

    await requireOwnedBlog(id, req.userId);

    const section = await Section.findById(sectionId);
    if (!section || section.blogId !== id) throw new AppError(404, 'Section not found');

    const updated = await Section.update(sectionId, body);
    res.json(ok(updated));
  } catch (err) {
    next(err);
  }
}

export async function deleteSection(
  req: Request<SectionParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id, sectionId } = req.params;

    await requireOwnedBlog(id, req.userId);

    const section = await Section.findById(sectionId);
    if (!section || section.blogId !== id) throw new AppError(404, 'Section not found');

    await Section.remove(sectionId);
    res.json(ok(null));
  } catch (err) {
    next(err);
  }
}

/**
 * Reorders a blog's sections from the complete list of its section ids, and
 * returns them in their new order along with the contents that follow from it.
 */
export async function reorderSections(
  req: Request<IdParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { sectionIds } = reorderSectionsSchema.parse(req.body);

    await requireOwnedBlog(id, req.userId);

    if (new Set(sectionIds).size !== sectionIds.length) {
      throw new AppError(400, 'sectionIds contains duplicates');
    }

    await Section.reorder(id, sectionIds);

    const sections = await Section.findByBlogId(id);
    res.json(ok({ sections, tableOfContents: buildToc(sections) }));
  } catch (err) {
    next(err);
  }
}
