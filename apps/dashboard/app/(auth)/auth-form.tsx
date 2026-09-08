'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { Alert } from '@/components/alert';
import { Button } from '@/components/button';
import { Field, Input } from '@/components/field';
import { createClient } from '@/lib/supabase/client';

type AuthFormProps = {
  mode: 'login' | 'signup';
  /** Where to land after a successful sign-in. */
  next?: string;
};

const copy = {
  login: {
    heading: 'Sign in',
    submit: 'Sign in',
    pending: 'Signing in…',
    switchPrompt: 'No account yet?',
    switchLabel: 'Create one',
    switchHref: '/signup',
  },
  signup: {
    heading: 'Create an account',
    submit: 'Create account',
    pending: 'Creating…',
    switchPrompt: 'Already have an account?',
    switchLabel: 'Sign in',
    switchHref: '/login',
  },
} as const;

/**
 * Email and password, against Supabase Auth directly.
 *
 * A client component, and deliberately not a Server Action: the password then
 * goes straight from the browser to the identity provider instead of through a
 * hop that has no reason to see it. `createBrowserClient` puts the session in
 * cookies, so the server rendering the next page can read it.
 *
 * `router.refresh()` before navigating discards the router cache, which still
 * holds pages rendered for a signed-out visitor.
 */
export function AuthForm({ mode, next = '/' }: AuthFormProps) {
  const router = useRouter();
  const text = copy[mode];

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '');
    const password = String(form.get('password') ?? '');
    const supabase = createClient();

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;

        // With email confirmation on, sign-up returns a user but no session --
        // there is nothing to redirect to yet, so say so rather than bouncing
        // the visitor to a login page that will refuse them.
        if (!data.session) {
          setConfirmationSent(true);
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }

      router.refresh();
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setPending(false);
    }
  }

  if (confirmationSent) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">Check your email</h1>
        <Alert tone="success">
          We sent a confirmation link. Open it, then sign in — the account cannot be used until
          the address is confirmed.
        </Alert>
        <Link href="/login" className="focus-ring text-sm text-brand-600 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">{text.heading}</h1>

      {error ? <Alert>{error}</Alert> : null}

      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </Field>

      <Field
        label="Password"
        htmlFor="password"
        hint={mode === 'signup' ? 'At least 6 characters.' : undefined}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          required
          minLength={6}
        />
      </Field>

      <Button type="submit" disabled={pending}>
        {pending ? text.pending : text.submit}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        {text.switchPrompt}{' '}
        <Link href={text.switchHref} className="focus-ring text-brand-600 hover:underline">
          {text.switchLabel}
        </Link>
      </p>
    </form>
  );
}
