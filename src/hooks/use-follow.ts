// src/hooks/use-follow.ts
"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseFollowProps {
  targetId: string;
  initialIsFollowing: boolean;
  onCountUpdate?: (count: number) => void;
}

export function useFollow({ 
  targetId, 
  initialIsFollowing,
  onCountUpdate
}: UseFollowProps) {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followState, setFollowState] = useState({
    isFollowing: initialIsFollowing,
  });

  const fetchFollowerCount = async () => {
    try {
      const response = await fetch(`/api/follow/count?targetId=${encodeURIComponent(targetId)}`);
      if (!response.ok) throw new Error("Failed to fetch follower count");
      const data = await response.json();
      onCountUpdate?.(data.count);
    } catch (err) {
      console.error("Error fetching follower count:", err);
    }
  };

  // Initial check for follow status and count
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!targetId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/follow/check?targetId=${encodeURIComponent(targetId)}`);
        
        if (!response.ok) throw new Error("Failed to check follow status");
        
        const data = await response.json();
        setFollowState({
          isFollowing: data.isFollowing,
        });

        // Fetch initial count
        await fetchFollowerCount();
      } catch (err) {
        console.error("Error checking follow status:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Couldn't check follow status. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    checkFollowStatus();
  }, [targetId]);

  const toggleFollow = useCallback(async () => {
    if (!session?.user || !targetId) return false;

    setIsLoading(true);
    setError(null);

    const newFollowState = !followState.isFollowing;
    
    // Update state immediately for optimistic UI
    setFollowState({
      isFollowing: newFollowState,
    });

    try {
      const response = await fetch("/api/follow", {
        method: newFollowState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId })
      });

      if (!response.ok) throw new Error("Failed to update follow status");

      // Fetch updated count after successful follow/unfollow
      await fetchFollowerCount();
      
      toast.success(newFollowState ? "Successfully followed!" : "Successfully unfollowed!");
      return true;
    } catch (err) {
      // Revert optimistic update on error
      setFollowState({
        isFollowing: !newFollowState,
      });
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Couldn't update follow status. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session, targetId, followState]);

  return {
    isFollowing: followState.isFollowing,
    isLoading,
    error,
    toggleFollow,
    refreshCount: fetchFollowerCount
  };
}