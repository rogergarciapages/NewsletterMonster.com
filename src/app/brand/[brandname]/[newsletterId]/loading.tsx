// src/app/[brandname]/[newsletterId]/loading.tsx
import { Card, Skeleton } from "@nextui-org/react";

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

          {/* Newsletter Title Skeleton */}
          <Skeleton className="mb-6 h-12 w-3/4 rounded-lg border-none shadow-none" />

          {/* Date info only Skeleton */}
          <div className="mb-6 space-y-2 text-sm">
            <div className="grid grid-cols-[80px,1fr] items-center gap-x-2">
              <Skeleton className="h-6 w-[80px] rounded-lg border-none shadow-none" />
              <Skeleton className="h-6 w-64 rounded-lg border-none shadow-none" />
            </div>

            {/* Badges Skeleton */}
            <div className="flex gap-4 pt-4">
              {[1, 2].map(index => (
                <Skeleton key={index} className="h-16 w-16 rounded-full border-none shadow-none" />
              ))}
            </div>
          </div>

          {/* YouTube-style channel info skeleton */}
          <div className="mb-6 rounded-xl bg-zinc-800/50 p-6">
            {/* Left: Channel info skeleton (profile picture, name, follower count) */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full bg-zinc-700" />
                <div>
                  <Skeleton className="h-6 w-32 rounded-lg" />
                  <Skeleton className="mt-1 h-4 w-24 rounded-lg" />
                </div>
                <Skeleton className="ml-4 h-9 w-28 rounded-lg" />
              </div>

              {/* Right: Action buttons skeleton */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-10 w-28 rounded-lg" />
                <Skeleton className="h-10 w-28 rounded-lg" />
                <Skeleton className="h-10 w-28 rounded-lg" />
                <Skeleton className="h-10 w-28 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Key insights section skeleton */}
          <div className="mb-6 rounded-lg bg-zinc-900 p-6">
            <div className="mb-4 flex items-center">
              <Skeleton className="mr-2 h-6 w-6 rounded-full bg-amber-400/30" />
              <Skeleton className="h-7 w-48 rounded-lg" />
            </div>
            <Skeleton className="mb-4 h-4 w-64 rounded-lg bg-zinc-600/30" />
            <div className="space-y-3">
              <div className="flex items-start">
                <Skeleton className="mr-2 h-4 w-4 rounded-full" />
                <Skeleton className="h-6 w-full rounded-lg" />
              </div>
              <div className="flex items-start">
                <Skeleton className="mr-2 h-4 w-4 rounded-full" />
                <Skeleton className="h-6 w-full rounded-lg" />
              </div>
              <div className="flex items-start">
                <Skeleton className="mr-2 h-4 w-4 rounded-full" />
                <Skeleton className="h-6 w-full rounded-lg" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Skeleton className="h-5 w-40 rounded-lg bg-amber-400/20" />
            </div>
          </div>

          {/* Email toolbar skeleton */}
          <div className="mb-4 flex items-center justify-start rounded-xl bg-zinc-800/30 px-5 py-2">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 min-w-[110px] rounded-lg" />
              <Skeleton className="h-10 min-w-[110px] rounded-lg" />
              <Skeleton className="h-10 min-w-[110px] rounded-lg" />
              <Skeleton className="h-10 min-w-[110px] rounded-lg" />
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-4 space-y-8">
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

            {/* Bottom action buttons skeleton */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 min-w-[110px] rounded-lg" />
              <Skeleton className="h-10 min-w-[110px] rounded-lg" />
              <Skeleton className="h-10 min-w-[110px] rounded-lg" />
              <Skeleton className="h-10 min-w-[110px] rounded-lg" />
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

          {/* Related newsletters section skeleton */}
          <div className="mt-12 border-t border-zinc-800 pt-8">
            {/* Title skeleton */}
            <Skeleton className="mb-6 h-8 w-64 rounded-lg" />

            {/* Related newsletters grid skeleton */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="overflow-hidden rounded-lg">
                  <Skeleton className="h-40 w-full rounded-t-lg" />
                  <div className="rounded-b-lg bg-zinc-800 p-4">
                    <Skeleton className="mb-2 h-6 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </Card>
    </ThreeColumnLayout>
  );
}
