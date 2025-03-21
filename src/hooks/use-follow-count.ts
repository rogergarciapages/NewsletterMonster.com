"use client";

import { useEffect, useOptimistic, useRef, useTransition } from "react";

interface UseFollowCountProps {
  initialCount: number;
  brandId: string;
}

export function useFollowCount({ initialCount, brandId }: UseFollowCountProps) {
  const [optimisticCount, updateOptimisticCount] = useOptimistic(
    initialCount,
    (state: number, change: number) => state + change
  );
  const [isPending, startTransition] = useTransition();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActionRef = useRef<{ isFollowing: boolean; timestamp: number } | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const updateFollowCount = async (isFollowing: boolean) => {
    // Prevent rapid clicks by checking if last action was too recent (300ms)
    const now = Date.now();
    if (lastActionRef.current && now - lastActionRef.current.timestamp < 300) {
      // If the action is the same as the last one, ignore it
      if (lastActionRef.current.isFollowing === isFollowing) {
        return;
      }
    }

    // Update the last action reference
    lastActionRef.current = { isFollowing, timestamp: now };

    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Optimistically update the count
    updateOptimisticCount(isFollowing ? 1 : -1);

    // Debounce the actual API call
    debounceTimerRef.current = setTimeout(() => {
      // Update the database
      startTransition(async () => {
        try {
          const response = await fetch("/api/follow/count", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              brandId,
              action: isFollowing ? "follow" : "unfollow",
            }),
          });

          if (!response.ok) {
            // If the server request fails, revert the optimistic update
            updateOptimisticCount(isFollowing ? -1 : 1);
            console.error("Failed to update follow count");
          }
        } catch (error) {
          // If there's an error, revert the optimistic update
          updateOptimisticCount(isFollowing ? -1 : 1);
          console.error("Error updating follow count:", error);
        }
      });
    }, 300); // 300ms debounce time
  };

  return {
    count: optimisticCount,
    isPending,
    updateFollowCount,
  };
}
