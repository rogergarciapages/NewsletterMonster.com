"use client";

import { Card, CardBody, CardFooter, CardHeader, Skeleton } from "@nextui-org/react";

export function NewsletterPatternSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="h-full overflow-hidden">
          <CardHeader className="p-0">
            <Skeleton className="h-48 w-full rounded-none" />
          </CardHeader>
          <CardBody className="flex flex-col gap-2 p-4">
            <Skeleton className="h-4 w-1/3 rounded-lg" />
            <Skeleton className="h-6 w-full rounded-lg" />
            <Skeleton className="h-6 w-full rounded-lg" />
            <Skeleton className="h-4 w-4/5 rounded-lg" />
          </CardBody>
          <CardFooter className="flex items-center justify-between border-t p-4">
            <Skeleton className="h-3 w-1/3 rounded-lg" />
            <Skeleton className="h-3 w-1/4 rounded-lg" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
