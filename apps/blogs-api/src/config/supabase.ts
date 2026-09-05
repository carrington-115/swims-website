import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { getSupabaseEnv } from '../env';

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
} as const;

let admin: SupabaseClient<Database> | null = null;
let anon: SupabaseClient<Database> | null = null;

/** Service-role client. Bypasses RLS -- server-only, never expose this. */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!admin) {
    const env = getSupabaseEnv();
    admin = createClient<Database>(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      clientOptions,
    );
  }
  return admin;
}

/** Anon client, used only to verify caller JWTs. */
export function getSupabaseAuth(): SupabaseClient<Database> {
  if (!anon) {
    const env = getSupabaseEnv();
    anon = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, clientOptions);
  }
  return anon;
}
