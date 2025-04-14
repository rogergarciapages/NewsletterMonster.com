// src/app/[brandname]/[newsletterId]/loading.tsx
import { Card, Skeleton } from "@nextui-org/react";

import NewsletterCardSkeleton from "@/app/components/brand/newsletter/card/skeleton";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";

export default function NewsletterPageSkeleton() {
  return (
    <ThreeColumnLayout>
      <Card
        className="border-none bg-[rgb(24_24_27/var(--tw-bg-opacity))] shadow-none"
        data-testid="newsletter-page-skeleton"
      >
        <article className="mx-auto max-w-5xl px-4 py-8">
          {/* Back Button Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-10 w-32 rounded-lg border-none shadow-none" />
          </div>

          {/* Email Toolbar Skeleton */}
          <div className="sticky top-0 z-10 mb-6 flex items-center justify-start bg-white/80 px-4 py-2.5 backdrop-blur-sm dark:bg-zinc-900/80">
            <div className="flex items-center gap-3">
              {/* Like Button Skeleton */}
              <Skeleton className="h-10 min-w-[110px] rounded-lg border-none shadow-none" />
              {/* You Rock Button Skeleton */}
              <Skeleton className="h-10 min-w-[110px] rounded-lg border-none shadow-none" />
              {/* Bookmark Button Skeleton */}
              <Skeleton className="h-10 min-w-[110px] rounded-lg border-none shadow-none" />
              {/* Share Button Skeleton */}
              <Skeleton className="h-10 min-w-[110px] rounded-lg border-none shadow-none" />
            </div>
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
            {/* Key insights section skeleton */}
            <div className="mb-6 rounded-lg bg-zinc-800 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-48 rounded-lg" />
              </div>
              <Skeleton className="mb-3 h-6 w-full rounded-lg" />
              <Skeleton className="mb-3 h-6 w-full rounded-lg" />
              <Skeleton className="h-6 w-full rounded-lg" />
            </div>

            {/* Summary section skeleton */}
            <div className="mb-6 rounded-lg bg-zinc-800 p-6">
              <Skeleton className="mb-2 h-6 w-40 rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>

            {/* Newsletter Screenshot */}
            <div className="overflow-hidden rounded-lg shadow-none">
              <Skeleton className="aspect-auto h-96 w-full rounded-lg border-none shadow-none" />
            </div>

            {/* Newsletter Content Iframe Placeholder */}
            <div>
              <Skeleton className="mb-4 h-8 w-64 rounded-lg border-none shadow-none" />
              <div className="overflow-hidden rounded-lg shadow-none">
                <Skeleton className="h-[500px] w-full rounded-lg border-none shadow-none" />
              </div>
              <div className="mt-4">
                <Skeleton className="mb-3 h-8 w-64 rounded-lg border-none shadow-none" />
                <Skeleton className="mb-4 h-4 w-full rounded-lg border-none shadow-none" />
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-10 w-36 rounded-lg border-none shadow-none" />
                  <Skeleton className="h-10 w-36 rounded-lg border-none shadow-none" />
                </div>
              </div>
            </div>

            {/* Bottom Action Buttons Skeleton */}
            <div className="mt-8 flex items-center gap-3">
              {/* Like Button Skeleton */}
              <Skeleton className="h-10 min-w-[110px] rounded-lg border-none shadow-none" />
              {/* You Rock Button Skeleton */}
              <Skeleton className="h-10 min-w-[110px] rounded-lg border-none shadow-none" />
              {/* Bookmark Button Skeleton */}
              <Skeleton className="h-10 min-w-[110px] rounded-lg border-none shadow-none" />
              {/* Share Button Skeleton */}
              <Skeleton className="h-10 min-w-[110px] rounded-lg border-none shadow-none" />
            </div>

            {/* Engagement Metrics */}
            <div className="flex space-x-6">
              <Skeleton className="h-6 w-24 rounded-lg border-none shadow-none" />
              <Skeleton className="h-6 w-24 rounded-lg border-none shadow-none" />
            </div>

            {/* Products Link */}
            <div className="mt-6">
              <Skeleton className="mb-3 h-8 w-64 rounded-lg border-none shadow-none" />
              <Skeleton className="mb-4 h-4 w-full rounded-lg border-none shadow-none" />
              <div className="flex items-center">
                <Skeleton className="h-10 w-48 rounded-lg border-none shadow-none" />
              </div>
            </div>
          </div>

          {/* Related Newsletters Skeletons - Show fewer skeletons to reduce page weight */}
          <div className="mt-12 border-t border-zinc-800 pt-8">
            {/* Brand newsletters section */}
            <div className="mb-10">
              <Skeleton className="mb-6 h-10 w-64 rounded-lg border-none shadow-none" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(1)].map((_, i) => (
                  <NewsletterCardSkeleton key={`brand-${i}`} />
                ))}
              </div>
            </div>

            {/* Category newsletters section - Hidden until content is loaded */}
            <div className="mt-10">
              <Skeleton className="mb-6 h-10 w-64 rounded-lg border-none shadow-none" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(1)].map((_, i) => (
                  <NewsletterCardSkeleton key={`category-${i}`} />
                ))}
              </div>
            </div>
          </div>
        </article>
      </Card>
    </ThreeColumnLayout>
  );
}
