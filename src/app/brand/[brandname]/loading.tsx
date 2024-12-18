"use client";

import { Card, CardBody, Skeleton } from "@nextui-org/react";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";

export default function BrandLoading() {
  return (
    <ThreeColumnLayout>
      <div className="w-full space-y-4">
        {/* Header Skeleton */}
        <Card className="border-none bg-background/60 dark:bg-default-100/50">
          <CardBody className="gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-3/5 rounded-lg" />
                <Skeleton className="h-4 w-4/5 rounded-lg" />
              </div>
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          </CardBody>
        </Card>

        {/* Newsletter Cards Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-zinc-800"
            >
              {/* Image Section */}
              <div className="relative">
                <Skeleton className="aspect-[1.91/1] w-full" />
              </div>

              {/* Content Section */}
              <CardBody className="flex flex-col gap-3 p-4">
                <Skeleton className="h-6 w-4/5 rounded-lg" /> {/* Title */}
                <Skeleton className="h-4 w-full rounded-lg" /> {/* Summary */}
                <Skeleton className="h-4 w-2/3 rounded-lg" /> {/* Summary continued */}
                {/* Footer Section */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
                    <Skeleton className="h-4 w-24 rounded-lg" /> {/* Name */}
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-8 w-16 rounded-lg" /> {/* Action button */}
                    <Skeleton className="h-8 w-16 rounded-lg" /> {/* Action button */}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
