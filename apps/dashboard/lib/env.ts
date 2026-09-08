/**
 * Environment, read once and loudly.
 *
 * `NEXT_PUBLIC_*` values are inlined at build time, so they must be referenced
 * as whole literal `process.env.NEXT_PUBLIC_X` expressions -- a dynamic lookup
 * would come back undefined in the browser bundle.
 */
function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `${name} is not set. Copy apps/dashboard/.env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

export function supabaseUrl(): string {
  return required('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function supabasePublishableKey(): string {
  return required(
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

/** Server-only: the dashboard calls the Blogs API from the server. */
export function blogsApiUrl(): string {
  return process.env.BLOGS_API_URL ?? 'http://localhost:3002';
}
