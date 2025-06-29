"use client";

import { useEffect, useState } from "react";

import type { Newsletter } from "@/types/newsletter";

import { NewsletterCardSkeleton } from "../skeleton/newsletter-card-skeleton";
import { NewsletterCard } from "./newsletter-card";

export default function NewsletterCardWrapper({ newsletter }: { newsletter: Newsletter }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <NewsletterCardSkeleton />;
  }

  // Return the newsletter card with a specific no-gap wrapper
  return (
    <div className="no-gap-wrapper">
      <style jsx>{`
        .no-gap-wrapper :global(.border) {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
        .no-gap-wrapper :global(.border > div) {
          margin-top: 0 !important;
        }
      `}</style>
      <NewsletterCard newsletter={newsletter} priority={true} />
    </div>
  );
}
