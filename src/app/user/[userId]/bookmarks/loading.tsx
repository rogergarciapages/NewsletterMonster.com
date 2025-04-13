"use client";

import { Skeleton } from "@nextui-org/react";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";

export default function BookmarksLoading() {
  return (
    <ThreeColumnLayout>
      <div className="px-4 py-8 md:px-6 lg:px-8">
        <header className="mb-12">
          <Skeleton className="mb-4 h-10 w-64 rounded-lg" />
          <Skeleton className="h-6 w-80 rounded-lg" />
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-zinc-800"
            >
              {/* Image skeleton with natural height */}
              <Skeleton className="h-64 w-full rounded-none" />

              <div className="p-4">
                <Skeleton className="mb-2 h-6 w-3/4 rounded-lg" />
                <Skeleton className="mb-4 h-4 w-full rounded-lg" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
