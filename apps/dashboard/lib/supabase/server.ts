import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { supabasePublishableKey, supabaseUrl } from '@/lib/env';

/**
 * Supabase on the server, reading the session out of the request cookies.
 *
 * `cookies()` is async in Next 16, so this is too. The `setAll` handler throws
 * in a plain server component -- cookies can only be written from a Server
 * Action or a Route Handler -- which is expected and swallowed: the `proxy`
 * refreshes the session on every request, so a component that only reads never
 * needs to write one.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl(), supabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Read-only context. See the note above.
        }
      },
    },
  });
}

/**
 * The signed-in user, or null.
 *
 * Always `getUser()`, never `getSession()`: the session comes out of a cookie
 * the browser could have written, whereas `getUser` revalidates the token with
 * Supabase. Anything that gates access has to use this one.
 */
export async function getUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}

/** The caller's access token, for forwarding to the Blogs API. */
export async function getAccessToken(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
