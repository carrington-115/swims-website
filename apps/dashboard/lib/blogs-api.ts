import 'server-only';

import { createBlogsClient } from '@swims/api-client';

import { blogsApiUrl } from '@/lib/env';
import { getAccessToken } from '@/lib/supabase/server';

/**
 * The Blogs API, called from the server with the signed-in user's token.
 *
 * Server-side rather than from the browser for two reasons: the access token
 * stays in an httpOnly cookie instead of being handed to client JavaScript, and
 * there is no cross-origin request, so the API's CORS allowlist never comes
 * into it.
 *
 * `getAccessToken` is the seam `@swims/api-client` already exposes for exactly
 * this. It is called per request, so a session refreshed by the proxy is picked
 * up without rebuilding the client.
 */
export function blogsApi() {
  return createBlogsClient({
    baseUrl: blogsApiUrl(),
    getAccessToken,
    defaultOptions: {
      // Everything here is per-user and changes on write. Caching a draft list
      // would show one author another's stale page.
      cache: 'no-store',
    },
  });
}

export { BlogsApiError } from '@swims/api-client';
