"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import axios from "axios";

import { AdCard } from "@/app/components/ads/ad-card";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { LargeNewsletterCard } from "@/app/components/newsletters/large-newsletter-card";
import { SmallNewsletterCard } from "@/app/components/newsletters/small-newsletter-card";
import { NewsletterPatternSkeleton } from "@/app/components/skeleton/newsletter-pattern-skeleton";
import { Card } from "@/components/ui/card";
import { Newsletter } from "@/types/newsletter";

const NEWSLETTERS_PER_PAGE = 30;

export default function TrendingNewslettersClient() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
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

      const newNewsletters = response.data.filter(
        (newsletter: Newsletter) => !processedNewsletterIds.current.has(newsletter.newsletter_id)
      );

      newNewsletters.forEach((newsletter: Newsletter) => {
        processedNewsletterIds.current.add(newsletter.newsletter_id);
      });

      if (newNewsletters.length < NEWSLETTERS_PER_PAGE) {
        setHasMore(false);
      }

      // Sort newsletters by popularity
      const sortedNewsletters = newNewsletters.sort((a: Newsletter, b: Newsletter) => {
        const aScore = (a.likes_count || 0) + (a.you_rocks_count || 0);
        const bScore = (b.likes_count || 0) + (b.you_rocks_count || 0);
        return bScore - aScore;
      });

      setNewsletters(prev => [...prev, ...sortedNewsletters]);
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
    let currentIndex = startIndex;

    // Only render if we have enough newsletters for this pattern
    if (currentIndex + 1 < newsletters.length) {
      // Row 1: [Large (2 cols)][Ad + Small stacked (1 col)]
      pattern.push(
        <div key={`row1-${startIndex}`} className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <LargeNewsletterCard newsletter={newsletters[currentIndex]} priority={startIndex < 3} />
          </div>
          <div className="col-span-1 space-y-6">
            <AdCard />
            {newsletters[currentIndex + 1] && (
              <SmallNewsletterCard
                newsletter={newsletters[currentIndex + 1]}
                priority={startIndex < 3}
              />
            )}
          </div>
        </div>
      );
      currentIndex += 2;

      // Row 2: [Small][Small][Small]
      if (currentIndex + 2 < newsletters.length) {
        pattern.push(
          <div key={`row2-${startIndex}`} className="grid grid-cols-3 gap-6">
            {[0, 1, 2].map(i => (
              <div key={`small-${currentIndex + i}`} className="col-span-1">
                <SmallNewsletterCard
                  newsletter={newsletters[currentIndex + i]}
                  priority={startIndex < 3}
                />
              </div>
            ))}
          </div>
        );
        currentIndex += 3;
      }

      // Row 3: [Ad + Small stacked (1 col)][Large (2 cols)]
      if (currentIndex + 1 < newsletters.length) {
        pattern.push(
          <div key={`row3-${startIndex}`} className="grid grid-cols-3 gap-6">
            <div className="col-span-1 space-y-6">
              <AdCard />
              <div ref={isLastGroup ? lastNewsletterCallback : null}>
                <SmallNewsletterCard
                  newsletter={newsletters[currentIndex]}
                  priority={startIndex < 3}
                />
              </div>
            </div>
            <div className="col-span-2">
              <LargeNewsletterCard
                newsletter={newsletters[currentIndex + 1]}
                priority={startIndex < 3}
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
    const maxPatterns = Math.floor(newsletters.length / 7); // 7 newsletters per pattern

    for (let i = 0; i < maxPatterns; i++) {
      const startIndex = i * 7;
      const isLastGroup = i === maxPatterns - 1;
      patterns.push(...renderPattern(startIndex, isLastGroup));
    }

    return patterns;
  };

  if (loading && newsletters.length === 0) {
    return (
      <ThreeColumnLayout>
        <Card className="p-8">
          <div className="mb-8">
            <h1 className="text-5xl font-bold">Trending Newsletters</h1>
            <p className="text-white. mt-2">
              Discover the most popular and highly-rated newsletters curated by our community
            </p>
          </div>
          <NewsletterPatternSkeleton />
        </Card>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout>
      <Card className="p-8">
        <div role="main" aria-label="Trending Newsletters">
          <div className="mb-8">
            <h1 className="text-5xl font-bold">Trending Newsletters</h1>
            <p className="mt-4 max-w-xl text-pretty text-xl leading-snug tracking-tight text-white">
              Discover the most popular and highly-rated newsletters curated by our community
            </p>
          </div>
          <div className="space-y-6">
            {renderGridItems()}

            {loading && <NewsletterPatternSkeleton />}

            {!hasMore && newsletters.length > 0 && (
              <div className="col-span-3 p-8 text-center text-gray-600">
                You&apos;re all caught up 🏁
              </div>
            )}
          </div>
        </div>
      </Card>
    </ThreeColumnLayout>
  );
}
