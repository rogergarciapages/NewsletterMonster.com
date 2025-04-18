"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@nextui-org/react";
import { useInView } from "react-intersection-observer";

import { NewsletterCard } from "@/app/components/newsletters/newsletter-card";
import { NewsletterCardSkeleton } from "@/app/components/skeleton/newsletter-card-skeleton";
import { Card } from "@/components/ui/card";
import { Newsletter } from "@/types/newsletter";

type MyFeedNewsletter = {
  newsletter_id: number;
  subject: string | null;
  sender: string | null;
  top_screenshot_url: string | null;
  likes_count: number | null;
  you_rocks_count: number | null;
  created_at: string | Date | null;
  Brand: {
    name: string;
    logo: string | null;
    slug: string;
  } | null;
};

export default function MyFeedClient() {
  const [newsletters, setNewsletters] = useState<MyFeedNewsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [noFollowedBrands, setNoFollowedBrands] = useState(false);
  const { ref, inView } = useInView();

  const fetchNewsletters = async (pageNum: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/newsletters/myfeed?page=${pageNum}&limit=12`);

      if (!response.ok) {
        throw new Error("Failed to fetch newsletters");
      }

      const data = await response.json();

      // Check if API returned empty because user doesn't follow any brands
      if (data.hasMore === false && data.newsletters.length === 0 && pageNum === 1) {
        setNoFollowedBrands(true);
      } else {
        setNoFollowedBrands(false);
      }

      if (pageNum === 1) {
        setNewsletters(data.newsletters);
      } else {
        setNewsletters(prev => [...prev, ...data.newsletters]);
      }

      setHasMore(data.hasMore);
      setError(null);
    } catch (err) {
      setError("Error loading newsletters. Please try again.");
      console.error("Error fetching newsletters:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters(1);
  }, []);

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      setPage(prev => {
        const nextPage = prev + 1;
        fetchNewsletters(nextPage);
        return nextPage;
      });
    }
  }, [inView, isLoading, hasMore]);

  const handleRefresh = () => {
    setPage(1);
    fetchNewsletters(1);
  };

  if (error) {
    return (
      <Card className="border-none bg-[rgb(24_24_27/var(--tw-bg-opacity))] p-8">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="mb-4 text-red-500">{error}</div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-md bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700"
          >
            <span className="h-5 w-5">↻</span>
            Retry
          </button>
        </div>
      </Card>
    );
  }

  if (noFollowedBrands) {
    return (
      <Card className="border-none bg-[rgb(24_24_27/var(--tw-bg-opacity))] p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">My Feed</h1>
          <p className="mt-4 max-w-xl text-pretty text-xl leading-snug tracking-tight text-gray-600 dark:text-gray-300">
            Follow brands to see their newsletters here
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="mb-4 text-2xl font-bold">You don't follow any brands yet!</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            Follow some brands to build your personalized feed of newsletters.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button as={Link} href="/trending" color="warning" size="lg" className="min-w-[200px]">
              Check Popular Newsletters
            </Button>
            <Button
              as={Link}
              href="/newsletters/explore"
              color="warning"
              size="lg"
              className="min-w-[200px]"
            >
              Go Explore
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (!isLoading && newsletters.length === 0) {
    return (
      <Card className="border-none bg-[rgb(24_24_27/var(--tw-bg-opacity))] p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">My Feed</h1>
          <p className="mt-4 max-w-xl text-pretty text-xl leading-snug tracking-tight text-gray-600 dark:text-gray-300">
            Follow brands to see their newsletters here
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="mb-4 text-2xl font-bold">No newsletters to show</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            Follow some brands to see their newsletters in your personalized feed.
          </p>
          <Link
            href="/brands"
            className="rounded-md bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700"
          >
            Explore Brands
          </Link>
        </div>
      </Card>
    );
  }

  if (isLoading && newsletters.length === 0) {
    return (
      <Card className="border-none bg-[rgb(24_24_27/var(--tw-bg-opacity))] p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">My Feed</h1>
          <p className="mt-4 max-w-xl text-pretty text-xl leading-snug tracking-tight text-gray-600 dark:text-gray-300">
            The latest newsletters from brands you follow
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NewsletterCardSkeleton />
          <NewsletterCardSkeleton />
          <NewsletterCardSkeleton />
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-32 border-none bg-[rgb(24_24_27/var(--tw-bg-opacity))] p-8">
      <div role="main" aria-label="My Feed Newsletters">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">My Feed</h1>
          <p className="mt-4 max-w-xl text-pretty text-xl leading-snug tracking-tight text-gray-600 dark:text-gray-300">
            The latest newsletters from brands you follow
          </p>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newsletters.map(newsletter => {
              const brandInfo = newsletter.Brand
                ? {
                    name: newsletter.Brand.name,
                    slug: newsletter.Brand.slug,
                    logo: newsletter.Brand.logo,
                  }
                : undefined;

              const displayNewsletter: Newsletter = {
                newsletter_id: newsletter.newsletter_id,
                user_id: null,
                sender: newsletter.Brand?.name || newsletter.sender,
                subject: newsletter.subject,
                top_screenshot_url: newsletter.top_screenshot_url,
                likes_count: newsletter.likes_count,
                you_rocks_count: newsletter.you_rocks_count,
                created_at: newsletter.created_at ? new Date(newsletter.created_at) : null,
                summary: null,
                brand_id: null,
                Brand: brandInfo,
              };

              return (
                <NewsletterCard key={newsletter.newsletter_id} newsletter={displayNewsletter} />
              );
            })}

            {isLoading && (
              <>
                <NewsletterCardSkeleton />
                <NewsletterCardSkeleton />
                <NewsletterCardSkeleton />
              </>
            )}
          </div>

          {hasMore && (
            <div ref={ref} className="mt-8 flex justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-zinc-500"></div>
            </div>
          )}

          {!hasMore && newsletters.length > 0 && (
            <div className="col-span-3 p-8 text-center text-gray-600 dark:text-gray-400">
              You&apos;ve seen all the newsletters in your feed 🎉
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
