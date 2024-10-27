import { Card, Skeleton } from "@nextui-org/react";

export const NewsletterCardSkeleton = () => {
    return (
      <Card className="relative h-[650px] p-4"> {/* Updated height to match */}
        <Skeleton className="rounded-xl w-full h-[580px]" /> {/* Adjusted height */}
        <div className="mt-4 space-y-3">
          <Skeleton className="w-3/4 rounded-lg h-8" />
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Skeleton className="w-20 h-8 rounded-full" />
              <Skeleton className="w-20 h-8 rounded-full" />
            </div>
            <Skeleton className="w-32 h-8 rounded-full" />
          </div>
        </div>
      </Card>
    );
  };