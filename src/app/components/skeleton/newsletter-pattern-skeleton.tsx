"use client";

import { Skeleton } from "@nextui-org/react";

export function NewsletterPatternSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800"
        >
          <div className="absolute inset-0">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-white/10 p-4 backdrop-blur-sm">
            <div className="mb-4 flex items-center space-x-4">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-32 rounded-full bg-emerald-600/40" />
          </div>
        </div>
      ))}
    </div>
  );
}
