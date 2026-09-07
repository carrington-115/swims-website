"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { Container } from "@/components/layout/container";
import { SiteLogo } from "@/components/layout/site-logo";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { mainNav, type NavItem } from "@/lib/navigation";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Milliseconds each link waits before it settles in behind the panel. */
const STAGGER_STEP = 55;

/**
 * The only navigation the site has: a menu button and the full-screen panel it
 * collapses open. One component at every breakpoint -- the Figma header is the
 * wordmark plus the hamburger on mobile (3070:36822) and on desktop (3012:157)
 * alike, so there is no separate desktop nav bar.
 *
 * The panel repeats the header row at the same height, so the wordmark stays
 * put and only the icon swaps from hamburger to cross. Below `lg` the links run
 * down the left (3070:36476); from `lg` up they right-align (3012:101).
 *
 * Motion lives in `globals.css` under `.menu-panel`, keyed off `data-state`.
 * The panel stays mounted through its exit animation and unmounts on
 * `animationend`.
 *
 * Two deliberate departures from the frames. The desktop header row is half the
 * height Figma draws, at the request of the design owner, with the wordmark and
 * icon scaled down to match; mobile keeps the frame as drawn. And where Figma floats the header row over the panel and
 * centres the content on the full 1024px frame, here the row stays in flow and
 * the content centres in what is left -- ~39px lower than the frame, but it can
 * never collide with the close button on a short desktop window.
 *
 * Behaviour: locks background scroll while open, traps Tab inside the panel,
 * closes on Escape and on route change, and returns focus to the button.
 */
export function SiteMenu({ className }: { className?: string }) {
  const pathname = usePathname();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const mounted = open || closing;

  const close = useCallback(() => {
    setOpen((wasOpen) => {
      if (wasOpen) setClosing(true);
      return false;
    });
    setExpanded(null);
    triggerRef.current?.focus();
  }, []);

  // Close when the route changes -- covers back/forward navigation as well as
  // taps on the links. Adjusting state during render rather than in an effect
  // avoids a cascading second render.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (open) setClosing(true);
    setOpen(false);
    setExpanded(null);
  }

  // Lock background scroll for as long as the panel covers the page.
  useEffect(() => {
    if (!mounted) return;
    document.body.dataset.scrollLocked = "true";
    return () => {
      delete document.body.dataset.scrollLocked;
    };
  }, [mounted]);

  // Move focus into the panel, and keep Tab inside it.
  useEffect(() => {
    if (!open) return;
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
  }, [open, close]);

  return (
    // A flex wrapper, not a plain block: an inline-flex button inside a block
    // sits on a text baseline, and the descender space under it pushes the
    // button off-centre in the header row.
    <div className={cn("flex items-center", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={mounted ? panelId : undefined}
        aria-label="Open menu"
        className={iconButtonClasses}
      >
        <MenuIcon className="size-full" />
      </button>

      {mounted ? (
        <div
          id={panelId}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          data-state={open ? "open" : "closed"}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget && !open)
              setClosing(false);
          }}
          className="menu-panel fixed inset-0 z-50 flex flex-col bg-surface"
        >
          <Container className="flex h-header shrink-0 items-center justify-between lg:h-header-lg">
            <SiteLogo />
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close menu"
              className={iconButtonClasses}
            >
              <CloseIcon className="size-full" />
            </button>
          </Container>

          <div className="flex flex-1 overflow-y-auto">
            <Container className="mb-auto flex w-full flex-col items-start gap-10 pt-12 pb-16 lg:my-auto lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-10">
              <nav aria-label="Main" className="w-full lg:w-full">
                <ul className="flex flex-col items-start gap-5 lg:items-end">
                  {mainNav.map((item, index) => (
                    <li
                      key={item.href}
                      className="menu-item flex flex-col items-start lg:items-end"
                      style={
                        {
                          "--enter-delay": `${index * STAGGER_STEP}ms`,
                        } as CSSProperties
                      }
                    >
                      {item.children ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setExpanded(
                                expanded === item.label ? null : item.label,
                              )
                            }
                            aria-expanded={expanded === item.label}
                            className={cn(menuLinkClasses, "gap-2.5")}
                          >
                            {item.label}
                            <ChevronDownIcon
                              className={cn(
                                "size-5 shrink-0 transition-transform duration-200 lg:size-12",
                                expanded === item.label && "rotate-180",
                              )}
                            />
                          </button>

                          <ul
                            hidden={expanded !== item.label}
                            className="flex flex-col gap-1 pt-2 pb-1 lg:items-end"
                          >
                            {item.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={close}
                                  className="block max-w-prose rounded-card px-1 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:text-right"
                                >
                                  <span className="block text-lg font-medium text-ink-strong lg:text-2xl">
                                    {child.label}
                                  </span>
                                  {child.description ? (
                                    <span className="mt-0.5 block text-sm text-ink-muted lg:text-base">
                                      {child.description}
                                    </span>
                                  ) : null}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={close}
                          aria-current={
                            isActive(pathname, item) ? "page" : undefined
                          }
                          className={cn(
                            menuLinkClasses,
                            "aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8",
                          )}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </Container>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * The hamburger and the cross are drawn at 28px on mobile and 40px on desktop.
 * Both icons carry the Figma icon frame as their own viewBox, insets included,
 * so the svg fills the button and takes no padding of its own.
 *
 * Mobile's 48px clears the 44px touch target guideline on its own; desktop's
 * 40px does not, so a transparent pseudo-element widens the tap area without
 * widening the box and pushing the header layout around.
 */
const iconButtonClasses =
  "relative inline-flex size-menu-icon shrink-0 items-center justify-center rounded-card text-on-surface transition-colors before:absolute before:top-1/2 before:left-1/2 before:size-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:size-menu-icon-lg";

/** Figma: Poppins Medium, 36px mobile / 57px desktop, in `on surface`. */
const menuLinkClasses =
  "inline-flex items-center font-display text-menu font-medium text-on-surface transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:text-menu-lg";

/** A nav item is current on its own route and on any of its children's routes. */
function isActive(pathname: string, item: NavItem) {
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
