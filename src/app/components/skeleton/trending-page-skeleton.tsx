// src/components/skeleton/trending-page-skeleton.tsx
import { Skeleton } from "@nextui-org/react";
import { NewsletterCardSkeleton } from "./newsletter-card-skeleton";

interface TrendingPageSkeletonProps {
  count?: number;
}

export const TrendingPageSkeleton = ({ count = 9 }: TrendingPageSkeletonProps) => {
  return (
    <div className="w-full">
      {/* Header skeleton */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-b">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between max-w-7xl mx-auto">
          {/* Search bar skeleton */}
          <div className="flex-1 w-full sm:max-w-[300px]">
            <Skeleton className="rounded-lg">
              <div className="h-10 w-full" />
            </Skeleton>
          </div>
          {/* Sort dropdown skeleton */}
          <div className="w-full sm:max-w-[200px]">
            <Skeleton className="rounded-lg">
              <div className="h-10 w-full" />
            </Skeleton>
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {Array.from({ length: count }).map((_, index) => (
          <NewsletterCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};