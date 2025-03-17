import { useEffect, useState } from "react";

import axios from "axios";
import { useSession } from "next-auth/react";

import { BOOKMARK_CHANGED_EVENT } from "./use-newsletter-bookmark";

export function useBookmarkCount() {
  const { data: session } = useSession();
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookmarkCount = async () => {
    if (!session?.user?.user_id) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`/api/users/${session.user.user_id}/bookmarks/count`);
      setCount(response.data.count);
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
