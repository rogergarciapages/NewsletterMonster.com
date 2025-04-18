// src/components/skeleton/newsletter-card-skeleton.tsx
import { Skeleton } from "@nextui-org/react";

import { Card } from "@/components/ui/card";

export const NewsletterCardSkeleton = () => {
  return (
    <Card className="relative w-full overflow-hidden rounded-xl bg-zinc-800">
      {/* Use the same aspect ratio as the real newsletter cards */}
      <div className="relative w-full pt-[132.35%]">
        <div className="absolute inset-0">
          {/* Image skeleton */}
          <Skeleton className="absolute inset-0 h-full w-full rounded-none">
            <div className="h-full w-full bg-zinc-700" />
          </Skeleton>

          {/* Brand tag at bottom */}
          <div className="absolute bottom-4 left-4 z-10">
            <Skeleton className="rounded-full">
              <div className="h-8 w-32 rounded-full" />
            </Skeleton>
          </div>

          {/* Action buttons */}
          <div className="absolute bottom-[4.5rem] left-4 z-10 flex space-x-2">
            <Skeleton className="rounded-full">
              <div className="h-8 w-20 rounded-full" />
            </Skeleton>
            <Skeleton className="rounded-full">
              <div className="h-8 w-20 rounded-full" />
            </Skeleton>
          </div>

          {/* Subject placeholder (only visible on hover in the real card) */}
          <div className="absolute left-4 right-4 top-4 z-10">
            <div className="space-y-2">
              <Skeleton className="rounded-lg">
                <div className="h-6 w-3/4" />
              </Skeleton>
              <Skeleton className="rounded-lg">
                <div className="h-6 w-1/2" />
              </Skeleton>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
