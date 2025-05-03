// src/app/components/brand/profile/header/follow-button.tsx
"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";

import LoginModal from "@/app/components/login-modal";
import { logger } from "@/lib/utils/logger";

// src/app/components/brand/profile/header/follow-button.tsx

// Dispatch custom event for follow status changes
const broadcastFollowChange = (brandId: string | number, isFollowing: boolean) => {
  if (typeof window !== "undefined") {
    // Convert brandId to string for consistency
    const brandIdString = brandId?.toString() || "";

    logger.debug(`Broadcasting follow change: ${brandIdString}, isFollowing: ${isFollowing}`);

    // Dispatch both event types to support all components
    // 1. Event for brand page components
    window.dispatchEvent(
      new CustomEvent("followStatusChange", {
        detail: {
          brand: { id: brandIdString },
          isFollowing,
        },
        bubbles: true,
        composed: true,
      })
    );

    // 2. Event for newsletter page components
    window.dispatchEvent(
      new CustomEvent("follower-count-change", {
        detail: {
          brandId: brandIdString,
          isFollowing,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
};

interface FollowButtonProps {
  brandId?: string | number;
  isFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string;
}

export default function FollowButton({
  brandId,
  isFollowing: initialIsFollowing = false,
  onFollowChange,
  className = "",
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showSuccessTooltip, setShowSuccessTooltip] = useState(false);
  const { status } = useSession();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update internal state when prop changes (e.g., when loaded from database)
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const handleClick = async () => {
    if (status !== "authenticated") {
      setIsLoginModalOpen(true);
      return;
    }

    // Check if brandId is provided
    if (!brandId) {
      logger.error("No brandId provided to FollowButton");
      return;
    }

    // Prevent rapid clicks (300ms debounce)
    const now = Date.now();
    if (now - lastClickTimeRef.current < 300) {
      return;
    }
    lastClickTimeRef.current = now;

    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const newIsFollowing = !isFollowing;

    // Optimistically update UI immediately
    setIsFollowing(newIsFollowing);

    // Show success tooltip briefly if following
    if (newIsFollowing) {
      setShowSuccessTooltip(true);
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowSuccessTooltip(false);
      }, 1500);
    }

    // 1. Notify parent component about follow change (for optimistic updates)
    if (onFollowChange) {
      onFollowChange(newIsFollowing);
    }

    // 2. Broadcast the event for other components
    broadcastFollowChange(brandId, newIsFollowing);

    // Update the database
    startTransition(async () => {
      try {
        logger.debug(
          `Updating follow status for brand ${brandId} to ${newIsFollowing ? "follow" : "unfollow"}`
        );

        const response = await fetch("/api/follow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brandId,
            action: newIsFollowing ? "follow" : "unfollow",
          }),
        });

        if (!response.ok) {
          // If the server request fails, revert the optimistic update
          setIsFollowing(!newIsFollowing);

          // Also notify parent to revert the count
          if (onFollowChange) {
            onFollowChange(!newIsFollowing);
          }

          // Broadcast the reversion
          broadcastFollowChange(brandId, !newIsFollowing);

          logger.error(`Failed to update follow status for brand ${brandId}`);
        } else {
          logger.debug(
            `Successfully ${newIsFollowing ? "followed" : "unfollowed"} brand ${brandId}`
          );
        }
      } catch (error) {
        // If there's an error, revert the optimistic update
        setIsFollowing(!newIsFollowing);

        // Also notify parent to revert the count
        if (onFollowChange) {
          onFollowChange(!newIsFollowing);
        }

        // Broadcast the reversion
        broadcastFollowChange(brandId, !newIsFollowing);

        logger.error("Error updating follow status:", error);
      }
    });
  };

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        isDisabled={isPending || !brandId}
        color={isFollowing ? "default" : "warning"}
        variant={isFollowing ? "bordered" : "solid"}
        className={`group font-medium transition-all duration-200 hover:scale-105 ${className}`}
        size="md"
        isLoading={isPending}
        startContent={
          <AnimatePresence mode="wait">
            <motion.span
              key={isFollowing ? "following" : "follow"}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              {isFollowing ? (
                <FaUserCheck className="text-xl" />
              ) : (
                <FaUserPlus className="text-xl" />
              )}
            </motion.span>
          </AnimatePresence>
        }
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
        {showSuccessTooltip && (
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

      {/* Login modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onOpenChange={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          // After login, attempt to follow again
          handleClick();
        }}
      />
    </div>
  );
}
