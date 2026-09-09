/**
 * The Vercel entry point.
 *
 * Vercel routes every path here (see `vercel.json`) and calls the exported
 * handler with the original request -- an Express app *is* a request listener,
 * so it can be handed over as-is. The URL is preserved across that rewrite,
 * which is what lets `/health` and `/api/blogs` still reach their own routes.
 *
 * Built once per cold start, at module scope, so a warm instance reuses it.
 * `createApp()` never throws for missing configuration; the Supabase
 * credentials are read on first use inside a request, where the error handler
 * can turn a missing one into a logged 500 rather than a crashed function.
 */
import { createApp } from '../src/app';

export default createApp();
