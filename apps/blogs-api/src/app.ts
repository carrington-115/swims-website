import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import type { Express, Request, Response, NextFunction } from 'express';
import blogsRouter from './routes/blogs';
import { errorHandler } from './middleware/errorHandler';
import { getCorsOrigins, isServerless } from './env';
import type { ApiResponse } from './types';

/**
 * The Express wiring, and nothing else.
 *
 * Binding a port lives in `server.ts`, because this same app has to serve two
 * hosts that disagree about who owns the socket: a long-running Node process,
 * which listens, and a Vercel function (`api/index.ts`), which is *given* the
 * request and must never listen. Calling `listen()` here would make the
 * serverless entry hang a cold start on a port nothing will ever connect to.
 *
 * Nothing here throws. `createApp()` runs during a cold start, where a throw is
 * an opaque crash rather than a response -- see the note in `env.ts` for how
 * the Supabase credentials are deferred to first use inside a request instead.
 */
export function createApp(): Express {
  const app = express();

  /*
   * An allowlist, not a single origin: the website and the dashboard are
   * separate origins and both talk to this API, so `FRONTEND_ORIGIN` could
   * never admit both. `CORS_ORIGINS` is the comma-separated form -- and the
   * variable turbo.json already declares.
   */
  const allowedOrigins = getCorsOrigins();

  /*
   * Behind Vercel's proxy every request arrives from the same handful of edge
   * addresses, so without this the rate limiter below buckets the whole
   * internet together and `req.ip` names the proxy. `1` -- trust exactly one
   * hop -- rather than `true`: express-rate-limit refuses a blanket `true`
   * (ERR_ERL_PERMISSIVE_TRUST_PROXY) because it lets a caller spoof its own
   * key by sending an X-Forwarded-For header.
   */
  if (isServerless()) {
    app.set('trust proxy', 1);
  }

  // CORS is registered before the body parsers so that a rejected preflight or
  // a malformed-JSON error response still carries the CORS headers the browser
  // needs in order to surface the real status to the caller.
  app.use(
    cors({
      origin(origin, callback) {
        // No Origin header at all is a same-origin or non-browser caller (curl,
        // a server component, the health check) -- nothing for CORS to police.
        if (!origin || allowedOrigins.some(pattern => originMatches(pattern, origin))) {
          return callback(null, true);
        }
        callback(new Error(`Origin ${origin} is not allowed by CORS_ORIGINS`));
      },
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`,
      );
    });
    next();
  });

  // Health check. Deliberately does not touch Supabase, so it answers even when
  // the database credentials are wrong -- which is the case it has to report.
  app.get('/health', (_req: Request, res: Response) => {
    const response: ApiResponse<{ status: string }> = {
      success: true,
      data: { status: 'ok' },
      error: null,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  });

  // Routes
  app.use('/api', blogsRouter);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: 'Not found',
      timestamp: new Date().toISOString(),
    };
    res.status(404).json(response);
  });

  // Error handler
  app.use(errorHandler);

  return app;
}

/**
 * Exact match, unless the entry carries a `*`.
 *
 * The wildcard stands for exactly one label and never for a dot, so
 * `https://*.vercel.app` admits `https://swims-git-main.vercel.app` and
 * refuses both `https://a.b.vercel.app` and `https://vercel.app.attacker.com`
 * -- the two ways a sloppier suffix match gets abused. See `getCorsOrigins`
 * for why this belongs in the Preview environment only.
 */
function originMatches(pattern: string, origin: string): boolean {
  const star = pattern.indexOf('*');
  if (star === -1) return pattern === origin;

  const prefix = pattern.slice(0, star);
  const suffix = pattern.slice(star + 1);

  // One wildcard only. A second would need a rule for how to split what is
  // between them, and no allowlist entry has ever needed it.
  if (suffix.includes('*')) return false;

  if (origin.length <= prefix.length + suffix.length) return false;
  if (!origin.startsWith(prefix) || !origin.endsWith(suffix)) return false;

  const label = origin.slice(prefix.length, origin.length - suffix.length);
  return !label.includes('.') && !label.includes('/');
}
