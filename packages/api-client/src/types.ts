/**
 * Next.js augments RequestInit with its own caching controls. Accepting them
 * here lets a server component pass `{ next: { revalidate: 60 } }` straight
 * through without the client having to depend on Next.
 */
export interface RequestOptions extends Omit<RequestInit, "method" | "body"> {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export type FetchLike = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

export interface BlogsClientOptions {
  /** Base URL of the Blogs API, e.g. http://localhost:3002 */
  baseUrl: string;
  /**
   * Supplies the Supabase access token for authenticated writes. Left
   * unset the client only reaches the public read routes. This is the seam
   * for whichever auth strategy the dashboard ends up using.
   */
  getAccessToken?: () =>
    | string
    | null
    | undefined
    | Promise<string | null | undefined>;
  /** Override the fetch implementation (tests, instrumentation). */
  fetch?: FetchLike;
  /** Applied to every request; per-call options win. */
  defaultOptions?: RequestOptions;
}
