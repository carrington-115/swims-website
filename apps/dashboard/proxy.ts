import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Session refresh and the front door.
 *
 * Next 16 renamed Middleware to Proxy; the file is `proxy.ts` at the project
 * root and the export is `proxy`. The behaviour is unchanged.
 *
 * Two jobs, in this order:
 *
 *  1. Refresh the Supabase session. Access tokens last an hour, and a server
 *     component cannot write a cookie, so something on the request path has to
 *     do it or a tab left open overnight would sign itself out.
 *  2. Send signed-out visitors to /login and signed-in ones away from it.
 *
 * This is an *optimistic* check, not the authorisation boundary. Every page and
 * action re-checks with `getUser()` against Supabase, because a cookie is
 * something the client controls and this proxy only reads it.
 */
export async function proxy(request: NextRequest) {
  // Must be built from the incoming request and returned as-is: the Supabase
  // client writes refreshed cookies onto it, and constructing a different
  // response later would drop them.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Do not put anything between the client above and this call: it is what
  // performs the refresh, and an early return in between would leave the
  // session unrenewed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // So sign-in can return the visitor to whatever they were reaching for.
    if (pathname !== '/') url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  /*
   * Everything except Next's own assets and image files. Notably this does run
   * on /login and /signup -- that is how an already signed-in visitor is sent
   * onward rather than being shown a form they do not need.
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
