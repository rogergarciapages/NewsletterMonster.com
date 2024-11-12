// src/app/components/tags/tag-grid.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import type { Newsletter } from "@/types/newsletter";

import { NewsletterCardSkeleton } from "../skeleton/newsletter-card-skeleton";

// src/app/components/tags/tag-grid.tsx

const NewsletterCard = dynamic(
  () => import("../newsletters/newsletter-card").then(mod => mod.NewsletterCard),
  {
    loading: () => <NewsletterCardSkeleton />,
    ssr: false, // Set to false to avoid hydration mismatch
  }
);

export function NewsletterGrid({ newsletters }: { newsletters: Newsletter[] }) {
  // Use client-side only rendering to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsletters.map((_, index) => (
          <NewsletterCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {newsletters.map(newsletter => (
        <div key={newsletter.newsletter_id} className="h-full">
          <NewsletterCard newsletter={newsletter} />
        </div>
      ))}
    </div>
  );
}
