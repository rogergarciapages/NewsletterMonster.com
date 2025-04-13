"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Spinner } from "@nextui-org/react";
import axios from "axios";

import NewsletterCard from "@/app/components/brand/newsletter/card";
import { Newsletter } from "@/app/components/brand/newsletter/types";

const NEWSLETTERS_PER_PAGE = 15;

export default function ExploreClient() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

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
          `/api/newsletters/explore?skip=${skip}&take=${NEWSLETTERS_PER_PAGE}`
        );

        const { newsletters: newNewsletters, pagination } = response.data;

        setNewsletters(prev => [...prev, ...newNewsletters]);
        setHasMore(pagination.hasMore);
      } catch (error) {
        console.error("Error fetching newsletters:", error);
        setError("Failed to load newsletters");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsletters();
  }, [page]);

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-4 py-8 md:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
          Explore Newsletters
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Discover the latest and most interesting newsletters from around the web, curated for you.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {newsletters.map((newsletter, index) => {
          const isLast = index === newsletters.length - 1;
          // Determine the correct brandname to use based on available data
          const brandname = newsletter.sender
            ? newsletter.sender.toLowerCase().replace(/ /g, "-")
            : "newsletter";

          return (
            <div
              key={newsletter.newsletter_id}
              ref={isLast ? lastNewsletterRef : null}
              className="overflow-hidden"
            >
              <NewsletterCard newsletter={newsletter} brandname={brandname} />
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div className="mt-8 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {!hasMore && newsletters.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">You've reached the end of the list.</p>
        </div>
      )}
    </div>
  );
}
