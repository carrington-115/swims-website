import type { ReactNode } from 'react';

import { SwimsLogo } from '@/components/swims-logo';

/** Centred card, no chrome: there is nothing to navigate to until you are in. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <SwimsLogo className="h-10" priority />
          <p className="text-sm text-ink-muted">Blogs dashboard</p>
        </div>
        <div className="rounded-card border border-line bg-surface p-6 shadow-sm">{children}</div>
      </div>
    </div>
  );
}
