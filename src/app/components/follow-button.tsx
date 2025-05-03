"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { toast } from "sonner";

// Add rate limiting - 1 second between clicks
const CLICK_DELAY = 1000;

const fetcher = (url: string) => fetch(url).then(r => r.json());

// Function to broadcast follow status changes across components
const broadcastFollowChange = (brandId: string, isFollowing: boolean) => {
  if (typeof window === "undefined") return;

  // 1. Event for brand page components
  window.dispatchEvent(
    new CustomEvent("followStatusChange", {
      detail: {
        brand: { id: brandId },
        isFollowing,
      },
      bubbles: true,
    })
  );

  // 2. Event for newsletter page components
  window.dispatchEvent(
    new CustomEvent("follower-count-change", {
      detail: {
        brandId,
        isFollowing,
      },
      bubbles: true,
    })
  );
};

interface FollowButtonProps {
  brandId: string;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean, newCount: number) => void;
  onOpenLoginModal?: () => void;
  className?: string;
}

export default function FollowButton({
  brandId,
  initialIsFollowing = false,
  onFollowChange,
  onOpenLoginModal,
  className = "",
}: FollowButtonProps) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const lastClickTime = useRef(0);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const handleFollow = useCallback(async () => {
    if (!session) {
      onOpenLoginModal?.();
      return;
    }

    const now = Date.now();
    if (now - lastClickTime.current < CLICK_DELAY) {
      return;
    }
    lastClickTime.current = now;

    try {
      setIsLoading(true);
      const newIsFollowing = !isFollowing;
      // Notify parent optimistically (parent should update count)
      onFollowChange?.(newIsFollowing, newIsFollowing ? 1 : -1);
      setIsFollowing(newIsFollowing);
      broadcastFollowChange(brandId, newIsFollowing);
      if (newIsFollowing) {
        setShowTooltip(true);
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
        }
        tooltipTimeoutRef.current = setTimeout(() => {
          setShowTooltip(false);
        }, 1500);
      }
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId,
          action: newIsFollowing ? "follow" : "unfollow",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update follow status");
      }
      toast.success(newIsFollowing ? "Following!" : "Unfollowed successfully");
    } catch (error) {
      console.error("Error following:", error);
      // Revert optimistic update
      const revertedIsFollowing = !isFollowing;
      onFollowChange?.(revertedIsFollowing, revertedIsFollowing ? 1 : -1);
      setIsFollowing(revertedIsFollowing);
      broadcastFollowChange(brandId, revertedIsFollowing);
      toast.error("Failed to update follow status");
    } finally {
      setIsLoading(false);
    }
  }, [session, brandId, onOpenLoginModal, isFollowing, onFollowChange]);

  return (
    <div className="relative">
      <Button
        color={isFollowing ? "default" : "warning"}
        variant={isFollowing ? "bordered" : "solid"}
        startContent={
          <AnimatePresence mode="wait">
            <motion.span
              key={isFollowing ? "following" : "follow"}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
            </motion.span>
          </AnimatePresence>
        }
        onClick={handleFollow}
        isLoading={isLoading}
        className={`group transition-transform hover:scale-105 ${className || ""}`}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={isFollowing ? "following-text" : "follow-text"}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
          >
            {isFollowing ? "Following" : "Follow"}
          </motion.span>
        </AnimatePresence>
      </Button>
      {/* Success tooltip animation */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-1/2 top-full mt-2 -translate-x-1/2 transform rounded-md bg-gray-900 px-3 py-1 text-xs text-white shadow-lg"
          >
            Following!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
