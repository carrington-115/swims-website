"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { getQueryClient } from "@/lib/query-client";

/**
 * Puts the React Query cache in context for the whole site.
 *
 * `getQueryClient()` rather than `useState(() => new QueryClient())`: the same
 * function runs during the server render, where it hands back a fresh
 * per-request client, and in the browser, where it hands back the one client
 * the session shares. Suspense can throw away and re-run this component's
 * render, which is exactly when a client created inline would be lost along
 * with everything cached in it.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
