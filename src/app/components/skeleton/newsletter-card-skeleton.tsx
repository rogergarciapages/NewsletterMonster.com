// src/components/skeleton/newsletter-card-skeleton.tsx
import { Skeleton } from "@nextui-org/react";

import { Card } from "@/components/ui/card";

export const NewsletterCardSkeleton = () => {
  return (
    <Card className="relative w-full overflow-hidden rounded-xl border bg-zinc-800/20 text-card-foreground shadow">
      {/* Use the same aspect ratio as the real newsletter cards */}
      <div className="relative w-full pt-[132.35%]">
        <div className="absolute inset-0 overflow-hidden">
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
        </div>
      </div>
    </Card>
  );
};
