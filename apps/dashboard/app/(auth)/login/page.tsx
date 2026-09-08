import type { Metadata } from 'next';

import { AuthForm } from '../auth-form';

export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { next } = await searchParams;
  // A repeated query string parses as an array; take the first. Only same-site
  // paths are honoured, so `?next=https://elsewhere` cannot bounce anyone off.
  const raw = Array.isArray(next) ? next[0] : next;
  const target = raw?.startsWith('/') && !raw.startsWith('//') ? raw : '/';

  return <AuthForm mode="login" next={target} />;
}
