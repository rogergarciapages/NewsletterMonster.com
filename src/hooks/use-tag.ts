import { useCallback, useState } from "react";

import axios from "axios";

import type { Newsletter } from "@/app/components/brand/newsletter/types";

export function useTag(tagSlug: string) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchNewsletters = useCallback(
    async (skip: number, take: number) => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/newsletters/by-tag", {
          params: { slug: tagSlug, skip, take },
        });

        const newNewsletters = response.data;
        if (newNewsletters.length < take) {
          setHasMore(false);
        }

        return newNewsletters;
      } catch (error) {
        setError("Failed to fetch newsletters");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [tagSlug]
  );

  return {
    newsletters,
    setNewsletters,
    isLoading,
    error,
    hasMore,
    fetchNewsletters,
  };
}
