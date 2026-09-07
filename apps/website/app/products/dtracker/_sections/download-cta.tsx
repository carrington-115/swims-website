import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { AppStoreButtons } from "@/components/ui/app-store-buttons";

/**
 * "Ready to start earning more?" (Figma 3049:35472): the band that closes the
 * DTRACKER page's own content, before the shared blog and newsletter bands.
 *
 * A secondary-green plate with the copy centred and the two store buttons under
 * it. The buttons come from `AppStoreButtons`, the same component the hero and
 * the Why Us collector pitch use, so the store links live in one place.
 */
export function DownloadCta() {
  return (
    <Section
      tone="secondary"
      spacing="md"
      aria-labelledby="download-dtracker-heading"
    >
      <Container className="flex flex-col items-center gap-3 text-center">
        <h2
          id="download-dtracker-heading"
          className="font-display text-xl font-semibold text-white lg:text-4xl"
        >
          Ready to start earning more?
        </h2>
        <p className="max-w-184 text-sm text-tertiary-100 lg:text-xl">
          Download DTRACKER on iOS or Android and join 100+ collectors already
          building their business.
        </p>

        <AppStoreButtons className="lg:w-auto lg:justify-center" />
      </Container>
    </Section>
  );
}
