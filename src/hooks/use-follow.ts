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

interface FollowState {
  isFollowing: boolean;
  followerCount: number;
}

export function useFollow({ 
  targetId, 
  initialIsFollowing,
  onCountUpdate
}: UseFollowProps) {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followState, setFollowState] = useState<FollowState>({
    isFollowing: initialIsFollowing,
    followerCount: 0
  });

  const fetchFollowerCount = useCallback(async () => {
    if (!targetId) return;
    
    try {
      const response = await fetch(`/api/follow/count?targetId=${encodeURIComponent(targetId)}`);
      if (!response.ok) throw new Error("Failed to fetch follower count");
      const data = await response.json();
      setFollowState(prev => ({ ...prev, followerCount: data.count }));
      onCountUpdate?.(data.count);
    } catch (err) {
      console.error("Error fetching follower count:", err);
    }
  }, [targetId, onCountUpdate]);

  // Initial check for follow status and count
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!targetId) {
        setIsLoading(false);
        return;
      }

      try {
        const [followResponse, countResponse] = await Promise.all([
          fetch(`/api/follow/check?targetId=${encodeURIComponent(targetId)}`),
          fetch(`/api/follow/count?targetId=${encodeURIComponent(targetId)}`)
        ]);
        
        if (!followResponse.ok) throw new Error("Failed to check follow status");
        if (!countResponse.ok) throw new Error("Failed to fetch follower count");
        
        const [followData, countData] = await Promise.all([
          followResponse.json(),
          countResponse.json()
        ]);

        setFollowState({
          isFollowing: followData.isFollowing,
          followerCount: countData.count
        });

        onCountUpdate?.(countData.count);
      } catch (err) {
        console.error("Error checking follow status:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Couldn't check follow status. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    checkFollowStatus();
  }, [targetId, onCountUpdate]);

  const toggleFollow = useCallback(async () => {
    if (!session?.user || !targetId) return false;

    setIsLoading(true);
    setError(null);

    const newFollowState = !followState.isFollowing;
    const countDelta = newFollowState ? 1 : -1;
    
    // Optimistic update
    setFollowState(prev => ({
      isFollowing: newFollowState,
      followerCount: prev.followerCount + countDelta
    }));

    // Update UI immediately
    onCountUpdate?.(followState.followerCount + countDelta);

    try {
      const response = await fetch("/api/follow", {
        method: newFollowState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId })
      });

      if (!response.ok) throw new Error("Failed to update follow status");

      // Fetch real count to ensure accuracy
      await fetchFollowerCount();
      
      toast.success(newFollowState ? "Successfully followed!" : "Successfully unfollowed!");
      return true;
    } catch (err) {
      // Revert optimistic update
      setFollowState(prev => ({
        isFollowing: !newFollowState,
        followerCount: prev.followerCount - countDelta
      }));
      onCountUpdate?.(followState.followerCount);
      
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Couldn't update follow status. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session, targetId, followState, fetchFollowerCount, onCountUpdate]);

  return {
    isFollowing: followState.isFollowing,
    followerCount: followState.followerCount,
    isLoading,
    error,
    toggleFollow,
    refreshCount: fetchFollowerCount
  };
}