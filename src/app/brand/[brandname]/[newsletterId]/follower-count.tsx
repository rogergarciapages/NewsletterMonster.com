"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { useFollowCount } from "@/hooks/use-follow-count";

interface FollowerCountProps {
  brandId: string;
  initialFollowersCount: number;
}

export default function FollowerCount({ brandId, initialFollowersCount }: FollowerCountProps) {
  // Use local state to track changes for animation
  const [prevCount, setPrevCount] = useState(initialFollowersCount);

  const { count: followersCount, updateFollowCount } = useFollowCount({
    initialCount: initialFollowersCount,
    brandId,
  });

  // Log when follower count changes to verify updates
  useEffect(() => {
    console.log("Follower count changed:", { prevCount, newCount: followersCount });

    // Only update prevCount if it's different to trigger animations
    if (prevCount !== followersCount) {
      setPrevCount(followersCount);
    }
  }, [followersCount, prevCount]);

  return (
    <div className="text-sm text-gray-400">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={followersCount}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className="inline-block"
        >
          {followersCount.toLocaleString()} {followersCount === 1 ? "follower" : "followers"}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
