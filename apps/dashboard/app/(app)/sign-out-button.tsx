'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/button';
import { createClient } from '@/lib/supabase/client';

/**
 * Signs out in the browser so `createBrowserClient` clears the session cookies
 * it wrote, then refreshes to drop the router cache of signed-in pages. The
 * proxy handles the redirect to /login on the next request.
 */
export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await createClient().auth.signOut();
        router.refresh();
        router.replace('/login');
      }}
    >
      {pending ? 'Signing out…' : 'Sign out'}
    </Button>
  );
}
