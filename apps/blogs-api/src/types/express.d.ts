/**
 * API-only Express augmentation. Kept out of the shared schemas package on
 * purpose: re-exporting it would drag Express's types into the Next apps.
 */
export {};

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
    interface Locals {
      // Validated/coerced query params. Express 5 defines req.query as a
      // getter-only accessor, so parsed values cannot be written back onto the
      // request and are carried here instead.
      validatedQuery?: unknown;
    }
  }
}
