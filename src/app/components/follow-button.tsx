"use client";

import { useCallback, useRef, useState } from "react";

import { Button } from "@nextui-org/react";
import { IconUserMinus, IconUserPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import useSWR from "swr";

// Add rate limiting - 1 second between clicks
const CLICK_DELAY = 1000;

const fetcher = (url: string) => fetch(url).then(r => r.json());

const useFollowStatus = (targetId: string) => {
  const { data, error, mutate } = useSWR(
    targetId ? `/api/follow/status?targetId=${targetId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000,
      refreshInterval: 30000,
    }
  );

  return {
    isFollowing: data?.isFollowing ?? false,
    followersCount: data?.followersCount ?? 0,
    isLoading: !error && !data,
    error,
    mutate,
  };
};

interface FollowButtonProps {
  targetId: string;
  onOpenLoginModal?: () => void;
  className?: string;
}

export default function FollowButton({ targetId, onOpenLoginModal, className }: FollowButtonProps) {
  const { data: session } = useSession();
  const { isFollowing, followersCount, mutate } = useFollowStatus(targetId);
  const [isLoading, setIsLoading] = useState(false);
  const lastClickTime = useRef(0);

  const handleFollow = useCallback(async () => {
    if (!session) {
      onOpenLoginModal?.();
      return;
    }

    // Rate limiting
    const now = Date.now();
    if (now - lastClickTime.current < CLICK_DELAY) {
      return;
    }
    lastClickTime.current = now;

    try {
      setIsLoading(true);
      await mutate(
        { isFollowing: !isFollowing, followersCount: followersCount + (isFollowing ? -1 : 1) },
        false
      );

      const response = await fetch("/api/follow", {
        method: isFollowing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update follow status");
      }

      toast.success(isFollowing ? "Unfollowed successfully" : "Following now!");
      await mutate();
    } catch (error) {
      console.error("Error following:", error);
      toast.error("Failed to update follow status");
      await mutate();
    } finally {
      setIsLoading(false);
    }
  }, [session, targetId, mutate, onOpenLoginModal, isFollowing, followersCount]);

  return (
    <Button
      color="warning"
      variant={isFollowing ? "flat" : "solid"}
      startContent={isFollowing ? <IconUserMinus /> : <IconUserPlus />}
      onClick={handleFollow}
      isLoading={isLoading}
      className={`transition-transform hover:scale-105 ${className || ""}`}
    >
      {isFollowing ? "Unfollow" : "Follow"} {followersCount > 0 && `(${followersCount})`}
    </Button>
  );
}
