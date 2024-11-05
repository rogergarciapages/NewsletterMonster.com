// src/app/[brandname]/[newsletterId]/loading.tsx
import { Skeleton } from "@nextui-org/react";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";

export default function NewsletterPageSkeleton() {
  return (
    <ThreeColumnLayout>
      <article className="mx-auto max-w-3xl px-4 py-8">
        {/* Back Button Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Header Section */}
        <header className="mb-8 border-b-5 border-torch-600 pb-4">
          {/* Title Skeleton */}
          <Skeleton className="mb-4 h-12 w-3/4 rounded-lg" />

          {/* Metadata Grid */}
          <div className="space-y-2 text-[20px] leading-tight">
            <div className="flex flex-col gap-2">
              {/* Sender Info */}
              <div className="grid grid-cols-[auto,1fr] items-center gap-x-2">
                <Skeleton className="h-6 w-[110px] rounded-lg" />
                <Skeleton className="h-6 w-48 rounded-lg" />
              </div>

              {/* Date Info */}
              <div className="grid grid-cols-[auto,1fr] items-center gap-x-2">
                <Skeleton className="h-6 w-[110px] rounded-lg" />
                <Skeleton className="h-6 w-36 rounded-lg" />
              </div>
            </div>

            {/* Tags Skeleton */}
            <div className="flex flex-wrap gap-2 pt-8">
              {[1, 2, 3].map(index => (
                <Skeleton key={index} className="h-6 w-24 rounded-full" />
              ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="mt-4 space-y-8">
          {/* Summary Section */}
          <div className="prose max-w-none rounded-lg">
            <Skeleton className="mb-4 h-8 w-64 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-5/6 rounded-lg" />
              <Skeleton className="h-4 w-4/6 rounded-lg" />
            </div>
          </div>

          {/* Newsletter Screenshot */}
          <div className="overflow-hidden rounded-lg shadow-lg">
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          </div>

          {/* Engagement Metrics */}
          <div className="flex space-x-6">
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-lg" />
          </div>

          {/* Newsletter Content Iframe Placeholder */}
          <div className="overflow-hidden rounded-lg shadow-lg">
            <Skeleton className="h-[800px] w-full rounded-lg" />
          </div>

          {/* Products Link */}
          <Skeleton className="h-6 w-32 rounded-lg" />
        </div>
      </article>
    </ThreeColumnLayout>
  );
}
