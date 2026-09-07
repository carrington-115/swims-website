import type { ComponentPropsWithoutRef } from "react";

import { Button } from "@/components/ui/button";
import { AppStoreIcon, PlayStoreIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type AppStoreButtonsProps = ComponentPropsWithoutRef<"div"> & {
  playStoreHref?: string;
  appStoreHref?: string;
  playStoreLabel?: string;
  appStoreLabel?: string;
  /**
   * `onBrand` is the white plate with brand-green type the Figma bands use on
   * a coloured background; `solid` is the green button for a white one.
   */
  tone?: "onBrand" | "solid";
};

/**
 * The pair of app download buttons (Figma 3046:4907).
 *
 * Stacked on phones, side by side from `lg`. Each button is as wide as its own
 * label: `items-start` on the row is what holds that, because a flex column
 * stretches its children and would otherwise run both buttons out to the full
 * width of whatever band they sit in. A band that centres its copy passes
 * `items-center` to centre them instead.
 */
export function AppStoreButtons({
  playStoreHref = "https://play.google.com/store/apps/details?id=africa.swims.dtracker",
  appStoreHref = "https://apps.apple.com/app/dtracker",
  playStoreLabel = "Get it on Playstore",
  appStoreLabel = "Download from Appstore",
  tone = "onBrand",
  className,
  ...props
}: AppStoreButtonsProps) {
  const variant = tone === "onBrand" ? "onImageSolid" : "primary";
  const buttonClassName = cn(
    "gap-3 px-3",
    tone === "onBrand" && "text-secondary",
  );

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2.5 lg:flex-row lg:items-center",
        className,
      )}
      {...props}
    >
      <Button
        href={playStoreHref}
        variant={variant}
        shape="square"
        className={buttonClassName}
      >
        <PlayStoreIcon className="size-6 shrink-0" />
        {playStoreLabel}
      </Button>
      <Button
        href={appStoreHref}
        variant={variant}
        shape="square"
        className={buttonClassName}
      >
        <AppStoreIcon className="h-6.75 w-6 shrink-0" />
        {appStoreLabel}
      </Button>
    </div>
  );
}
