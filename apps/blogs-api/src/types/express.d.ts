/**
 * API-only Express augmentation. Kept out of the shared schemas package on
 * purpose: re-exporting it would drag Express's types into the Next apps.
 */
export {};

/**
 * The parts of the Supabase user a write needs. `requireAuth` puts the whole
 * thing on the request, not just the id, because the byline on a blog is
 * derived from the account rather than sent by the client.
 */
export type AuthedUser = {
  id: string;
  email: string | null;
  /** Supabase `user_metadata` -- whatever the sign-up flow or provider set. */
  metadata: Record<string, unknown>;
};

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: AuthedUser;
    }
    interface Locals {
      // Validated/coerced query params. Express 5 defines req.query as a
      // getter-only accessor, so parsed values cannot be written back onto the
      // request and are carried here instead.
      validatedQuery?: unknown;
    }
  }
}
