/**
 * Environment for the website.
 *
 * `NEXT_PUBLIC_*` is inlined at build time, so it has to be written as a whole
 * literal `process.env.NEXT_PUBLIC_X` expression -- a dynamic lookup comes back
 * undefined in the browser bundle.
 *
 * The blog listing is fetched from the browser as well as the server, so unlike
 * the dashboard's `BLOGS_API_URL` this one has to be public. Nothing secret
 * goes over it: the website only ever reads published posts, unauthenticated.
 */
export function blogsApiUrl(): string {
  return process.env.NEXT_PUBLIC_BLOGS_API_URL ?? "http://localhost:3002";
}
