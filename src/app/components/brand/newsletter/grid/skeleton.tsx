"use client";

import NewsletterCardSkeleton from "../card/skeleton";

// Memoize the skeleton since it never changes
const NewsletterGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <NewsletterCardSkeleton key={i} />
      ))}
    </div>
  );
};

NewsletterGridSkeleton.displayName = "NewsletterGridSkeleton";

export default NewsletterGridSkeleton;
