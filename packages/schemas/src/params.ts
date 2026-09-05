import { z } from "zod";

export const idParamSchema = z.object({ id: z.string().uuid() });
export const slugParamSchema = z.object({ slug: z.string().min(1) });
export const sectionIdParamSchema = z.object({
  id: z.string().uuid(),
  sectionId: z.string().uuid(),
});
