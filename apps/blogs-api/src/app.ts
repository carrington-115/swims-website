import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import blogsRouter from './routes/blogs';
import { errorHandler } from './middleware/errorHandler';
import { getCorsOrigins, getPort, isProduction } from './env';
import type { ApiResponse } from './types';

const app = express();

/*
 * An allowlist, not a single origin: the website and the dashboard are separate
 * origins and both talk to this API, so `FRONTEND_ORIGIN` could never admit
 * both. `CORS_ORIGINS` is the comma-separated form -- and the variable
 * turbo.json already declares.
 */
const allowedOrigins = getCorsOrigins();

// CORS is registered before the body parsers so that a rejected preflight or a
// malformed-JSON error response still carries the CORS headers the browser
// needs in order to surface the real status to the caller.
app.use(
  cors({
    origin(origin, callback) {
      // No Origin header at all is a same-origin or non-browser caller (curl,
      // a server component, the health check) -- nothing for CORS to police.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
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

const port = getPort();

/*
 * Without this, a taken port surfaces as an unhandled EADDRINUSE stack trace
 * with no hint of which service is squatting on it -- which is exactly the
 * failure the fixed port map exists to make legible.
 */
let bindFailed = false;

function onListenError(error: NodeJS.ErrnoException) {
  bindFailed = true;

  if (error.code !== 'EADDRINUSE') throw error;

  console.error(
    [
      '',
      `Port ${port} is already in use, so the Blogs API did not start.`,
      '',
      'The monorepo pins one port per app: 3000 website, 3001 dashboard,',
      '3002 blogs-api. Something else is on this one. Find it with:',
      `  netstat -ano | findstr :${port}`,
      '',
    ].join('\n'),
  );
  process.exit(1);
}

export const server = app.listen(port);

// Registered before `listening` so a bind that fails immediately is handled
// whichever order the two events arrive in.
server.on('error', onListenError);

server.on('listening', () => {
  /*
   * Deferred by a tick, and skipped if the bind then fails.
   *
   * A dual-stack bind on Windows can emit `listening` for one family and
   * `error` for the other, which printed "listening on 3002" immediately above
   * "port 3002 is already in use" -- the two lines contradicting each other on
   * the one occasion the message matters. `onListenError` exits the process,
   * so when the bind really failed this callback never runs.
   */
  setImmediate(() => {
    if (bindFailed) return;

    console.log(
      `Blogs API listening on port ${port} (${isProduction() ? 'production' : 'development'})`,
    );
    console.log(`CORS origins: ${allowedOrigins.join(', ')}`);
  });
});

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    console.log(`${signal} received, shutting down`);
    server.close(() => process.exit(0));
  });
}

export default app;
