'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { getQueryClient } from '@/lib/query-client';

/**
 * Puts the React Query cache in context for the whole dashboard.
 *
 * `getQueryClient()` rather than a client created inline: the same call gives a
 * fresh per-request client during the server render and the one shared client
 * in the browser. Suspense can discard and re-run this render, which is exactly
 * when an inline client would be thrown away along with everything cached in it.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
