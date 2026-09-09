import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

/**
 * The 404, which the site did not have.
 *
 * `notFound()` in `app/blog/[slug]/page.tsx` and `app/people/[slug]/page.tsx`
 * has always rendered Next's stock black-and-white page, on a site that
 * otherwise has a header and a footer.
 *
 * `noindex` matters as much as the markup: a dead URL that answers with a
 * styled page still answers with a 404 status, but the meta tag says the same
 * thing to a crawler that reached it from an old link elsewhere.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Section spacing="lg">
      <Container className="flex flex-col items-start gap-6">
        <p className="font-display text-6xl font-semibold text-primary lg:text-7xl">
          404
        </p>
        <h1 className="font-display text-3xl font-semibold text-ink-strong lg:text-4xl">
          We could not find that page
        </h1>
        <p className="max-w-prose text-lg text-ink-muted">
          The link may be out of date, or the page may have moved. The blog and
          the products are both a click away.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/blog" variant="outline">
            Read the blog
          </Button>
        </div>
      </Container>
    </Section>
  );
}
