"use client";

import { useOptimistic, useTransition } from "react";

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

  const updateFollowCount = async (isFollowing: boolean) => {
    // Optimistically update the count
    updateOptimisticCount(isFollowing ? 1 : -1);

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
  };

  return {
    count: optimisticCount,
    isPending,
    updateFollowCount,
  };
}
