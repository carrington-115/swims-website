import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { SwimsLogo } from '@/components/swims-logo';
import { getUser } from '@/lib/supabase/server';

import { SignOutButton } from './sign-out-button';

/**
 * The signed-in shell.
 *
 * The `getUser()` here is the real gate. The proxy already redirected a
 * signed-out visitor, but that decision was made from a cookie; this one asks
 * Supabase, and every layout under it inherits the guarantee.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  if (!user) redirect('/login');

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="focus-ring flex items-center gap-2 rounded-field">
            {/* The wordmark is in the image, so the text beside it is not a
                repeat of the name and the image itself is decorative. */}
            <SwimsLogo alt="" priority />
            <span className="text-sm text-ink-muted">Blogs</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-muted sm:inline">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
