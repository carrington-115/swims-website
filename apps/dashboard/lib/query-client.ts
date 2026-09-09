import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';

/**
 * A much shorter `staleTime` than the website's, because everything here is the
 * signed-in author's own work and changes the moment they publish or delete
 * something.
 *
 * Not zero, though. Correctness after a write does not rest on it: every
 * mutation invalidates the listing explicitly, and a page rendered on the
 * server hydrates over whatever the browser had cached, since the incoming
 * data is the newer of the two. Fifteen seconds is only how long the cache is
 * trusted without being asked again -- long enough that arriving on the page
 * does not fire a second request for what the server just sent, short enough
 * that a tab left open is never far behind.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        retry: 1,
      },
      dehydrate: {
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * One client per request on the server, one for the whole session in the
 * browser. A module-level singleton on the server would share one author's
 * cache with every other signed-in author at once.
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
