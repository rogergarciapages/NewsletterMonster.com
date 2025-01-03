"use client";

import { Skeleton } from "@nextui-org/react";

import { Card } from "@/components/ui/card";

// Helper component for consistent small card skeletons
const SmallCardSkeleton = () => (
  <Card className="relative w-full bg-content2">
    <div className="relative w-full pt-[132.35%]">
      <div className="absolute inset-0 m-3 overflow-hidden rounded-xl">
        <Skeleton className="absolute inset-0 rounded-xl">
          <div className="h-full w-full bg-default-300" />
        </Skeleton>
      </div>
    </div>
  </Card>
);

// Helper component for consistent large card skeletons
const LargeCardSkeleton = () => (
  <Card className="relative w-full bg-content2">
    <div className="relative w-full pt-[132.35%]">
      <div className="absolute inset-0 m-3 overflow-hidden rounded-xl">
        <Skeleton className="absolute inset-0 rounded-xl">
          <div className="h-full w-full bg-default-300" />
        </Skeleton>
      </div>
    </div>
  </Card>
);

// Helper component for consistent ad card skeletons - keeping square aspect ratio for ads
const AdCardSkeleton = () => (
  <Card className="relative w-full bg-content2">
    <div className="relative w-full pt-[100%]">
      <div className="absolute inset-0 m-3 overflow-hidden rounded-xl">
        <Skeleton className="absolute inset-0 rounded-xl">
          <div className="h-full w-full bg-default-300" />
        </Skeleton>
      </div>
    </div>
  </Card>
);

export const NewsletterPatternSkeleton = () => {
  return (
    <div className="grid auto-rows-auto gap-6">
      {/* Row 1: [Large (2 cols)][Ad + Small stacked (1 col)] */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <LargeCardSkeleton />
        </div>
        <div className="col-span-1 grid gap-6">
          <AdCardSkeleton />
          <SmallCardSkeleton />
        </div>
      </div>

      {/* Row 2: [Small][Small][Small] */}
      <div className="grid grid-cols-3 gap-6">
        {[0, 1, 2].map(i => (
          <div key={i} className="col-span-1">
            <SmallCardSkeleton />
          </div>
        ))}
      </div>

      {/* Row 3: [Ad + Small stacked (1 col)][Large (2 cols)] */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 grid gap-6">
          <AdCardSkeleton />
          <SmallCardSkeleton />
        </div>
        <div className="col-span-2">
          <LargeCardSkeleton />
        </div>
      </div>
    </div>
  );
};
