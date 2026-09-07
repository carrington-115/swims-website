import type { ComponentPropsWithoutRef } from "react";

import { Container } from "@/components/layout/container";
import { FooterNavColumn } from "@/components/layout/footer-nav-column";
import { SiteLogo } from "@/components/layout/site-logo";
import { CopyrightIcon } from "@/components/ui/icons";
import { SocialLinks } from "@/components/ui/social-links";
import { contactEmail, footerNav } from "@/lib/navigation";
import { cn } from "@/lib/cn";

type SiteFooterProps = ComponentPropsWithoutRef<"footer">;

/**
 * Site footer (Figma 3025:4644 desktop, 3112:39145 mobile).
 *
 * Desktop puts the wordmark opposite three link columns and closes with a rule
 * of legal text and contacts. Phones stack the same pieces: wordmark, the
 * columns two-up (which drops "Quick links" onto its own row, as the frame
 * draws it), then contacts above the copyright.
 *
 * Links come from `lib/navigation.ts` -- edit that file, not this one.
 */
export function SiteFooter({ className, ...props }: SiteFooterProps) {
  return (
    <footer className={cn("bg-surface py-12 lg:py-16", className)} {...props}>
      <Container>
        {/* The Figma footer sits inside a narrower measure than the page shell. */}
        <div className="mx-auto flex w-full max-w-289 flex-col gap-15 lg:gap-25">
          <div className="flex flex-col gap-12.5 lg:flex-row lg:items-start lg:justify-between">
            <SiteLogo />
            <div className="grid grid-cols-2 gap-12.5 lg:flex lg:items-start">
              {footerNav.map((group) => (
                <FooterNavColumn key={group.title} group={group} />
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <p className="flex items-start gap-1.5 text-lg text-ink-muted">
              <CopyrightIcon className="mt-1.5 size-4 shrink-0" />
              <span>
                {new Date().getFullYear()}, SWIMS - all rights reserved
              </span>
            </p>

            <div className="flex flex-col items-start gap-1.5 lg:flex-row lg:items-center lg:gap-5">
              <SocialLinks />
              <a
                href={`mailto:${contactEmail}`}
                className="rounded-sm text-lg text-ink-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {contactEmail}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
