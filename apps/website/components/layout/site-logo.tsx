import Link from "next/link";

import { images } from "@/assets/images";
import { SiteImage } from "@/components/media/site-image";
import { cn } from "@/lib/cn";

type SiteLogoProps = {
  className?: string;
  /** Set on the header logo so it is not lazy-loaded. */
  priority?: boolean;
};

/**
 * The wordmark, linked home. Used by the header, the collapse menu and the
 * footer. Its height is a token (`h-logo` / `lg:h-logo-lg`, 38px / 63px) so the
 * header and the open menu render it at exactly the same size and the logo does
 * not move when the menu opens.
 */
export function SiteLogo({ className, priority }: SiteLogoProps) {
  return (
    <Link
      href="/"
      aria-label="SWIMS home"
      className={cn(
        "inline-flex shrink-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
        className,
      )}
    >
      <SiteImage
        image={images.brand.logo}
        alt=""
        className="h-logo w-auto lg:h-logo-lg"
        priority={priority}
      />
    </Link>
  );
}
