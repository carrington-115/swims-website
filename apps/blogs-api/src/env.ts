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

/*
 * The monorepo's fixed port map. Every app pins its own port rather than
 * letting the dev server pick one, because these numbers are referenced by
 * things that cannot discover them at runtime: the CORS allowlist below, the
 * dashboard's BLOGS_API_URL, and Supabase's redirect allow-list.
 *
 *   3000  website     (apps/website)
 *   3001  dashboard   (apps/dashboard)
 *   3002  blogs-api   (this app)
 *
 * `next dev` without an explicit port silently takes the next free one, which
 * is how the website ended up on 3002 and collided with this service.
 */
const DEFAULT_PORT = 3002;
const DEFAULT_CORS_ORIGINS = 'http://localhost:3000,http://localhost:3001';

/**
 * `PORT` still wins, because a host that assigns one (Vercel, Render, Fly)
 * gives no choice. Locally it is unset and the port is always 3002.
 */
export function getPort(): number {
  const parsed = Number(process.env.PORT);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PORT;
}

/**
 * Comma-separated allowlist. The website and the dashboard are separate
 * origins, so a single FRONTEND_ORIGIN string could never admit both.
 *
 * In production this is the two real origins, written out:
 *
 *   CORS_ORIGINS=https://swims.example,https://dashboard.swims.example
 *
 * An entry may carry a `*` in one label -- `https://*.vercel.app` -- which is
 * there for Vercel **preview** deployments, whose hostname contains the commit
 * and so is different on every push. Set that in the Preview environment only:
 * in production it would admit every site anyone has ever deployed to Vercel.
 * The token check on writes is unaffected either way (a bearer token is not a
 * cookie, so a third-party page cannot borrow one), but the read surface is
 * not something to widen for no reason.
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

/**
 * True when the app is running as a function rather than as a process it owns.
 *
 * `VERCEL` is set by the platform in every environment it builds and runs --
 * production, preview and `vercel dev` alike -- so this is a question about the
 * host, not about the deployment being live. `app.ts` uses it to decide whether
 * there is a proxy in front whose forwarded address should be trusted.
 */
export function isServerless(): boolean {
  return Boolean(process.env.VERCEL);
}

/**
 * Supabase issues two keys, and has two generations of names for them.
 *
 * The current keys are `sb_publishable_…` and `sb_secret_…`. They replace the
 * legacy JWT keys, `anon` and `service_role`, which Supabase is phasing out --
 * a project created today has only the new pair. Both generations are accepted
 * here, and both work identically in `@supabase/supabase-js` (>=2.111), which
 * sends whichever it is given in the `apikey` header.
 *
 * The roles are unchanged whichever names you use:
 *
 * - **publishable** (was `anon`) -- safe to expose, bound by row level
 *   security. This API uses it for one thing: verifying caller JWTs.
 * - **secret** (was `service_role`) -- bypasses row level security. Server
 *   only. It must never reach a browser or a build artifact.
 */
const supabaseEnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SECRET_KEY: z.string().min(1),
});

export type SupabaseEnv = z.infer<typeof supabaseEnvSchema>;

/** Both spellings of each key, current name first. */
const KEY_ALIASES = {
  SUPABASE_PUBLISHABLE_KEY: ['SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_ANON_KEY'],
  SUPABASE_SECRET_KEY: ['SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
} as const;

let cached: SupabaseEnv | null = null;

function firstSet(names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

/**
 * Refuses a publishable key in the secret slot.
 *
 * Worth a hard failure rather than a warning: the whole API reads and writes
 * with the secret key on the assumption that it bypasses row level security.
 * Given a publishable key instead it would still connect, still authenticate,
 * and then quietly return nothing from every query -- the most expensive kind
 * of configuration mistake to debug.
 */
function assertNotPublishable(key: string): string | null {
  if (key.startsWith('sb_publishable_')) {
    return 'looks like a publishable key (sb_publishable_...), not a secret key';
  }

  // The legacy keys are JWTs whose payload names the role.
  const payload = key.split('.')[1];
  if (payload) {
    try {
      const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
      if (decoded?.role === 'anon') {
        return 'looks like a legacy anon key, not a service_role key';
      }
    } catch {
      // Not a JWT, or not one we can read. The startsWith check above is the
      // one that matters for current keys.
    }
  }

  return null;
}

export function getSupabaseEnv(): SupabaseEnv {
  if (cached) return cached;

  const resolved = {
    SUPABASE_URL: process.env.SUPABASE_URL?.trim(),
    SUPABASE_PUBLISHABLE_KEY: firstSet(KEY_ALIASES.SUPABASE_PUBLISHABLE_KEY),
    SUPABASE_SECRET_KEY: firstSet(KEY_ALIASES.SUPABASE_SECRET_KEY),
  };

  const parsed = supabaseEnvSchema.safeParse(resolved);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map(issue => {
        const name = String(issue.path[0]);
        const aliases = KEY_ALIASES[name as keyof typeof KEY_ALIASES];
        const spelling = aliases ? ` (or ${aliases[1]})` : '';
        return `  - ${name}${spelling}: ${issue.message}`;
      })
      .join('\n');

    throw new Error(
      `Blogs API is missing required Supabase configuration:\n${details}\n\n` +
        'Copy apps/blogs-api/.env.example to apps/blogs-api/.env and fill it in.\n' +
        'The keys are in the Supabase dashboard under Project Settings -> API keys.',
    );
  }

  const misplaced = assertNotPublishable(parsed.data.SUPABASE_SECRET_KEY);
  if (misplaced) {
    throw new Error(
      `SUPABASE_SECRET_KEY ${misplaced}.\n\n` +
        'The API writes with this key and relies on it bypassing row level ' +
        'security; the publishable key would connect but read back nothing.',
    );
  }

  cached = parsed.data;
  return cached;
}

/** Test seam: forget the memoised values so a new process.env is read. */
export function resetSupabaseEnvCache(): void {
  cached = null;
}
