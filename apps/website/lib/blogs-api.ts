import { createBlogsClient } from "@swims/api-client";

import { blogsApiUrl } from "@/lib/env";

/**
 * The Blogs API, for public reads.
 *
 * No `getAccessToken`: the website never authenticates, so it only ever reaches
 * the published set. That is also why this client is safe to use from the
 * browser -- there is no token to leak, and the API's `CORS_ORIGINS` already
 * names the site's origin.
 *
 * Built once at module load rather than per call: it holds no per-request
 * state, and the fetch it uses is whatever the runtime provides.
 */
export const blogsApi = createBlogsClient({ baseUrl: blogsApiUrl() });

export { BlogsApiError } from "@swims/api-client";
