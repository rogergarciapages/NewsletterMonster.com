// src/app/trending/trending-newsletters-client.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Badge as BadgeType } from "@prisma/client";
import axios from "axios";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { NewsletterCard } from "@/app/components/newsletters/newsletter-card";
import { NewsletterCardSkeleton } from "@/app/components/skeleton/newsletter-card-skeleton";
import { Newsletter } from "@/types/newsletter";

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

const NEWSLETTERS_PER_PAGE = 15;

interface NewsletterWithBadges extends Newsletter {
  badges?: BadgeType[];
}

export default function TrendingNewslettersClient() {
  const [newsletters, setNewsletters] = useState<NewsletterWithBadges[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
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

      // Fetch badges for each newsletter
      const newslettersWithBadges = await Promise.all(
        newNewsletters.map(async (newsletter: Newsletter) => {
          try {
            const badgesResponse = await fetch(
              `/api/badges/newsletter/${newsletter.newsletter_id}`
            );
            if (badgesResponse.ok) {
              const badges = await badgesResponse.json();
              return { ...newsletter, badges };
            }
          } catch (error) {
            console.error("Error fetching badges:", error);
          }
          return { ...newsletter, badges: [] };
        })
      );

      if (newslettersWithBadges.length < NEWSLETTERS_PER_PAGE) {
        setHasMore(false);
      }

      setNewsletters(prev =>
        pageNumber === 0 ? newslettersWithBadges : [...prev, ...newslettersWithBadges]
      );
    } catch (error) {
      console.error("Error fetching newsletters:", error);
    } finally {
      setLoading(false);
    }
  };

  // Callback for intersection observer
  const lastNewsletterCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchNewsletters(page);
  }, [page]);

  if (loading && newsletters.length === 0) {
    return (
      <ThreeColumnLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        </div>
      </ThreeColumnLayout>
    );
  }

  // Count how many large tiles we've used so far
  let largeTilesUsed = 0;

  return (
    <ThreeColumnLayout>
      <div role="main" aria-label="Trending Newsletters">
        <h1 className="mb-8 text-3xl font-bold">Trending Newsletters</h1>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {newsletters.map((newsletter, index) => {
            // Check if this newsletter has badges
            const hasBadges = newsletter.badges && newsletter.badges.length > 0;

            // Dynamic sizing logic:
            // 1. Newsletters with badges always get priority for large tiles
            // 2. Every 6th newsletter (after handling badges) gets large tile for visual interest
            // 3. First newsletter is always large for hero effect
            const shouldBeLarge =
              hasBadges || // Badge newsletters are large
              index === 0 || // First newsletter is large
              (!hasBadges && (index + 1) % 6 === 0); // Every 6th non-badge newsletter is large

            return (
              <div
                ref={index === newsletters.length - 1 ? lastNewsletterCallback : null}
                key={newsletter.newsletter_id}
                className={`relative transition-all duration-300 ${
                  shouldBeLarge
                    ? "col-span-2 md:col-span-2" // Takes 2 columns on all screens
                    : "col-span-1" // Takes 1 column on all screens
                }`}
              >
                <div className="relative pt-[132.35%]">
                  <div className="absolute inset-0">
                    <NewsletterCard
                      newsletter={newsletter}
                      priority={index < 4}
                      showBadges={true}
                      isLarge={shouldBeLarge}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="col-span-2 md:col-span-3">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={`loading-${index}`} className="col-span-1">
                    <NewsletterCardSkeleton />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasMore && newsletters.length > 0 && (
            <div className="col-span-2 p-8 text-center text-gray-600 md:col-span-3">
              You&apos;re all caught up 🏁
            </div>
          )}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
