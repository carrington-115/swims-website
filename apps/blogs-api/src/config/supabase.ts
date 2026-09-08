import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { getSupabaseEnv } from '../env';

/**
 * `createClient` builds a Realtime client whether or not you ever use one, and
 * that constructor throws outright on a runtime with no global `WebSocket`:
 *
 *   Error: Node.js detected but native WebSocket not found.
 *
 * Node gained a global WebSocket in 22; on 20 it is behind
 * `--experimental-websocket`. So on Node 20 every entry point here -- the API,
 * the connection check, any script -- died at client construction, before a
 * single query.
 *
 * Realtime reads `transport` and only stores it, calling it when a channel is
 * subscribed to. This API subscribes to nothing, so handing it a placeholder
 * skips the runtime probe and nothing ever constructs it. If someone does add
 * Realtime later they get this explanation rather than a WebSocket that half
 * works.
 *
 * On Node 22+ and in browsers the real global is passed through and this is
 * inert.
 */
const realtimeTransport =
  (globalThis as { WebSocket?: unknown }).WebSocket ??
  class UnusableRealtimeTransport {
    constructor() {
      throw new Error(
        'The Blogs API does not use Supabase Realtime. To add it, run on ' +
          'Node 22+ (which has a global WebSocket) or pass a `ws` ' +
          'implementation as the realtime transport.',
      );
    }
  };

/**
 * Clients are created lazily and memoised. They used to be module-level
 * constants built at import time, which meant a missing env var threw before
 * any request handler existed -- fine for a long-running server, fatal and
 * unexplained on a serverless cold start.
 */
const clientOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: realtimeTransport as never,
  },
} as const;

let secret: SupabaseClient<Database> | null = null;
let publishable: SupabaseClient<Database> | null = null;

/**
 * The secret-key client (`sb_secret_…`, or a legacy `service_role` key).
 *
 * Bypasses row level security, which is what every model in this app depends
 * on. Server-only -- never expose this client or its key.
 */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!secret) {
    const env = getSupabaseEnv();
    secret = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, clientOptions);
  }
  return secret;
}

/**
 * The publishable-key client (`sb_publishable_…`, or a legacy `anon` key).
 *
 * Used for exactly one thing: handing a caller's JWT to `auth.getUser` to find
 * out who they are. It is bound by row level security and never used to read or
 * write blog data.
 */
export function getSupabaseAuth(): SupabaseClient<Database> {
  if (!publishable) {
    const env = getSupabaseEnv();
    publishable = createClient<Database>(
      env.SUPABASE_URL,
      env.SUPABASE_PUBLISHABLE_KEY,
      clientOptions,
    );
  }
  return publishable;
}

/** Test seam: drop the memoised clients so new credentials are picked up. */
export function resetSupabaseClients(): void {
  secret = null;
  publishable = null;
}
