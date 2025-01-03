"use client";

import { Skeleton } from "@nextui-org/react";

import { Card } from "@/components/ui/card";

export const NewsletterPatternSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Row 1: [Large (2 cols)][Ad + Small stacked (1 col)] */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="relative w-full bg-content2">
            <div className="relative w-full pt-[132.35%]">
              <div className="absolute inset-0 m-3 overflow-hidden rounded-xl">
                <Skeleton className="absolute inset-0 rounded-xl">
                  <div className="h-full w-full bg-default-300" />
                </Skeleton>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-span-1 space-y-6">
          {/* Ad skeleton */}
          <Card className="relative w-full bg-content2">
            <div className="relative w-full pt-[100%]">
              <div className="absolute inset-0 m-3 overflow-hidden rounded-xl">
                <Skeleton className="absolute inset-0 rounded-xl">
                  <div className="h-full w-full bg-default-300" />
                </Skeleton>
              </div>
            </div>
          </Card>
          {/* Small card skeleton */}
          <Card className="relative w-full bg-content2">
            <div className="relative w-full pt-[132.35%]">
              <div className="absolute inset-0 m-3 overflow-hidden rounded-xl">
                <Skeleton className="absolute inset-0 rounded-xl">
                  <div className="h-full w-full bg-default-300" />
                </Skeleton>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Row 2: [Small][Small][Small] */}
      <div className="grid grid-cols-3 gap-6">
        {[0, 1, 2].map(i => (
          <div key={i} className="col-span-1">
            <Card className="relative w-full bg-content2">
              <div className="relative w-full pt-[132.35%]">
                <div className="absolute inset-0 m-3 overflow-hidden rounded-xl">
                  <Skeleton className="absolute inset-0 rounded-xl">
                    <div className="h-full w-full bg-default-300" />
                  </Skeleton>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Row 3: [Ad + Small stacked (1 col)][Large (2 cols)] */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          {/* Ad skeleton */}
          <Card className="relative w-full bg-content2">
            <div className="relative w-full pt-[100%]">
              <div className="absolute inset-0 m-3 overflow-hidden rounded-xl">
                <Skeleton className="absolute inset-0 rounded-xl">
                  <div className="h-full w-full bg-default-300" />
                </Skeleton>
              </div>
            </div>
          </Card>
          {/* Small card skeleton */}
          <Card className="relative w-full bg-content2">
            <div className="relative w-full pt-[132.35%]">
              <div className="absolute inset-0 m-3 overflow-hidden rounded-xl">
                <Skeleton className="absolute inset-0 rounded-xl">
                  <div className="h-full w-full bg-default-300" />
                </Skeleton>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-span-2">
          <Card className="relative w-full bg-content2">
            <div className="relative w-full pt-[132.35%]">
              <div className="absolute inset-0 m-3 overflow-hidden rounded-xl">
                <Skeleton className="absolute inset-0 rounded-xl">
                  <div className="h-full w-full bg-default-300" />
                </Skeleton>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
