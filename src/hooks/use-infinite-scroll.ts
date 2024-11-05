// src/hooks/useInfiniteScroll.ts
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface UseInfiniteScrollOptions<T> {
  apiEndpoint: string;
  pageSize: number;
  queryParams?: Record<string, string>;
}

export function useInfiniteScroll<T>({ 
  apiEndpoint, 
  pageSize,
  queryParams = {}
}: UseInfiniteScrollOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async (reset: boolean = false) => {
    if (isLoading || (!hasMore && !reset)) return;

    setIsLoading(true);
    setError(null);

    try {
      const currentPage = reset ? 0 : page;
      const response = await axios.get(apiEndpoint, {
        params: {
          skip: currentPage * pageSize,
          take: pageSize,
          ...queryParams
        }
      });

      const newItems = response.data;
      setData(prev => reset ? newItems : [...prev, ...newItems]);
      setHasMore(newItems.length === pageSize);
      setPage(currentPage + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, page, pageSize, hasMore, isLoading, queryParams]);

  const resetData = useCallback(() => {
    setData([]);
    setPage(0);
    setHasMore(true);
    loadMore(true);
  }, [loadMore]);

  // Initial load
  useEffect(() => {
    loadMore(true);
  }, []);

  return {
    data,
    isLoading,
    error,
    hasMore,
    loadMore,
    resetData
  };
}

export default useInfiniteScroll;