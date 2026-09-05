import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import * as controller from '../controllers/blogController';
import { requireAuth } from '../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../utils/validators';

const router = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const idParamSchema = z.object({ id: z.string().uuid() });
const slugParamSchema = z.object({ slug: z.string().min(1) });
const sectionIdParamSchema = z.object({ id: z.string().uuid(), sectionId: z.string().uuid() });

// Public
router.get('/blogs', validateQuery(controller.listBlogsSchema), controller.listBlogs);
router.get('/blogs/slug/:slug', validateParams(slugParamSchema), controller.getBlogBySlug);
router.get('/blogs/:id', validateParams(idParamSchema), controller.getBlogById);
router.get('/blogs/:id/sections', validateParams(idParamSchema), controller.getBlogSections);
router.get(
  '/blogs/:id/table-of-contents',
  validateParams(idParamSchema),
  controller.getBlogToc,
);

// Authenticated
router.post(
  '/blogs',
  limiter,
  requireAuth,
  validateBody(controller.createBlogSchema),
  controller.createBlog,
);

router.put(
  '/blogs/:id',
  limiter,
  requireAuth,
  validateParams(idParamSchema),
  validateBody(controller.updateBlogSchema),
  controller.updateBlog,
);

router.delete(
  '/blogs/:id',
  limiter,
  requireAuth,
  validateParams(idParamSchema),
  controller.deleteBlog,
);

router.post(
  '/blogs/:id/sections',
  limiter,
  requireAuth,
  validateParams(idParamSchema),
  validateBody(controller.createSectionSchema),
  controller.createSection,
);

router.put(
  '/blogs/:id/sections/:sectionId',
  limiter,
  requireAuth,
  validateParams(sectionIdParamSchema),
  validateBody(controller.updateSectionSchema),
  controller.updateSection,
);

router.delete(
  '/blogs/:id/sections/:sectionId',
  limiter,
  requireAuth,
  validateParams(sectionIdParamSchema),
  controller.deleteSection,
);

router.post(
  '/blogs/:id/table-of-contents',
  limiter,
  requireAuth,
  validateParams(idParamSchema),
  controller.generateBlogToc,
);

export default router;
