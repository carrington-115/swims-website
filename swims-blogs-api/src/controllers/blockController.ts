import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as Block from '../models/Block';
import * as Section from '../models/Section';
import * as TableOfContents from '../models/TableOfContents';
import { generateSlug } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';
import type {
  ApiResponse,
  BlockResponse,
  PaginatedResponse,
  Block as BlockEntity,
  Section as SectionEntity,
  TableOfContents as TocEntity,
} from '../types';

// Exported so the routes validate against exactly these schemas. The routes
// previously declared their own near-copies; the list schema in particular
// lacked the limit cap, so limit=5000 passed route validation and then failed
// the controller's own parse.
export const createBlockSchema = z.object({
  title: z.string().min(1),
  timeToRead: z.number().int().positive(),
  author: z.string().min(1),
  profileImage: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  slug: z.string().optional(),
});

export const updateBlockSchema = z.object({
  title: z.string().min(1).optional(),
  timeToRead: z.number().int().positive().optional(),
  author: z.string().min(1).optional(),
  profileImage: z.string().optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
});

export const listBlocksSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().nonnegative().default(0),
});

const sectionImageSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const createSectionSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  images: z.array(sectionImageSchema).optional(),
  imageOnly: z.string().url().optional(),
  orderIndex: z.number().int().nonnegative().optional(),
});

export const updateSectionSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  images: z.array(sectionImageSchema).optional(),
  imageOnly: z.string().url().optional(),
  orderIndex: z.number().int().nonnegative().optional(),
});

type IdParams = { id: string };
type SlugParams = { slug: string };
type SectionParams = { id: string; sectionId: string };

function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data, error: null, timestamp: new Date().toISOString() };
}

/** Loads a block and asserts the caller owns it. */
async function requireOwnedBlock(id: string, userId: string | undefined): Promise<BlockEntity> {
  if (!userId) throw new AppError(401, 'Unauthorized');

  const block = await Block.findById(id);
  if (!block) throw new AppError(404, 'Block not found');
  if (block.userId !== userId) throw new AppError(403, 'You do not own this block');

  return block;
}

export async function listBlocks(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit, offset } = listBlocksSchema.parse(req.query);
    const { rows, total } = await Block.findPublished({ limit, offset });

    const payload: PaginatedResponse<BlockEntity> = { data: rows, total, limit, offset };
    res.json(ok(payload));
  } catch (err) {
    next(err);
  }
}

export async function getBlockById(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const block = await Block.findById(id);
    if (!block) throw new AppError(404, 'Block not found');

    const [sections, toc] = await Promise.all([
      Section.findByBlockId(id),
      TableOfContents.findByBlockId(id),
    ]);

    const payload: BlockResponse = { ...block, sections, tableOfContents: toc };
    res.json(ok(payload));
  } catch (err) {
    next(err);
  }
}

export async function getBlockBySlug(req: Request<SlugParams>, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;

    const block = await Block.findBySlug(slug);
    if (!block) throw new AppError(404, 'Block not found');

    const [sections, toc] = await Promise.all([
      Section.findByBlockId(block.id),
      TableOfContents.findByBlockId(block.id),
    ]);

    const payload: BlockResponse = { ...block, sections, tableOfContents: toc };
    res.json(ok(payload));
  } catch (err) {
    next(err);
  }
}

export async function getBlockSections(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const block = await Block.findById(id);
    if (!block) throw new AppError(404, 'Block not found');

    const sections: SectionEntity[] = await Section.findByBlockId(id);
    res.json(ok(sections));
  } catch (err) {
    next(err);
  }
}

export async function getBlockToc(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const block = await Block.findById(id);
    if (!block) throw new AppError(404, 'Block not found');

    const toc: TocEntity | null = await TableOfContents.findByBlockId(id);
    res.json(ok(toc));
  } catch (err) {
    next(err);
  }
}

export async function createBlock(req: Request, res: Response, next: NextFunction) {
  try {
    const body = createBlockSchema.parse(req.body);
    const userId = req.userId;

    if (!userId) throw new AppError(401, 'Unauthorized');

    const baseSlug = body.slug || generateSlug(body.title);
    let slug = baseSlug;

    // Bounded: the original `while` loop could spin forever against a failing
    // database. A slug taken between this check and the insert now surfaces as
    // a 409 via the unique-violation mapping in errorHandler.
    for (let counter = 1; counter <= 50 && (await Block.slugExists(slug)); counter++) {
      slug = `${baseSlug}-${counter}`;
    }

    const block = await Block.create({ ...body, slug, userId });
    res.status(201).json(ok(block));
  } catch (err) {
    next(err);
  }
}

export async function updateBlock(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const body = updateBlockSchema.parse(req.body);

    const block = await requireOwnedBlock(id, req.userId);

    if (body.slug && body.slug !== block.slug) {
      if (await Block.slugExists(body.slug)) throw new AppError(409, 'Slug already taken');
    }

    const updated = await Block.update(id, body);
    res.json(ok(updated));
  } catch (err) {
    next(err);
  }
}

export async function deleteBlock(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await requireOwnedBlock(id, req.userId);
    await Block.remove(id);

    res.json(ok(null));
  } catch (err) {
    next(err);
  }
}

export async function createSection(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const body = createSectionSchema.parse(req.body);

    await requireOwnedBlock(id, req.userId);

    const orderIndex = body.orderIndex ?? (await Section.getNextOrderIndex(id));

    const section = await Section.create({ ...body, blockId: id, orderIndex });
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

    await requireOwnedBlock(id, req.userId);

    const section = await Section.findById(sectionId);
    if (!section || section.blockId !== id) throw new AppError(404, 'Section not found');

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

    await requireOwnedBlock(id, req.userId);

    const section = await Section.findById(sectionId);
    if (!section || section.blockId !== id) throw new AppError(404, 'Section not found');

    await Section.remove(sectionId);
    res.json(ok(null));
  } catch (err) {
    next(err);
  }
}

export async function generateBlockToc(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await requireOwnedBlock(id, req.userId);

    const sections = await Section.findByBlockId(id);
    const items = sections.map(s => ({
      id: randomUUID(),
      title: s.title,
      sectionId: s.id,
      level: 1,
    }));

    const toc = await TableOfContents.upsertForBlock(id, items);
    res.json(ok(toc));
  } catch (err) {
    next(err);
  }
}
