/**
 * Environment access, split by failure mode.
 *
 * Everything the Express app needs in order to *start* has a safe default and
 * never throws, because on Vercel `createApp()` runs during a cold start:
 * throwing there produces an opaque crash instead of a response. Only the
 * Supabase credentials throw, and only on first use inside a request, where
 * the error handler can turn them into a logged 500.
 *
 * These are functions rather than module constants so that dotenv has already
 * run by the time they read process.env.
 */
import { z } from 'zod';

const DEFAULT_PORT = 3002;
const DEFAULT_CORS_ORIGINS = 'http://localhost:3000,http://localhost:3001';

export function getPort(): number {
  const parsed = Number(process.env.PORT);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PORT;
}

/**
 * Comma-separated allowlist. The website and the dashboard are separate
 * origins, so a single FRONTEND_ORIGIN string could never admit both.
 */
export function getCorsOrigins(): string[] {
  return (process.env.CORS_ORIGINS ?? DEFAULT_CORS_ORIGINS)
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

const supabaseEnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type SupabaseEnv = z.infer<typeof supabaseEnvSchema>;

let cached: SupabaseEnv | null = null;

export function getSupabaseEnv(): SupabaseEnv {
  if (cached) return cached;

  const parsed = supabaseEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map(issue => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `Blogs API is missing required Supabase configuration:\n${details}\n\n` +
        'Copy apps/blogs-api/.env.example to apps/blogs-api/.env and fill it in.',
    );
  }

  cached = parsed.data;
  return cached;
}
