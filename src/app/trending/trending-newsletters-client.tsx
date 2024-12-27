// src/app/trending/trending-newsletters-client.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@nextui-org/react";
import axios from "axios";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { NewsletterCard } from "@/app/components/newsletters/newsletter-card";
import { NewsletterCardSkeleton } from "@/app/components/skeleton/newsletter-card-skeleton";
import { TrendingPageSkeleton } from "@/app/components/skeleton/trending-page-skeleton";
import { Newsletter } from "@/types/newsletter";

// src/app/trending/trending-newsletters-client.tsx

const NEWSLETTERS_PER_PAGE = 15;

export default function TrendingNewslettersClient() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  // Reference for our observer
  const observerRef = useRef<IntersectionObserver>();

  const fetchNewsletters = async (pageNumber: number) => {
    try {
      const skip = pageNumber * NEWSLETTERS_PER_PAGE;
      const response = await axios.get("/api/newsletters/trending", {
        params: {
          skip,
          take: NEWSLETTERS_PER_PAGE,
        },
      });

      const newNewsletters = response.data;

      if (newNewsletters.length < NEWSLETTERS_PER_PAGE) {
        setHasMore(false);
      }

      setNewsletters(prev => (pageNumber === 0 ? newNewsletters : [...prev, ...newNewsletters]));
    } catch (error) {
      console.error("Error fetching newsletters:", error);
      setError("Failed to fetch newsletters. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Callback for intersection observer
  const lastNewsletterCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Initial load
  useEffect(() => {
    fetchNewsletters(page);
  }, [page]);

  if (error) {
    return (
      <ThreeColumnLayout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-4">
          <div className="mb-4 text-red-500">{error}</div>
          <Button
            color="primary"
            onClick={() => {
              setError(null);
              setPage(0);
              fetchNewsletters(0);
            }}
          >
            Try Again
          </Button>
        </div>
      </ThreeColumnLayout>
    );
  }

  // Show skeleton while loading initial data
  if (isLoading && newsletters.length === 0) {
    return (
      <ThreeColumnLayout>
        <TrendingPageSkeleton />
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout>
      <div role="main" aria-label="Trending Newsletters">
        <h1 className="sr-only">Trending Newsletters</h1>
        <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
          {newsletters.map((newsletter, index) => (
            <div
              ref={index === newsletters.length - 1 ? lastNewsletterCallback : null}
              key={newsletter.newsletter_id}
            >
              <article>
                <NewsletterCard newsletter={newsletter} priority={index < 6} />
              </article>
            </div>
          ))}

          {isLoading && (
            <div className="col-span-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <NewsletterCardSkeleton key={`loading-${index}`} />
              ))}
            </div>
          )}

          {!hasMore && newsletters.length > 0 && (
            <div className="col-span-1 p-8 text-center text-gray-600 md:col-span-2 lg:col-span-3">
              You&apos;ve reached the end of trending newsletters.
            </div>
          )}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
