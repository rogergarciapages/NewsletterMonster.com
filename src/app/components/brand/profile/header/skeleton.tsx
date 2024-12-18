"use client";

import { CardBody, Skeleton } from "@nextui-org/react";

// Memoize the skeleton since it never changes
const BrandProfileHeaderSkeleton = () => {
  return (
    <CardBody className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row">
        {/* Logo Skeleton */}
        <div className="flex-shrink-0">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>

        {/* Main Content Column */}
        <div className="ml-6 flex-grow">
          {/* Brand Name Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-12 w-64 rounded-lg sm:h-14" />
            <Skeleton className="h-6 w-20 rounded-lg" />
          </div>

          {/* Description Skeleton */}
          <div className="mt-4 max-w-2xl">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="mt-2 h-4 w-3/4 rounded-lg" />
          </div>

          {/* Stats and Buttons Row */}
          <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-start gap-1">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-4 w-20 rounded-lg" />
              </div>
              <div className="flex flex-col items-start gap-1">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-4 w-20 rounded-lg" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex w-full flex-col gap-2 md:w-[160px]">
              <Skeleton className="h-[44px] w-full rounded-lg" />
              <Skeleton className="h-[44px] w-full rounded-lg" />
            </div>
          </div>

          {/* Website Link Skeleton */}
          <div className="mt-4">
            <Skeleton className="h-6 w-48 rounded-lg" />
          </div>

          {/* Social Links Skeleton */}
          <div className="mt-4 flex space-x-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-5 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </CardBody>
  );
};

BrandProfileHeaderSkeleton.displayName = "BrandProfileHeaderSkeleton";

export default BrandProfileHeaderSkeleton;
