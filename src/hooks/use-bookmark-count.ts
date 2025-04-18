import { useEffect, useState } from "react";

import axios from "axios";
import { useSession } from "next-auth/react";

import { BOOKMARK_CHANGED_EVENT } from "./use-newsletter-bookmark";

// Cache duration - 30 minutes
const CACHE_DURATION = 30 * 60 * 1000; 
const BOOKMARK_COUNT_CACHE_KEY = "bookmark_count_cache";
const BOOKMARK_COUNT_CACHE_EXPIRY = "bookmark_count_expiry";

export function useBookmarkCount() {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookmarkCount = async () => {
    if (!session?.user?.user_id) return;

    // Check if we have valid cached data
    if (typeof window !== "undefined") {
      try {
        const cachedCountKey = `${BOOKMARK_COUNT_CACHE_KEY}_${session.user.user_id}`;
        const cachedExpiryKey = `${BOOKMARK_COUNT_CACHE_EXPIRY}_${session.user.user_id}`;
        
        const cachedCount = localStorage.getItem(cachedCountKey);
        const cacheExpiry = localStorage.getItem(cachedExpiryKey);
        
        if (cachedCount && cacheExpiry) {
          const now = Date.now();
          const expiry = parseInt(cacheExpiry, 10);
          
          if (now < expiry) {
            // Cache is still valid
            setCount(parseInt(cachedCount, 10));
            return;
          }
        }
      } catch (e) {
        // Continue with API call if localStorage fails
        console.error("Error accessing localStorage:", e);
      }
    }

    // If no valid cache, fetch from API
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/users/${session.user.user_id}/bookmarks/count`);
      const newCount = response.data.count;
      setCount(newCount);
      
      // Update cache
      if (typeof window !== "undefined") {
        try {
          const cachedCountKey = `${BOOKMARK_COUNT_CACHE_KEY}_${session.user.user_id}`;
          const cachedExpiryKey = `${BOOKMARK_COUNT_CACHE_EXPIRY}_${session.user.user_id}`;
          
          localStorage.setItem(cachedCountKey, newCount.toString());
          localStorage.setItem(cachedExpiryKey, (Date.now() + CACHE_DURATION).toString());
        } catch (e) {
          // Ignore localStorage errors
          console.error("Error storing in localStorage:", e);
        }
      }
    } catch (error) {
      console.error("Error fetching bookmark count:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.user_id) {
      fetchBookmarkCount();
    }
  }, [session?.user?.user_id]);

  // Listen for bookmark changes
  useEffect(() => {
    const handleBookmarkChange = () => {
      // Clear cache on bookmark change event
      if (typeof window !== "undefined" && session?.user?.user_id) {
        try {
          const cachedCountKey = `${BOOKMARK_COUNT_CACHE_KEY}_${session.user.user_id}`;
          const cachedExpiryKey = `${BOOKMARK_COUNT_CACHE_EXPIRY}_${session.user.user_id}`;
          
          localStorage.removeItem(cachedCountKey);
          localStorage.removeItem(cachedExpiryKey);
        } catch (e) {
          // Ignore localStorage errors
        }
      }
      fetchBookmarkCount();
    };

    window.addEventListener(BOOKMARK_CHANGED_EVENT, handleBookmarkChange);

    return () => {
      window.removeEventListener(BOOKMARK_CHANGED_EVENT, handleBookmarkChange);
    };
  }, [session?.user?.user_id]);

  return {
    count,
    isLoading,
  };
}
