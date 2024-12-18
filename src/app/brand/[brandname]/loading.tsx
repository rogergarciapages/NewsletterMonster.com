"use client";

import { Card } from "@nextui-org/react";

import NewsletterGridSkeleton from "@/app/components/brand/newsletter/grid/skeleton";
import BrandProfileHeaderSkeleton from "@/app/components/brand/profile/header/skeleton";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";

export default function BrandPageLoading() {
  return (
    <ThreeColumnLayout>
      <div className="w-full space-y-4">
        {/* Brand Profile Header Skeleton */}
        <Card className="mt-4 border-none bg-background/60 dark:bg-default-100/50">
          <BrandProfileHeaderSkeleton />
        </Card>

        {/* Newsletters Grid Skeleton */}
        <NewsletterGridSkeleton />
      </div>
    </ThreeColumnLayout>
  );
}
