"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export type NewsletterState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const newsletterInitialState: NewsletterState = { status: "idle" };

type NewsletterFormProps = {
  /** Server action that records the address and reports back. */
  action: (
    state: NewsletterState,
    formData: FormData,
  ) => Promise<NewsletterState>;
  submitLabel?: string;
  className?: string;
};

/**
 * The subscribe form (Figma 3024:4570 + 3024:4577).
 *
 * The only client component in the newsletter band: it holds the pending and
 * result state of the server action. The label is visually hidden because the
 * Figma field is placeholder-only, but it still has to exist for screen readers
 * -- a placeholder is not an accessible name.
 */
export function NewsletterForm({
  action,
  submitLabel = "Join our newsletter",
  className,
}: NewsletterFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    newsletterInitialState,
  );

  return (
    <form action={formAction} className={cn("flex flex-col gap-2.5 lg:gap-5", className)}>
      <div className="flex flex-col gap-2.5 lg:gap-5">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Email"
          tone="onDark"
          aria-describedby={state.message ? "newsletter-status" : undefined}
          aria-invalid={state.status === "error" || undefined}
        />
        <Button type="submit" shape="square" className="px-3" disabled={pending}>
          {pending ? "Joining…" : submitLabel}
        </Button>
      </div>

      {state.message ? (
        <p
          id="newsletter-status"
          role="status"
          className={cn(
            "text-sm",
            state.status === "error" ? "text-primary-200" : "text-tertiary-100",
          )}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
