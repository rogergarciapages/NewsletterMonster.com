"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@nextui-org/react";
import axios from "axios";

import { Newsletter } from "@/app/components/brand/newsletter/types";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
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
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const router = useRouter();

  const observerRef = useRef<IntersectionObserver>();

  const fetchNewsletters = async (pageNumber: number) => {
    try {
      setIsLoading(true);
      const skip = pageNumber * NEWSLETTERS_PER_PAGE;
      const response = await axios.get("/api/newsletters/by-tag", {
        params: {
          tagId: tag.id,
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

  useEffect(() => {
    fetchNewsletters(page);
  }, [page, tag.id]);

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

  if (isLoading && newsletters.length === 0) {
    return (
      <ThreeColumnLayout>
        <TrendingPageSkeleton />
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout>
      <div role="main" className="px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            {tag.name} Newsletters
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-200">
            {tag.count > 0 ? (
              <>
                Discover {tag.count} curated {tag.name.toLowerCase()} newsletters in our database.
              </>
            ) : (
              <>No newsletters found with this tag yet.</>
            )}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              You&apos;ve reached the end of {tag.name.toLowerCase()} newsletters.
            </div>
          )}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
