/**
 * Typed client for the Blogs API. Both the website and the dashboard go
 * through this rather than hand-rolling fetch, so the envelope-unwrapping and
 * auth-header logic lives in exactly one place.
 */
export { createBlogsClient } from "./client";
export type { BlogsClient } from "./client";
export { BlogsApiError } from "./errors";
export type { BlogsClientOptions, RequestOptions, FetchLike } from "./types";
export type * from "@swims/schemas";
