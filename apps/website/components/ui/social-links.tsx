import type { ComponentPropsWithoutRef, ComponentType, SVGProps } from "react";

import {
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/ui/icons";
import { socialLinks, type SocialNetwork } from "@/lib/navigation";
import { cn } from "@/lib/cn";

type SocialLinksProps = ComponentPropsWithoutRef<"ul"> & {
  /** Defaults to every profile in `lib/navigation.ts`. */
  links?: typeof socialLinks;
  /**
   * Whose profiles these are -- it becomes the accessible name, "<owner> on
   * LinkedIn". A team member's row passes their name (Figma 3138:251); the
   * footer leaves it alone.
   */
  owner?: string;
};

/**
 * Row of social profile links (Figma 3025:4683).
 *
 * The marks are not drawn on a shared grid, so each keeps its own height and
 * lets its width follow -- sizing them all alike would squash the LinkedIn box
 * and stretch the YouTube one.
 */
const glyphs: Record<
  SocialNetwork,
  { Icon: ComponentType<SVGProps<SVGSVGElement>>; className: string }
> = {
  linkedin: { Icon: LinkedInIcon, className: "h-7 w-auto" },
  facebook: { Icon: FacebookIcon, className: "h-6.5 w-auto" },
  instagram: { Icon: InstagramIcon, className: "h-6 w-auto" },
  youtube: { Icon: YouTubeIcon, className: "h-6 w-auto" },
  github: { Icon: GitHubIcon, className: "h-7.5 w-auto" },
  x: { Icon: XIcon, className: "h-6 w-auto" },
};

export function SocialLinks({
  links = socialLinks,
  owner = "SWIMS",
  className,
  ...props
}: SocialLinksProps) {
  return (
    <ul className={cn("flex items-center gap-1.5", className)} {...props}>
      {links.map(({ network, label, href }) => {
        const { Icon, className: glyphClassName } = glyphs[network];
        return (
          <li key={network}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-sm text-ink-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Icon className={glyphClassName} />
              <span className="sr-only">
                {owner} on {label}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
