import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import blogsRouter from './routes/blogs';
import { errorHandler } from './middleware/errorHandler';
import type { ApiResponse } from './types';

const app = express();
const port = Number(process.env.PORT) || 3000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

// CORS is registered before the body parsers so that a rejected preflight or a
// malformed-JSON error response still carries the CORS headers the browser
// needs in order to surface the real status to the caller.
app.use(
  cors({
    origin: frontendOrigin,
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

// Health check
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

export const server = app.listen(port, () => {
  console.log(`Blogs API listening on port ${port}`);
});

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    console.log(`${signal} received, shutting down`);
    server.close(() => process.exit(0));
  });
}

export default app;
