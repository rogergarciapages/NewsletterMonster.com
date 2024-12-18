"use client";

import { useEffect, useState } from "react";

import { Card } from "@nextui-org/react";
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

  useEffect(() => {
    const loadMore = async () => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/brands/${brandname}/newsletters?page=${page}&limit=${ITEMS_PER_PAGE}`
        );
        const data = await response.json();

        if (data.newsletters.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }

        setNewsletters(prev => [...prev, ...data.newsletters]);
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
  }, [inView, loading, hasMore, page, brandname]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {newsletters.map(newsletter => (
        <NewsletterCard
          key={newsletter.newsletter_id}
          newsletter={newsletter}
          brandname={brandname}
        />
      ))}
      {newsletters.length === 0 && (
        <Card className="col-span-full border-none bg-background/60 p-6 text-center dark:bg-default-100/50">
          <p className="text-default-500">No newsletters found for this brand.</p>
        </Card>
      )}
      {hasMore && (
        <div ref={ref} className="col-span-full flex justify-center p-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
