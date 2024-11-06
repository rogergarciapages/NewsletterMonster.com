// src/app/components/brand/profile/header/loading.tsx
import { Skeleton } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="rounded-lg">
        <div className="h-32 w-full" />
      </Skeleton>
      <div className="space-y-2">
        <Skeleton className="rounded-lg">
          <div className="h-6 w-48" />
        </Skeleton>
        <Skeleton className="rounded-lg">
          <div className="h-4 w-32" />
        </Skeleton>
      </div>
    </div>
  );
}
