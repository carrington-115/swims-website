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
 * Full width and stacked on phones, side by side from `lg` -- both frames draw
 * it that way, and a store button is the primary action wherever it appears.
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
    "w-full gap-3 px-3 lg:w-auto",
    tone === "onBrand" && "text-secondary",
  );

  return (
    <div
      className={cn("flex w-full flex-col gap-2.5 lg:flex-row lg:gap-2.5", className)}
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
