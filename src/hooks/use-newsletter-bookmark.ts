import { useCallback, useEffect, useState } from "react";

import axios from "axios";
import { useSession } from "next-auth/react";

// Custom event for bookmark changes
export const BOOKMARK_CHANGED_EVENT = "bookmarkChanged";

interface UseNewsletterBookmarkProps {
  newsletterId: number;
  initialIsBookmarked?: boolean;
}

export function useNewsletterBookmark({
  newsletterId,
  initialIsBookmarked = false,
}: UseNewsletterBookmarkProps) {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const checkBookmarkStatus = async () => {
        try {
          const response = await axios.get(`/api/bookmarks/${newsletterId}`);
          setIsBookmarked(response.data.isBookmarked);
        } catch (error) {
          console.error("Error checking bookmark status:", error);
        }
      };

      checkBookmarkStatus();
    }
  }, [newsletterId, session?.user]);

  const toggleBookmark = useCallback(async () => {
    if (!session?.user) {
      return false;
    }

    setIsLoading(true);
    try {
      if (isBookmarked) {
        await axios.delete(`/api/bookmarks/${newsletterId}`);
      } else {
        await axios.post(`/api/bookmarks/${newsletterId}`);
      }
      setIsBookmarked(!isBookmarked);

      // Dispatch custom event to notify other components about bookmark changes
      window.dispatchEvent(new CustomEvent(BOOKMARK_CHANGED_EVENT));

      return true;
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isBookmarked, newsletterId, session?.user]);

  return {
    isBookmarked,
    isLoading,
    toggleBookmark,
  };
}
