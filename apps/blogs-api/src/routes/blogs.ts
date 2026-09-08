import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  createBlogSchema,
  createSectionSchema,
  idParamSchema,
  listBlogsQuerySchema,
  listMyBlogsQuerySchema,
  reorderSectionsSchema,
  sectionIdParamSchema,
  slugParamSchema,
  updateBlogSchema,
  updateSectionSchema,
} from '@swims/schemas';
import * as controller from '../controllers/blogController';
import { attachUser, requireAuth } from '../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../utils/validators';

const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

/*
 * Schemas come from @swims/schemas so a route validates against exactly what
 * the controller parses and what both frontends type themselves from. These
 * were previously re-declared here, and the copies had already drifted.
 */

// Public reads. On the detail routes `attachUser` is not `requireAuth`: it
// resolves a token when one is sent, so an author sees their own drafts, and
// lets anonymous callers through to the published set.
//
// The listing does not take it, because it is published-only whoever asks and
// resolving a token would be a round trip to Supabase that changes nothing.
router.get('/blogs', validateQuery(listBlogsQuerySchema), controller.listBlogs);
router.get(
  '/blogs/mine',
  requireAuth,
  validateQuery(listMyBlogsQuerySchema),
  controller.listMyBlogs,
);
router.get(
  '/blogs/slug/:slug',
  attachUser,
  validateParams(slugParamSchema),
  controller.getBlogBySlug,
);
router.get('/blogs/:id', attachUser, validateParams(idParamSchema), controller.getBlogById);
router.get(
  '/blogs/:id/sections',
  attachUser,
  validateParams(idParamSchema),
  controller.getBlogSections,
);
router.get(
  '/blogs/:id/table-of-contents',
  attachUser,
  validateParams(idParamSchema),
  controller.getBlogToc,
);

// Authenticated
router.post(
  '/blogs',
  limiter,
  requireAuth,
  validateBody(createBlogSchema),
  controller.createBlog,
);

router.put(
  '/blogs/:id',
  limiter,
  requireAuth,
  validateParams(idParamSchema),
  validateBody(updateBlogSchema),
  controller.updateBlog,
);

router.delete(
  '/blogs/:id',
  limiter,
  requireAuth,
  validateParams(idParamSchema),
  controller.deleteBlog,
);

// Before `/blogs/:id/sections/:sectionId`, or "order" would be matched as a
// section id and rejected by the uuid check.
router.put(
  '/blogs/:id/sections/order',
  limiter,
  requireAuth,
  validateParams(idParamSchema),
  validateBody(reorderSectionsSchema),
  controller.reorderSections,
);

router.post(
  '/blogs/:id/sections',
  limiter,
  requireAuth,
  validateParams(idParamSchema),
  validateBody(createSectionSchema),
  controller.createSection,
);

router.put(
  '/blogs/:id/sections/:sectionId',
  limiter,
  requireAuth,
  validateParams(sectionIdParamSchema),
  validateBody(updateSectionSchema),
  controller.updateSection,
);

router.delete(
  '/blogs/:id/sections/:sectionId',
  limiter,
  requireAuth,
  validateParams(sectionIdParamSchema),
  controller.deleteSection,
);

// There is no POST /blogs/:id/table-of-contents. The contents are derived from
// the sections on read, so there is nothing to generate and nothing that can
// fall out of step with the headings it lists.

export default router;
