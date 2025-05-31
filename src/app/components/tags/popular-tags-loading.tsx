"use client";

export default function PopularTagsLoading() {
  // Use a fixed number of items instead of random
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
      ))}
    </div>
  );
}
