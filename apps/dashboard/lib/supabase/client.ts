import { createBrowserClient } from '@supabase/ssr';

import { supabasePublishableKey, supabaseUrl } from '@/lib/env';

/**
 * Supabase in the browser.
 *
 * Used only by the sign-in and sign-up forms, which talk to Supabase Auth
 * directly rather than proxying credentials through this app -- a password is
 * better off going straight to the identity provider than through a hop that
 * has no reason to see it.
 *
 * `createBrowserClient` writes the session to cookies rather than
 * localStorage, which is what lets the server components and the `proxy` read
 * it on the next request.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl(), supabasePublishableKey());
}
