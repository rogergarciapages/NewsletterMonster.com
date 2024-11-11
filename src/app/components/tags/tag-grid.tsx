"use client";

import dynamic from "next/dynamic";

import type { Newsletter } from "@/types/newsletter";

import { NewsletterCardSkeleton } from "../skeleton/newsletter-card-skeleton";

const NewsletterCardWrapper = dynamic(() => import("../newsletters/newsletter-card-wrapper"), {
  ssr: false,
  loading: () => <NewsletterCardSkeleton />,
});

export function NewsletterGrid({ newsletters }: { newsletters: Newsletter[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {newsletters.map(newsletter => (
        <div key={newsletter.newsletter_id}>
          <NewsletterCardWrapper newsletter={newsletter} />
        </div>
      ))}
    </div>
  );
}
