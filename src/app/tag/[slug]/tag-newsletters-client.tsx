"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import axios from "axios";

import { Newsletter } from "@/app/components/brand/newsletter/types";
import { NewsletterCard } from "@/app/components/newsletters/newsletter-card";
import { NewsletterCardSkeleton } from "@/app/components/skeleton/newsletter-card-skeleton";
import { TrendingPageSkeleton } from "@/app/components/skeleton/trending-page-skeleton";

interface TagNewslettersClientProps {
  tag: {
    id: number;
    name: string;
    slug: string;
    count: number;
  };
}

const NEWSLETTERS_PER_PAGE = 15;

export default function TagNewslettersClient({ tag }: TagNewslettersClientProps) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const _router = useRouter();

  const lastNewsletterRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        setIsLoading(true);
        const skip = (page - 1) * NEWSLETTERS_PER_PAGE;
        const response = await axios.get(
          `/api/newsletters/by-tag?tagId=${tag.id}&skip=${skip}&take=${NEWSLETTERS_PER_PAGE}`
        );
        const newNewsletters = response.data;

        setNewsletters(prev => [...prev, ...newNewsletters]);
        setHasMore(newNewsletters.length === NEWSLETTERS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching newsletters:", error);
        setError("Failed to load newsletters");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsletters();
  }, [tag.id, page]);

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  if (isLoading && newsletters.length === 0) {
    return <TrendingPageSkeleton />;
  }

  return (
    <div className="px-4 py-8 md:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
          {tag.name} Newsletters
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Browse our curated collection of {tag.count}+ {tag.name.toLowerCase()} newsletters and
          email subscriptions.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {newsletters.map((newsletter, index) => {
          const isLast = index === newsletters.length - 1;
          return (
            <div key={newsletter.newsletter_id} ref={isLast ? lastNewsletterRef : null}>
              <NewsletterCard newsletter={newsletter} />
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <NewsletterCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!hasMore && newsletters.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No more newsletters to load.</p>
        </div>
      )}
    </div>
  );
}
