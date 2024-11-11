import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { NewsletterCardSkeleton } from "@/app/components/skeleton/newsletter-card-skeleton";

// Function to get a random width for skeleton tags
function getRandomWidth(): number {
  // Return a random width within a reasonable range
  const minWidth = 120; // 12rem * 10
  const maxWidth = 240; // 24rem * 10
  return Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
}

export default function TagLoading() {
  return (
    <ThreeColumnLayout>
      <div className="px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-10 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto h-6 w-96 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

          {/* Tags Skeleton */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-6 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
                style={{ width: `${getRandomWidth()}px` }}
              />
            ))}
          </div>
        </div>

        {/* Newsletter Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <NewsletterCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
