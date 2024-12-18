"use client";

import { useEffect, useState } from "react";

import { useInView } from "react-intersection-observer";

import NewsletterCard from "./card";
import { Newsletter } from "./types";

interface NewsletterGridProps {
  initialNewsletters: Newsletter[];
  brandname: string;
}

const ITEMS_PER_PAGE = 12;

export default function NewsletterGrid({ initialNewsletters, brandname }: NewsletterGridProps) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>(initialNewsletters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  // Keep track of seen newsletter IDs to prevent duplicates
  const [seenIds] = useState(new Set(initialNewsletters.map(n => n.newsletter_id)));

  useEffect(() => {
    const loadMore = async () => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/brands/${brandname}/newsletters?page=${page}&limit=${ITEMS_PER_PAGE}`
        );
        const data = await response.json();

        // Filter out any newsletters we've already seen
        const newNewsletters = data.newsletters.filter(
          (newsletter: Newsletter) => !seenIds.has(newsletter.newsletter_id)
        );

        // Update seen IDs
        newNewsletters.forEach((newsletter: Newsletter) => {
          seenIds.add(newsletter.newsletter_id);
        });

        if (newNewsletters.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }

        setNewsletters(prev => [...prev, ...newNewsletters]);
        setPage(prev => prev + 1);
      } catch (error) {
        console.error("Error loading more newsletters:", error);
      } finally {
        setLoading(false);
      }
    };

    if (inView) {
      loadMore();
    }
  }, [inView, loading, hasMore, page, brandname, seenIds]);

  // Create a unique key combining newsletter ID and position
  const getUniqueKey = (newsletter: Newsletter, index: number) =>
    `${newsletter.newsletter_id}-${index}`;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {newsletters.map((newsletter, index) => (
        <NewsletterCard
          key={getUniqueKey(newsletter, index)}
          newsletter={newsletter}
          brandname={brandname}
          priority={index < 3}
        />
      ))}
      {newsletters.length === 0 && (
        <div className="col-span-full text-center text-gray-500">
          No newsletters found for this brand.
        </div>
      )}
      {hasMore && (
        <div ref={ref} className="col-span-full flex justify-center p-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
