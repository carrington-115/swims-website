import type { Request, Response, NextFunction } from 'express';
import { getSupabaseAuth } from '../config/supabase';
import { AppError } from './errorHandler';

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
    next();
  } catch (err) {
    next(err);
  }
}
