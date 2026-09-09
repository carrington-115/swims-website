import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

/**
 * `staleTime` has to be greater than zero for server prefetching to be worth
 * anything: with the default of 0 every query the server rendered is stale the
 * moment it reaches the browser, so the client refetches it immediately and the
 * prefetch bought nothing but a duplicate request.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        // Published posts do not change while someone is reading them, and a
        // refetch on every tab focus makes the listing flicker for nothing.
        refetchOnWindowFocus: false,
        retry: 1,
      },
      dehydrate: {
        // Pending queries are dehydrated too, so a query the server started but
        // did not await still streams to the client instead of being refetched
        // there from scratch.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * One client per request on the server, one for the whole session in the
 * browser.
 *
 * A module-level singleton on the server would share one cache between every
 * visitor at once; a new client per render in the browser would throw away the
 * cache on every re-render and refetch everything.
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
