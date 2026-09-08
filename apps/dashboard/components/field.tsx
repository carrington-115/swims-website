import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/cn';

const control =
  'focus-ring w-full rounded-field border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted';

type FieldProps = {
  label: string;
  htmlFor: string;
  /** Shown under the label. Use it for the rule, not for an error. */
  hint?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Label, control and hint as one unit. `htmlFor` is required rather than
 * optional so a control cannot end up unlabelled by omission.
 */
export function Field({ label, htmlFor, hint, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentPropsWithoutRef<'input'>) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentPropsWithoutRef<'textarea'>) {
  return <textarea className={cn(control, 'min-h-28 resize-y', className)} {...props} />;
}

export function Select({ className, ...props }: ComponentPropsWithoutRef<'select'>) {
  return <select className={cn(control, 'cursor-pointer', className)} {...props} />;
}
