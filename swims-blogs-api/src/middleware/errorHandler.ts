import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ApiResponse } from '../types';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/** PostgREST/Postgres errors carry a SQLSTATE in `code`. */
function isPostgrestError(err: unknown): err is { code: string; message: string; details?: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as { code: unknown }).code === 'string'
  );
}

function normalize(err: Error): { appError: AppError; unexpected: boolean } {
  if (err instanceof AppError) return { appError: err, unexpected: false };

  // Controllers re-parse req.body/req.query with their own schemas, so a raw
  // ZodError can reach here. Without this it surfaced as a 500 instead of 400.
  if (err instanceof ZodError) {
    const message = err.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    return { appError: new AppError(400, `Validation error: ${message}`), unexpected: false };
  }

  if (isPostgrestError(err)) {
    switch (err.code) {
      case '23505': // unique_violation
        return { appError: new AppError(409, 'Resource already exists'), unexpected: false };
      case '23503': // foreign_key_violation
        return { appError: new AppError(409, 'Referenced resource does not exist'), unexpected: false };
      case '23514': // check_violation
        return { appError: new AppError(400, 'Value violates a database constraint'), unexpected: false };
      case 'PGRST116': // no rows returned by .single()
        return { appError: new AppError(404, 'Not found'), unexpected: false };
    }
  }

  return { appError: new AppError(500, 'Internal server error'), unexpected: true };
}

// Express identifies error middleware by arity, so all four params must stay.
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const { appError, unexpected } = normalize(err);

  // Previously unexpected errors were discarded entirely, leaving no trace of
  // database or programming failures anywhere.
  if (unexpected) {
    console.error('[error]', err);
  }

  const response: ApiResponse<null> = {
    success: false,
    data: null,
    error: appError.message,
    timestamp: new Date().toISOString(),
  };

  res.status(appError.statusCode).json(response);
}
