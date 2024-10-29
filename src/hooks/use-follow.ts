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
  pendingUpdate: boolean;
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
    followerCount: 0,
    pendingUpdate: false
  });

  useEffect(() => {
    const initializeState = async () => {
      if (!targetId) {
        setIsLoading(false);
        return;
      }

      try {
        const [statusResponse, countResponse] = await Promise.all([
          fetch(`/api/follow/check?targetId=${encodeURIComponent(targetId)}`),
          fetch(`/api/follow/count?targetId=${encodeURIComponent(targetId)}`)
        ]);

        if (!statusResponse.ok || !countResponse.ok) {
          throw new Error("Failed to fetch initial state");
        }

        const [statusData, countData] = await Promise.all([
          statusResponse.json(),
          countResponse.json()
        ]);

        setFollowState({
          isFollowing: statusData.isFollowing,
          followerCount: countData.count,
          pendingUpdate: false
        });
        onCountUpdate?.(countData.count);
      } catch (err) {
        console.error("Error initializing follow state:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Couldn't load follow status. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeState();
  }, [targetId, onCountUpdate]);

  const toggleFollow = useCallback(async () => {
    if (!session?.user || !targetId) return false;

    setIsLoading(true);
    setError(null);

    const newFollowState = !followState.isFollowing;
    const prevCount = followState.followerCount;
    
    // Optimistic update
    setFollowState(prev => ({
      ...prev,
      isFollowing: newFollowState,
      followerCount: newFollowState ? prev.followerCount + 1 : prev.followerCount - 1,
      pendingUpdate: true
    }));

    // Immediate UI update
    onCountUpdate?.(newFollowState ? prevCount + 1 : prevCount - 1);

    try {
      const response = await fetch("/api/follow", {
        method: newFollowState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId })
      });

      if (!response.ok) throw new Error("Failed to update follow status");
      
      const data = await response.json();

      // Update with server count
      setFollowState(prev => ({
        ...prev,
        followerCount: data.count,
        pendingUpdate: false
      }));
      onCountUpdate?.(data.count);

      toast.success(newFollowState ? "Successfully followed!" : "Successfully unfollowed!");
      return true;
    } catch (err) {
      // Revert optimistic update
      setFollowState(prev => ({
        ...prev,
        isFollowing: !newFollowState,
        followerCount: prevCount,
        pendingUpdate: false
      }));
      onCountUpdate?.(prevCount);
      
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Couldn't update follow status. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session, targetId, followState, onCountUpdate]);

  return {
    isFollowing: followState.isFollowing,
    followerCount: followState.followerCount,
    isLoading,
    error,
    toggleFollow
  };
}