import { useCallback, useEffect, useState } from "react";

import { useSession } from "next-auth/react";

interface UseNewsletterLikeProps {
  newsletterId: number;
  initialLikesCount?: number;
  initialIsLiked?: boolean;
}

export function useNewsletterLike({
  newsletterId,
  initialLikesCount = 0,
  initialIsLiked = false,
}: UseNewsletterLikeProps) {
  const { data: session } = useSession();
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch initial like status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch(`/api/newsletters/like?newsletterId=${newsletterId}`);
        const data = await response.json();
        setLikesCount(data.likesCount);
        setIsLiked(data.isLiked);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [newsletterId, session?.user]);

  const toggleLike = useCallback(async () => {
    if (!session?.user) {
      // Handle unauthorized state (e.g., show login modal)
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    // Optimistic update
    setIsLiked(prev => !prev);
    setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));

    try {
      const response = await fetch("/api/newsletters/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newsletterId }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setIsLiked(prev => !prev);
        setLikesCount(prev => (isLiked ? prev + 1 : prev - 1));
        throw new Error("Failed to update like");
      }

      const data = await response.json();
      // Update state with actual server response if needed
      setIsLiked(data.liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  }, [newsletterId, isLiked, isLoading, session?.user]);

  return {
    likesCount,
    isLiked,
    isLoading,
    toggleLike,
  };
}
