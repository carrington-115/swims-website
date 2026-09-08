import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: Variant;
  size?: Size;
};

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

const variants = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 disabled:hover:bg-brand-500',
  secondary: 'border border-line bg-surface text-ink hover:bg-canvas',
  danger: 'border border-danger-200 bg-surface text-danger-600 hover:bg-danger-50',
  ghost: 'text-ink-muted hover:bg-canvas hover:text-ink',
} as const;

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
} as const;

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'focus-ring inline-flex cursor-pointer items-center justify-center gap-2 rounded-field font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

/**
 * A link that looks like a button.
 *
 * Separate from `Button` rather than a prop on it, because the two render
 * different elements and nesting an `<a>` inside a `<button>` is invalid --
 * browsers recover from it inconsistently and it is unusable by keyboard.
 */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-field font-medium transition-colors',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
