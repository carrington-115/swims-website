"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, type ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { SiteLogo } from "@/components/layout/site-logo";
import { CloseIcon } from "@/components/ui/icons";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

type ProfileModalProps = {
  /** The heading inside the panel that names this dialog. */
  labelledBy: string;
  children: ReactNode;
};

/**
 * The sheet a team member's profile opens in (Figma 3138:251).
 *
 * Only the shell: the wordmark and close button across the top, the scrim, and
 * the dialog behaviour. The profile itself arrives as `children` from the
 * intercepting route, so it stays a server component.
 *
 * Closing means going back, because the popup *is* the `/people/[slug]` route
 * intercepted -- the URL is real and shareable, refreshing it renders the full
 * page instead, and the browser's back button closes the sheet the same way the
 * cross does.
 *
 * The keyboard contract is `SiteMenu`'s, deliberately: scroll locked while it
 * covers the page, Tab kept inside the panel, Escape closes. The two are the
 * site's only dialogs and should behave identically.
 */
export function ProfileModal({ labelledBy, children }: ProfileModalProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => router.back(), [router]);

  // Lock background scroll for as long as the sheet covers the page.
  useEffect(() => {
    document.body.dataset.scrollLocked = "true";
    return () => {
      delete document.body.dataset.scrollLocked;
    };
  }, []);

  // Move focus into the panel, and keep Tab inside it.
  useEffect(() => {
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => element.offsetParent !== null);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  return (
    // Dismissing on the scrim is an extra, not the only way out: Escape and the
    // close button both do the same thing, so this carries no keyboard handler
    // of its own. `mousedown` rather than `click`, or a drag that starts inside
    // the panel and ends on the scrim would close it.
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-tertiary/60 lg:p-10"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="mx-auto flex min-h-full w-full max-w-content flex-col bg-surface lg:min-h-0 lg:shadow-modal"
      >
        <Container className="flex h-header shrink-0 items-center justify-between lg:h-header-lg">
          <SiteLogo />
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close profile"
            className="relative inline-flex size-menu-icon shrink-0 items-center justify-center rounded-card text-on-surface transition-colors before:absolute before:top-1/2 before:left-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:size-menu-icon-lg"
          >
            <CloseIcon className="size-full" />
          </button>
        </Container>

        <Container className="pt-6 pb-12 lg:pt-14 lg:pb-20">{children}</Container>
      </div>
    </div>
  );
}
