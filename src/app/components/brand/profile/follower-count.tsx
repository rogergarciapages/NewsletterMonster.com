"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { useFollowCount } from "@/hooks/use-follow-count";

interface FollowerCountProps {
  brandId: string;
  initialFollowersCount: number;
}

export default function FollowerCount({ brandId, initialFollowersCount }: FollowerCountProps) {
  console.log(
    `FollowerCount rendering for brand ${brandId} with initial count ${initialFollowersCount}`
  );

  // Track current and previous count to trigger animations
  const [prevCount, setPrevCount] = useState(initialFollowersCount);
  const [displayCount, setDisplayCount] = useState(initialFollowersCount);
  const [showAnimation, setShowAnimation] = useState(false);

  const { count: followersCount, updateFollowCount } = useFollowCount({
    initialCount: initialFollowersCount,
    brandId,
  });

  // Listen for follow status change events
  useEffect(() => {
    const handleFollowStatusChange = (event: CustomEvent) => {
      const { brandId: eventBrandId, isFollowing } = event.detail;

      // Only update if this event is for our brand
      if (eventBrandId?.toString() === brandId?.toString()) {
        console.log(
          `Follower event for our brand ${brandId}: ${isFollowing ? "follow" : "unfollow"}`
        );

        // Update our local count state for immediate UI feedback
        const change = isFollowing ? 1 : -1;
        setDisplayCount(prevCount => {
          const newCount = Math.max(0, prevCount + change);
          setPrevCount(prevCount);
          setShowAnimation(true);
          return newCount;
        });
      }
    };

    // Add event listener
    if (typeof window !== "undefined") {
      window.addEventListener("follower-count-change", handleFollowStatusChange as EventListener);

      // Remove event listener on cleanup
      return () => {
        window.removeEventListener(
          "follower-count-change",
          handleFollowStatusChange as EventListener
        );
      };
    }
  }, [brandId]);

  // Monitor for changes in the follower count from the hook
  useEffect(() => {
    console.log(`Follower count from hook changed: prev=${prevCount}, new=${followersCount}`);

    if (prevCount !== followersCount) {
      setPrevCount(followersCount);
      setDisplayCount(followersCount);
      setShowAnimation(true);

      // Reset animation flag after animation completes
      const timer = setTimeout(() => setShowAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [followersCount, prevCount]);

  // Animation effect for count changes
  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => setShowAnimation(false), 800);
      return () => clearTimeout(timer);
    }
  }, [showAnimation]);

  return (
    <div className="text-sm">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={displayCount}
          initial={{ opacity: 0, y: 5 }}
          animate={{
            opacity: 1,
            y: 0,
            color: showAnimation ? "rgb(233, 196, 106)" : "rgb(156, 163, 175)",
            scale: showAnimation ? 1.05 : 1,
          }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="inline-block"
        >
          <span>
            {displayCount.toLocaleString()} {displayCount === 1 ? "follower" : "followers"}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
