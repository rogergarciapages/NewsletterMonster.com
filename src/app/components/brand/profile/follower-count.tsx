"use client";

import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { logger } from "@/lib/utils/logger";

interface FollowerCountProps {
  followersCount?: number;
  isFollowing?: boolean;
  brandId?: string | number;
  className?: string;
}

export default function FollowerCount({
  followersCount: initialFollowersCount = 0,
  isFollowing: initialIsFollowing,
  brandId,
  className,
}: FollowerCountProps) {
  // Store the actual follower count
  const [count, setCount] = useState<number>(initialFollowersCount);

  // Track if this is the initial render to avoid animations on first load
  const isInitialMount = useRef(true);

  // Track animation state
  const [animateUp, setAnimateUp] = useState(false);
  const [animateDown, setAnimateDown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update follower count when the initialFollowersCount prop changes
  // This happens when the data is fetched from the database
  useEffect(() => {
    if (initialFollowersCount !== undefined) {
      // Only update if different from current count to avoid unnecessary rerenders
      if (initialFollowersCount !== count) {
        logger.debug(`Setting initial follower count: ${initialFollowersCount}`);

        if (isInitialMount.current) {
          // On first render, just set the count without animation
          setCount(initialFollowersCount);
          isInitialMount.current = false;
        } else {
          // For subsequent updates from props, animate if appropriate
          if (initialFollowersCount > count) {
            setAnimateUp(true);
            setAnimateDown(false);
          } else if (initialFollowersCount < count) {
            setAnimateUp(false);
            setAnimateDown(true);
          }

          setIsAnimating(true);
          setCount(initialFollowersCount);

          // Clear any existing animation timeout
          if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
          }

          // Reset animation state after completion
          animationTimeoutRef.current = setTimeout(() => {
            setAnimateUp(false);
            setAnimateDown(false);
            setIsAnimating(false);
            animationTimeoutRef.current = null;
          }, 1000);
        }
      }
    }
  }, [initialFollowersCount, count]);

  // Listen for follow status change events (optimistic updates)
  useEffect(() => {
    // Handler for follow button events
    const handleFollowStatusChange = (event: CustomEvent) => {
      const { brand, isFollowing } = event.detail;

      // Make sure we only update for the current brand
      if (!brandId || !brand || brand.id.toString() !== brandId.toString()) {
        return;
      }

      logger.debug(`Follow status change event for brand ${brandId}: isFollowing=${isFollowing}`);

      // Update count based on follow status
      const currentCount = count;
      const newCount = isFollowing ? currentCount + 1 : Math.max(0, currentCount - 1);

      // Set animation direction
      if (newCount > currentCount) {
        setAnimateUp(true);
        setAnimateDown(false);
      } else if (newCount < currentCount) {
        setAnimateUp(false);
        setAnimateDown(true);
      }

      setIsAnimating(true);
      setCount(newCount);

      // Clear any existing animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      // Reset animation state after completion
      animationTimeoutRef.current = setTimeout(() => {
        setAnimateUp(false);
        setAnimateDown(false);
        setIsAnimating(false);
        animationTimeoutRef.current = null;
      }, 1000);
    };

    // Handler for follower count change events (from newsletter page)
    const handleFollowerCountChange = (event: CustomEvent) => {
      const { brandId: eventBrandId, isFollowing } = event.detail;

      // Make sure we only update for the current brand
      if (!brandId || eventBrandId.toString() !== brandId.toString()) {
        return;
      }

      logger.debug(`Follower count change event for brand ${brandId}: isFollowing=${isFollowing}`);

      // Update count based on follow status
      const currentCount = count;
      const newCount = isFollowing ? currentCount + 1 : Math.max(0, currentCount - 1);

      // Set animation direction
      if (newCount > currentCount) {
        setAnimateUp(true);
        setAnimateDown(false);
      } else if (newCount < currentCount) {
        setAnimateUp(false);
        setAnimateDown(true);
      }

      setIsAnimating(true);
      setCount(newCount);

      // Clear any existing animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      // Reset animation state after completion
      animationTimeoutRef.current = setTimeout(() => {
        setAnimateUp(false);
        setAnimateDown(false);
        setIsAnimating(false);
        animationTimeoutRef.current = null;
      }, 1000);
    };

    // Add event listeners
    window.addEventListener("followStatusChange", handleFollowStatusChange as EventListener);
    window.addEventListener("follower-count-change", handleFollowerCountChange as EventListener);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("followStatusChange", handleFollowStatusChange as EventListener);
      window.removeEventListener(
        "follower-count-change",
        handleFollowerCountChange as EventListener
      );

      // Clear any pending animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [brandId, count]); // Include count in deps to always use latest value

  // Format the count for display
  const formattedCount = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count.toString();

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="relative h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={formattedCount}
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-colors",
              animateUp && "text-success-500",
              animateDown && "text-danger-500"
            )}
            initial={{ y: animateUp ? 20 : animateDown ? -20 : 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: animateUp ? -20 : animateDown ? 20 : 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {formattedCount}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="text-sm text-gray-500">followers</span>
    </div>
  );
}
