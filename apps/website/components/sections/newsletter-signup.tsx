import type { ComponentPropsWithoutRef } from "react";

import { images } from "@/assets/images";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SiteImage } from "@/components/media/site-image";
import {
  NewsletterForm,
  type NewsletterState,
} from "@/components/sections/newsletter-form";
import { cn } from "@/lib/cn";

type NewsletterSignupProps = ComponentPropsWithoutRef<"section"> & {
  action: (
    state: NewsletterState,
    formData: FormData,
  ) => Promise<NewsletterState>;
  heading?: string;
  body?: string;
};

/**
 * Newsletter band (Figma 3024:4582 desktop, 3072:37036 mobile): copy and the
 * subscribe form on a dark plate, with a photograph beside them.
 *
 * Stacked on phones with the photo below the form, side by side from `lg`. The
 * server component holds everything except the form itself, so only the form
 * ships to the browser.
 */
export function NewsletterSignup({
  action,
  heading = "Stay connected with us",
  body = "Get monthly insights on waste policy, DTRACKER updates, and stories from collectors building formal waste systems across Africa. No spam, just what actually matters.",
  className,
  ...props
}: NewsletterSignupProps) {
  return (
    <Section
      tone="tertiary"
      spacing="none"
      aria-labelledby="newsletter-heading"
      className={cn("py-8 lg:py-27.5", className)}
      {...props}
    >
      <Container className="flex flex-col items-center gap-5 lg:flex-row lg:justify-center lg:gap-25">
        <div className="flex w-full flex-col gap-2.5 lg:w-130 lg:gap-5">
          <h2
            id="newsletter-heading"
            className="font-display text-xl font-semibold text-white lg:text-4xl"
          >
            {heading}
          </h2>
          <p className="text-sm text-tertiary-100 lg:text-lg">{body}</p>
          <NewsletterForm action={action} />
        </div>

        <div className="relative aspect-[591/323] w-full shrink-0 overflow-hidden lg:w-148 lg:rounded-media">
          <SiteImage
            image={images.home.newsletterCollectors}
            cover
            sizes="(min-width: 1024px) 592px, 100vw"
          />
        </div>
      </Container>
    </Section>
  );
}
