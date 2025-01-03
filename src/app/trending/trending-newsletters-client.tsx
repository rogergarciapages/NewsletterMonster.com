// src/app/trending/trending-newsletters-client.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Badge as BadgeType } from "@prisma/client";
import axios from "axios";

import { AdCard } from "@/app/components/ads/ad-card";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { LargeNewsletterCard } from "@/app/components/newsletters/large-newsletter-card";
import { SmallNewsletterCard } from "@/app/components/newsletters/small-newsletter-card";
import { NewsletterPatternSkeleton } from "@/app/components/skeleton/newsletter-pattern-skeleton";
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

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

// src/app/trending/trending-newsletters-client.tsx

const NEWSLETTERS_PER_PAGE = 30;

interface NewsletterWithBadges extends Newsletter {
  badges?: BadgeType[];
}

export default function TrendingNewslettersClient() {
  const [badgedNewsletters, setBadgedNewsletters] = useState<NewsletterWithBadges[]>([]);
  const [regularNewsletters, setRegularNewsletters] = useState<NewsletterWithBadges[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observerRef = useRef<IntersectionObserver>();
  const processedNewsletterIds = useRef(new Set<number>());

  const fetchNewsletters = async (pageNumber: number) => {
    try {
      setLoading(true);
      const skip = pageNumber * NEWSLETTERS_PER_PAGE;
      const response = await axios.get("/api/newsletters/trending", {
        params: {
          skip,
          take: NEWSLETTERS_PER_PAGE,
        },
      });

      const newNewsletters = response.data;
      const newslettersWithBadges = await Promise.all(
        newNewsletters
          .filter(
            (newsletter: Newsletter) =>
              !processedNewsletterIds.current.has(newsletter.newsletter_id)
          )
          .map(async (newsletter: Newsletter) => {
            processedNewsletterIds.current.add(newsletter.newsletter_id);
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

      // Separate newsletters into badged and regular
      const { badged, regular } = newslettersWithBadges.reduce(
        (acc, newsletter) => {
          if (newsletter.badges && newsletter.badges.length > 0) {
            acc.badged.push(newsletter);
          } else {
            acc.regular.push(newsletter);
          }
          return acc;
        },
        { badged: [] as NewsletterWithBadges[], regular: [] as NewsletterWithBadges[] }
      );

      // Sort both arrays by popularity (likes + rocks)
      const sortByPopularity = (a: NewsletterWithBadges, b: NewsletterWithBadges) => {
        const aScore = (a.likes_count || 0) + (a.you_rocks_count || 0);
        const bScore = (b.likes_count || 0) + (b.you_rocks_count || 0);
        return bScore - aScore;
      };

      badged.sort(sortByPopularity);
      regular.sort(sortByPopularity);

      setBadgedNewsletters(prev => [...prev, ...badged]);
      setRegularNewsletters(prev => [...prev, ...regular]);
    } catch (error) {
      console.error("Error fetching newsletters:", error);
    } finally {
      setLoading(false);
    }
  };

  const lastNewsletterCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchNewsletters(page);
  }, [page]);

  const renderPattern = (startIndex: number, isLastGroup: boolean) => {
    const pattern: JSX.Element[] = [];
    let regularIndex = startIndex;
    // Calculate which badged newsletters to use for this pattern
    const patternIndex = Math.floor(startIndex / 6);
    const firstBadgedIndex = patternIndex * 2;
    const secondBadgedIndex = firstBadgedIndex + 1;

    // Only render if we have enough newsletters for this pattern
    if (firstBadgedIndex < badgedNewsletters.length && regularIndex < regularNewsletters.length) {
      // Row 1: [Large (2 cols)][Ad + Small stacked (1 col)]
      pattern.push(
        <div key={`row1-${startIndex}`} className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <LargeNewsletterCard
              newsletter={badgedNewsletters[firstBadgedIndex]}
              priority={startIndex < 3}
              showBadges={true}
            />
          </div>
          <div className="col-span-1 space-y-6">
            <AdCard />
            {regularNewsletters[regularIndex] && (
              <SmallNewsletterCard
                newsletter={regularNewsletters[regularIndex]}
                priority={startIndex < 3}
                showBadges={false}
              />
            )}
          </div>
        </div>
      );
      regularIndex++;

      // Row 2: [Small][Small][Small]
      if (regularIndex + 2 < regularNewsletters.length) {
        pattern.push(
          <div key={`row2-${startIndex}`} className="grid grid-cols-3 gap-6">
            {[0, 1, 2].map(i => (
              <div key={`small-${regularIndex + i}`} className="col-span-1">
                <SmallNewsletterCard
                  newsletter={regularNewsletters[regularIndex + i]}
                  priority={startIndex < 3}
                  showBadges={false}
                />
              </div>
            ))}
          </div>
        );
        regularIndex += 3;
      }

      // Row 3: [Ad + Small stacked (1 col)][Large (2 cols)]
      if (
        regularIndex < regularNewsletters.length &&
        secondBadgedIndex < badgedNewsletters.length
      ) {
        pattern.push(
          <div key={`row3-${startIndex}`} className="grid grid-cols-3 gap-6">
            <div className="col-span-1 space-y-6">
              <AdCard />
              <div ref={isLastGroup ? lastNewsletterCallback : null}>
                <SmallNewsletterCard
                  newsletter={regularNewsletters[regularIndex]}
                  priority={startIndex < 3}
                  showBadges={false}
                />
              </div>
            </div>
            <div className="col-span-2">
              <LargeNewsletterCard
                newsletter={badgedNewsletters[secondBadgedIndex]}
                priority={startIndex < 3}
                showBadges={true}
              />
            </div>
          </div>
        );
      }
    }

    return pattern;
  };

  const renderGridItems = () => {
    const patterns: JSX.Element[] = [];
    // Calculate how many complete patterns we can make
    const maxPatterns = Math.floor(
      Math.min(
        regularNewsletters.length / 6, // Need 6 regular newsletters per pattern
        badgedNewsletters.length / 2 // Need 2 badged newsletters per pattern
      )
    );

    for (let i = 0; i < maxPatterns; i++) {
      const startIndex = i * 6;
      const isLastGroup = i === maxPatterns - 1;
      patterns.push(...renderPattern(startIndex, isLastGroup));
    }

    return patterns;
  };

  if (loading && regularNewsletters.length === 0 && badgedNewsletters.length === 0) {
    return (
      <ThreeColumnLayout>
        <div className="space-y-6">
          <h1 className="mb-8 text-3xl font-bold">Trending Newsletters</h1>
          <NewsletterPatternSkeleton />
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout>
      <div role="main" aria-label="Trending Newsletters">
        <h1 className="mb-8 text-3xl font-bold">Trending Newsletters</h1>
        <div className="space-y-6">
          {renderGridItems()}

          {loading && <NewsletterPatternSkeleton />}

          {!hasMore && regularNewsletters.length > 0 && (
            <div className="col-span-3 p-8 text-center text-gray-600">
              You&apos;re all caught up 🏁
            </div>
          )}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
