import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import * as controller from '../controllers/blockController';
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
router.get('/blocks', validateQuery(controller.listBlocksSchema), controller.listBlocks);
router.get('/blocks/slug/:slug', validateParams(slugParamSchema), controller.getBlockBySlug);
router.get('/blocks/:id', validateParams(idParamSchema), controller.getBlockById);
router.get('/blocks/:id/sections', validateParams(idParamSchema), controller.getBlockSections);
router.get(
  '/blocks/:id/table-of-contents',
  validateParams(idParamSchema),
  controller.getBlockToc,
);

// Authenticated
router.post(
  '/blocks',
  limiter,
  requireAuth,
  validateBody(controller.createBlockSchema),
  controller.createBlock,
);

router.put(
  '/blocks/:id',
  limiter,
  requireAuth,
  validateParams(idParamSchema),
  validateBody(controller.updateBlockSchema),
  controller.updateBlock,
);

router.delete(
  '/blocks/:id',
  limiter,
  requireAuth,
  validateParams(idParamSchema),
  controller.deleteBlock,
);

router.post(
  '/blocks/:id/sections',
  limiter,
  requireAuth,
  validateParams(idParamSchema),
  validateBody(controller.createSectionSchema),
  controller.createSection,
);

router.put(
  '/blocks/:id/sections/:sectionId',
  limiter,
  requireAuth,
  validateParams(sectionIdParamSchema),
  validateBody(controller.updateSectionSchema),
  controller.updateSection,
);

router.delete(
  '/blocks/:id/sections/:sectionId',
  limiter,
  requireAuth,
  validateParams(sectionIdParamSchema),
  controller.deleteSection,
);

router.post(
  '/blocks/:id/table-of-contents',
  limiter,
  requireAuth,
  validateParams(idParamSchema),
  controller.generateBlockToc,
);

export default router;
