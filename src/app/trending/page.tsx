// src/app/trending/page.tsx
"use client";

import { Button } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Newsletter } from "../components/brand/newsletter/types";
import ThreeColumnLayout from "../components/layouts/three-column-layout";
import { NewsletterCard } from "../components/newsletters/newsletter-card";
import { NewsletterCardSkeleton } from "../components/skeleton/newsletter-card-skeleton";
import { TrendingPageSkeleton } from "../components/skeleton/trending-page-skeleton";

const NEWSLETTERS_PER_PAGE = 15;

export default function TrendingNewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const router = useRouter();

  // Reference for our observer
  const observerRef = useRef<IntersectionObserver>();

  const fetchNewsletters = async (pageNumber: number) => {
    try {
      const skip = pageNumber * NEWSLETTERS_PER_PAGE;
      const response = await axios.get("/api/newsletters/trending", {
        params: { 
          skip,
          take: NEWSLETTERS_PER_PAGE,
        }
      });

      const newNewsletters = response.data;
      
      if (newNewsletters.length < NEWSLETTERS_PER_PAGE) {
        setHasMore(false);
      }

      setNewsletters(prev => pageNumber === 0 ? newNewsletters : [...prev, ...newNewsletters]);
    } catch (error) {
      console.error("Error fetching newsletters:", error);
      setError("Failed to fetch newsletters. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Callback for intersection observer
  const lastNewsletterCallback = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore]);

  // Initial load
  useEffect(() => {
    fetchNewsletters(page);
  }, [page]);

  if (error) {
    return (
      <ThreeColumnLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
          <div className="text-red-500 mb-4">{error}</div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {newsletters.map((newsletter, index) => (
          <div
            ref={index === newsletters.length - 1 ? lastNewsletterCallback : null}
            key={newsletter.newsletter_id}
          >
            <NewsletterCard
              newsletter={newsletter}
              priority={index < 6}
            />
          </div>
        ))}
        
        {/* Show additional skeletons while loading more */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 col-span-full">
            {Array.from({ length: 3 }).map((_, index) => (
              <NewsletterCardSkeleton key={`loading-${index}`} />
            ))}
          </div>
        )}

        {!hasMore && newsletters.length > 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center p-8 text-gray-600">
            You've reached the end of trending newsletters.
          </div>
        )}
      </div>
    </ThreeColumnLayout>
  );
}