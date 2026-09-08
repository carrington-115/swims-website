import { cn } from '@/lib/cn';

type AlertProps = {
  tone?: 'error' | 'success';
  children: React.ReactNode;
  className?: string;
};

/**
 * `role="alert"` so a screen reader announces a failed sign-in without the
 * user having to go looking for why nothing happened.
 */
export function Alert({ tone = 'error', children, className }: AlertProps) {
  return (
    <p
      role="alert"
      className={cn(
        'rounded-field border px-3 py-2 text-sm',
        tone === 'error'
          ? 'border-danger-200 bg-danger-50 text-danger-600'
          : 'border-brand-200 bg-brand-50 text-brand-700',
        className,
      )}
    >
      {children}
    </p>
  );
}
