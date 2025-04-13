// src/components/skeleton/newsletter-card-skeleton.tsx
import { Skeleton } from "@nextui-org/react";

import { Card } from "@/components/ui/card";

export const NewsletterCardSkeleton = () => {
  return (
    <Card className="relative w-full bg-content2">
      {/* Use a fixed height instead of aspect ratio */}
      <div className="relative h-80 w-full">
        <div className="absolute inset-0 m-3 overflow-hidden rounded-xl">
          {/* Image skeleton */}
          <Skeleton className="absolute inset-0 rounded-xl">
            <div className="h-full w-full bg-default-300" />
          </Skeleton>

          {/* Content overlay */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
            {/* Title and date skeleton */}
            <div>
              {/* Title bars */}
              <div className="space-y-2">
                <Skeleton className="rounded-lg">
                  <div className="h-6 w-3/4" />
                </Skeleton>
                <Skeleton className="rounded-lg">
                  <div className="h-6 w-1/2" />
                </Skeleton>
              </div>

              {/* Date skeleton */}
              <div className="mt-4">
                <Skeleton className="rounded-lg">
                  <div className="h-4 w-32" />
                </Skeleton>
              </div>
            </div>

            {/* Footer skeleton */}
            <div className="space-y-4">
              {/* Metrics skeleton */}
              <div className="flex space-x-4">
                <Skeleton className="rounded-full">
                  <div className="h-8 w-20" />
                </Skeleton>
                <Skeleton className="rounded-full">
                  <div className="h-8 w-20" />
                </Skeleton>
              </div>

              {/* Sender name skeleton */}
              <Skeleton className="rounded-full">
                <div className="h-6 w-32" />
              </Skeleton>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
