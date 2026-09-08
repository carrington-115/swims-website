import { z, ZodError } from 'zod';
import type { ZodType } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

function toAppError(err: unknown): unknown {
  if (err instanceof ZodError) {
    // zod v4 renamed ZodError.errors -> ZodError.issues.
    const message = err.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    return new AppError(400, `Validation error: ${message}`);
  }
  return err;
}

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(toAppError(err));
    }
  };
}

export function validateQuery<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Assigning to req.query throws "Cannot set property query of
      // #<IncomingMessage> which has only a getter" on Express 5, so the parsed
      // result is exposed via res.locals instead.
      res.locals.validatedQuery = schema.parse(req.query);
      next();
    } catch (err) {
      next(toAppError(err));
    }
  };
}

export function validateParams<T>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Route params are validated, not replaced: Express re-populates
      // req.params per layer, so a reassignment here would not survive anyway.
      schema.parse(req.params);
      next();
    } catch (err) {
      next(toAppError(err));
    }
  };
}

export function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    // Punctuation-only or edge-punctuated titles would otherwise yield slugs
    // like "-hello-" or "".
    .replace(/^-+|-+$/g, '');

  return slug || 'untitled';
}

export { z };
