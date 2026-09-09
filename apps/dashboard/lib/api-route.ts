import 'server-only';

import { NextResponse } from 'next/server';

import { BlogsApiError } from '@/lib/blogs-api';
import { getUser } from '@/lib/supabase/server';

/**
 * Shared pieces of the route handlers under `app/api`.
 *
 * Those handlers exist so the browser can read and write blogs without ever
 * holding an access token. The dashboard's own origin serves them, they run on
 * the server, and they forward the caller's token -- which stays in an httpOnly
 * cookie -- to the Blogs API. Calling the Blogs API from the browser instead
 * would mean handing that token to client JavaScript and adding this origin to
 * the API's CORS allowlist, for no gain.
 */

/**
 * The signed-in user, or a 401 to return as-is.
 *
 * `getUser()` and not the cookie the proxy read: the proxy is an optimistic
 * redirect, this is the boundary. Every handler starts here.
 */
export async function requireUser() {
  const user = await getUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'Your session has expired. Sign in again.' },
        { status: 401 },
      ),
    } as const;
  }

  return { user, response: null } as const;
}

/**
 * Turns a failure into a response the client can act on.
 *
 * A `BlogsApiError` already carries the API's own status and message, so it is
 * passed through rather than flattened to a 500 -- that is what lets the list
 * distinguish "not yours" from "the API is down". Status 0 means the API was
 * never reached at all, which is a 502 from where the browser is standing:
 * this dashboard answered, its upstream did not.
 */
export function errorResponse(error: unknown): NextResponse {
  if (error instanceof BlogsApiError) {
    return error.isNetworkError
      ? NextResponse.json(
          { error: 'Could not reach the Blogs API. Is it running on the port in BLOGS_API_URL?' },
          { status: 502 },
        )
      : NextResponse.json({ error: error.message }, { status: error.status });
  }

  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Something went wrong.' },
    { status: 500 },
  );
}
