import { Container } from "@/components/layout/container";
import { SiteLogo } from "@/components/layout/site-logo";
import { SiteMenu } from "@/components/layout/site-menu";

/**
 * Site header (Figma 3070:36822 mobile, 3012:157 desktop).
 *
 * The wordmark and the menu button, nothing else -- the design uses the same
 * row at every breakpoint and puts every link behind the collapse menu, so
 * there is no nav bar to swap in on desktop. Flat white, no rule and no
 * shadow.
 *
 * It sticks to the top of the viewport as the page scrolls. Mobile is the
 * frame height as drawn; desktop is half of it -- see the header tokens in
 * `globals.css`.
 *
 * Stays a server component; only `SiteMenu` holds state.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-surface">
      <Container className="flex h-header items-center justify-between gap-6 lg:h-header-lg">
        <SiteLogo priority />
        <SiteMenu />
      </Container>
    </header>
  );
}
