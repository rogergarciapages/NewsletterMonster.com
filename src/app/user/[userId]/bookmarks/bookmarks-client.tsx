"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import axios from "axios";

import { NewsletterGrid } from "@/app/components/newsletters/newsletter-grid";
import { NewsletterPatternSkeleton } from "@/app/components/skeleton/newsletter-pattern-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Newsletter } from "@/types/newsletter";

const NEWSLETTERS_PER_PAGE = 20;

interface BookmarksClientProps {
  initialBookmarks: Newsletter[];
  userId: string;
}

export function BookmarksClient({ initialBookmarks, userId }: BookmarksClientProps) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>(initialBookmarks);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1); // Start at 1 since we already have initial bookmarks
  const observerRef = useRef<IntersectionObserver>();
  const processedNewsletterIds = useRef(
    new Set(initialBookmarks.map(newsletter => newsletter.newsletter_id))
  );

  const fetchMoreBookmarks = async (pageNumber: number) => {
    try {
      setLoading(true);
      const skip = pageNumber * NEWSLETTERS_PER_PAGE;
      const response = await axios.get("/api/bookmarks", {
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

      setNewsletters(prev => [...prev, ...newNewsletters]);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
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
    if (page > 1) {
      fetchMoreBookmarks(page);
    }
  }, [page]);

  if (newsletters.length === 0 && !loading) {
    return (
      <Card className="rounded-xl border bg-card text-card-foreground shadow">
        <CardHeader className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-2xl font-bold">No bookmarks yet</h2>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <p className="text-muted-foreground">
            Start bookmarking newsletters you want to read later or keep for reference.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <NewsletterGrid newsletters={newsletters} observerRef={lastNewsletterCallback} />

      {loading && <NewsletterPatternSkeleton />}

      {!hasMore && newsletters.length > 0 && (
        <div className="col-span-3 p-8 text-center text-muted-foreground">
          You&apos;ve seen all your bookmarks 🎉
        </div>
      )}
    </div>
  );
}
