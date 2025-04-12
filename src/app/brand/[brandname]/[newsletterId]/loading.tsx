// src/app/[brandname]/[newsletterId]/loading.tsx
import { Card, Skeleton } from "@nextui-org/react";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";

export default function NewsletterPageSkeleton() {
  return (
    <ThreeColumnLayout>
      <Card className="border-none bg-[rgb(24_24_27/var(--tw-bg-opacity))] shadow-none">
        <article className="mx-auto max-w-3xl px-4 py-8">
          {/* Back Button Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-32 rounded-lg border-none shadow-none" />
          </div>

          {/* Header Section */}
          <header className="mb-8 border-0 pb-4">
            {/* Title Skeleton */}
            <Skeleton className="mb-4 h-12 w-3/4 rounded-lg border-none shadow-none" />

            {/* Metadata Grid */}
            <div className="space-y-2 text-[20px] leading-tight">
              <div className="flex flex-col gap-2">
                {/* Sender Info */}
                <div className="grid grid-cols-[auto,1fr] items-center gap-x-2">
                  <Skeleton className="h-6 w-[110px] rounded-lg border-none shadow-none" />
                  <Skeleton className="h-6 w-48 rounded-lg border-none shadow-none" />
                </div>

                {/* Date Info */}
                <div className="grid grid-cols-[auto,1fr] items-center gap-x-2">
                  <Skeleton className="h-6 w-[110px] rounded-lg border-none shadow-none" />
                  <Skeleton className="h-6 w-36 rounded-lg border-none shadow-none" />
                </div>
              </div>

              {/* Tags Skeleton */}
              <div className="flex flex-wrap gap-2 pt-8">
                {[1, 2, 3].map(index => (
                  <Skeleton key={index} className="h-6 w-24 rounded-full border-none shadow-none" />
                ))}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="mt-4 space-y-8">
            {/* Summary Section */}
            <div className="prose max-w-none rounded-lg">
              <Skeleton className="mb-4 h-8 w-64 rounded-lg border-none shadow-none" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-lg border-none shadow-none" />
                <Skeleton className="h-4 w-5/6 rounded-lg border-none shadow-none" />
                <Skeleton className="h-4 w-4/6 rounded-lg border-none shadow-none" />
              </div>
            </div>

            {/* Newsletter Screenshot */}
            <div className="overflow-hidden rounded-lg shadow-none">
              <Skeleton className="aspect-[3/4] w-full rounded-lg border-none shadow-none" />
            </div>

            {/* Engagement Metrics */}
            <div className="flex space-x-6">
              <Skeleton className="h-6 w-24 rounded-lg border-none shadow-none" />
              <Skeleton className="h-6 w-24 rounded-lg border-none shadow-none" />
            </div>

            {/* Newsletter Content Iframe Placeholder */}
            <div className="overflow-hidden rounded-lg shadow-none">
              <Skeleton className="h-[800px] w-full rounded-lg border-none shadow-none" />
            </div>

            {/* Products Link */}
            <Skeleton className="h-6 w-32 rounded-lg border-none shadow-none" />
          </div>
        </article>
      </Card>
    </ThreeColumnLayout>
  );
}
