import type { Request, Response, NextFunction } from 'express';
import { getSupabaseAuth } from '../config/supabase';
import { AppError } from './errorHandler';

/**
 * Verifies the bearer token and puts the Supabase user on the request.
 *
 * The whole user, not just the id: the byline on a blog is derived from the
 * account that wrote it, so `Author.upsertFromUser` needs the email and the
 * `user_metadata` too. `req.userId` stays for the ownership checks.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Missing or malformed Authorization header');
    }

    const token = authHeader.slice(7);
    const { data, error } = await getSupabaseAuth().auth.getUser(token);

    if (error || !data.user) {
      throw new AppError(401, 'Invalid or expired token');
    }

    req.userId = data.user.id;
    req.user = {
      id: data.user.id,
      email: data.user.email ?? null,
      metadata: (data.user.user_metadata ?? {}) as Record<string, unknown>,
    };

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Resolves a bearer token if one is present and continues either way.
 *
 * The read routes are public, but "public" is not the same as "anonymous": a
 * draft is readable by its own author, and without this the author's own token
 * would be ignored on a GET and their unpublished post would 404 at them.
 * An invalid token is treated as no token rather than as an error, so a stale
 * session in a browser still sees the published site.
 */
export async function attachUser(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();

  try {
    const { data } = await getSupabaseAuth().auth.getUser(authHeader.slice(7));

    if (data.user) {
      req.userId = data.user.id;
      req.user = {
        id: data.user.id,
        email: data.user.email ?? null,
        metadata: (data.user.user_metadata ?? {}) as Record<string, unknown>,
      };
    }
  } catch {
    // Unreachable for a bad token -- getUser reports that in `error` -- but a
    // network failure to Supabase should not take down a public read.
  }

  next();
}
