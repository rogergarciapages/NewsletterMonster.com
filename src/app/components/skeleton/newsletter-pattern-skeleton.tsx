"use client";

import { Skeleton } from "@nextui-org/react";

export function NewsletterPatternSkeleton() {
  return (
    <div className="space-y-6 border-none bg-[rgb(24_24_27/var(--tw-bg-opacity))]">
      {/* Pattern 1: Large (2 cols) + Ad & Small stacked (1 col) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Large Card (2 cols) */}
        <div className="md:col-span-2">
          <LargeNewsletterCardSkeleton />
        </div>

        {/* Ad + Small stacked (1 col) */}
        <div className="space-y-6 md:col-span-1">
          {/* Ad Placeholder */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border-none bg-[rgb(24_24_27/var(--tw-bg-opacity))] dark:bg-[rgb(24_24_27/var(--tw-bg-opacity))]">
            <Skeleton className="h-full w-full border-none" />
          </div>

          {/* Small Card */}
          <SmallNewsletterCardSkeleton />
        </div>
      </div>

      {/* Pattern 2: Three Small Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SmallNewsletterCardSkeleton />
        <SmallNewsletterCardSkeleton />
        <SmallNewsletterCardSkeleton />
      </div>

      {/* Pattern 3: Small & Ad stacked (1 col) + Large (2 cols) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Small & Ad stacked */}
        <div className="space-y-6 md:col-span-1">
          {/* Ad Placeholder */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border-none bg-[rgb(24_24_27/var(--tw-bg-opacity))] dark:bg-[rgb(24_24_27/var(--tw-bg-opacity))]">
            <Skeleton className="h-full w-full border-none" />
          </div>

          {/* Small Card */}
          <SmallNewsletterCardSkeleton />
        </div>

        {/* Large Card (2 cols) */}
        <div className="md:col-span-2">
          <LargeNewsletterCardSkeleton />
        </div>
      </div>
    </div>
  );
}

// Large Newsletter Card Skeleton
function LargeNewsletterCardSkeleton() {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border-none bg-[rgb(24_24_27/var(--tw-bg-opacity))] dark:bg-[rgb(24_24_27/var(--tw-bg-opacity))]">
      <Skeleton className="h-full w-full border-none" />
      <div className="absolute bottom-0 left-0 right-0 border-none bg-white/10 p-4 backdrop-blur-sm">
        <div className="mb-4 flex items-center space-x-4">
          <Skeleton className="h-8 w-20 rounded-full border-none" />
          <Skeleton className="h-8 w-20 rounded-full border-none" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full border-none bg-emerald-600/40" />
      </div>
    </div>
  );
}

// Small Newsletter Card Skeleton
function SmallNewsletterCardSkeleton() {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border-none bg-[rgb(24_24_27/var(--tw-bg-opacity))] dark:bg-[rgb(24_24_27/var(--tw-bg-opacity))]">
      <Skeleton className="h-full w-full border-none" />
      <div className="absolute bottom-0 left-0 right-0 border-none bg-white/10 p-3 backdrop-blur-sm">
        <div className="mb-3 flex items-center space-x-2">
          <Skeleton className="h-6 w-16 rounded-full border-none" />
          <Skeleton className="h-6 w-16 rounded-full border-none" />
        </div>
        <Skeleton className="h-8 w-28 rounded-full border-none bg-emerald-600/40" />
      </div>
    </div>
  );
}
