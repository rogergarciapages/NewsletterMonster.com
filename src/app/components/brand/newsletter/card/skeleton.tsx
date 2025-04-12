"use client";

import { memo } from "react";

import { Skeleton } from "@nextui-org/react";

// Memoize the skeleton since it never changes
const NewsletterCardSkeleton = memo(() => {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-zinc-800">
      {/* Image */}
      <div className="relative aspect-[1200/630] w-full">
        <Skeleton className="absolute inset-0 h-full w-full" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-4">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4 rounded-lg" />
          <Skeleton className="h-6 w-1/2 rounded-lg" />
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded-lg" />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-16 rounded-lg" />
            <Skeleton className="h-6 w-16 rounded-lg" />
          </div>
          <Skeleton className="h-6 w-24 rounded-lg" />
        </div>
      </div>
    </article>
  );
});

NewsletterCardSkeleton.displayName = "NewsletterCardSkeleton";

export default NewsletterCardSkeleton;
