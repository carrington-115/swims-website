import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * A post before it has arrived.
 *
 * Laid out as `BlogArticle` is -- breadcrumb, title, chips, cover, then the
 * prose column with the contents rail beside it -- so the page does not jump
 * when the text lands. The rail is hidden below `lg`, exactly where the real one
 * moves above the prose.
 */
export function BlogArticleSkeleton() {
  return (
    <Section spacing="md" role="status" aria-label="Loading the post">
      <Container className="flex flex-col gap-5.25">
        <header className="flex flex-col gap-10">
          <div className="flex flex-col gap-2.5 lg:w-195.25">
            <Skeleton className="h-4 w-64" />

            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-full lg:h-11" />
              <Skeleton className="h-8 w-2/3 lg:h-11" />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 lg:gap-5">
              <Skeleton className="h-13 w-44 rounded-pill" />
              <Skeleton className="h-13 w-36 rounded-pill" />
              <Skeleton className="h-13 w-24 rounded-pill" />
            </div>
          </div>

          <Skeleton className="aspect-[1237/732] w-full rounded-none" />
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-7.25">
          <div className="hidden lg:block lg:order-last lg:w-75.75 lg:shrink-0">
            <Skeleton className="h-6 w-52" />
            <div className="mt-2 flex flex-col gap-2.5">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-4 w-full" />
              ))}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-6">
            {Array.from({ length: 3 }, (_, section) => (
              <div key={section} className="flex flex-col gap-2">
                <Skeleton className="h-5 w-3/5" />
                {Array.from({ length: 6 }, (_, line) => (
                  <Skeleton
                    key={line}
                    className={line === 5 ? "h-4 w-1/2" : "h-4 w-full"}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
