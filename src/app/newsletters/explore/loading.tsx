import { Skeleton } from "@nextui-org/react";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";

export default function ExploreNewslettersLoading() {
  return (
    <ThreeColumnLayout>
      <div className="px-4 py-8 md:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-3/4 rounded-lg md:w-1/2" />
          <Skeleton className="mx-auto h-6 w-full max-w-2xl rounded-lg" />
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-zinc-800"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="p-4">
                <Skeleton className="mb-2 h-6 w-3/4 rounded-lg" />
                <Skeleton className="mb-4 h-4 w-full rounded-lg" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
