"use client";

import { useEffect, useState } from "react";

import { Button, Tooltip } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

import LoginModal from "@/app/components/login-modal";
import { useNewsletterBookmark } from "@/hooks/use-newsletter-bookmark";

interface BookmarkButtonProps {
  newsletterId: number;
  initialIsBookmarked?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BookmarkButton({
  newsletterId,
  initialIsBookmarked = false,
  size = "md",
  className = "",
}: BookmarkButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { data: session } = useSession();
  const { isBookmarked, isLoading, toggleBookmark } = useNewsletterBookmark({
    newsletterId,
    initialIsBookmarked,
  });

  // Optimistic UI state
  const [optimisticIsBookmarked, setOptimisticIsBookmarked] = useState(initialIsBookmarked);

  // Update optimistic state when actual state changes
  useEffect(() => {
    setOptimisticIsBookmarked(isBookmarked);
  }, [isBookmarked]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleClick = async () => {
    if (!session?.user) {
      setShowLoginModal(true);
      return;
    }

    // Optimistically update UI
    setOptimisticIsBookmarked(!optimisticIsBookmarked);

    // Actual API call
    const success = await toggleBookmark();

    // Revert if failed
    if (!success) {
      setOptimisticIsBookmarked(optimisticIsBookmarked);
    }
  };

  const sizeClasses = {
    sm: "h-8 min-w-[70px] text-xs",
    md: "h-10 min-w-[90px] text-sm",
    lg: "h-11 min-w-[110px] text-base",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const countSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const button = (
    <Button
      isIconOnly={false}
      variant="light"
      color={optimisticIsBookmarked ? "success" : "default"}
      onClick={handleClick}
      isLoading={isLoading}
      className={`group flex items-center justify-start gap-2 rounded-full px-4 ${sizeClasses[size]} hover:bg-success/10 ${className}`}
      startContent={
        <AnimatePresence mode="wait">
          <motion.span
            key={optimisticIsBookmarked ? "filled" : "outline"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center"
          >
            {optimisticIsBookmarked ? (
              <FaBookmark className={`text-success ${iconSizes[size]}`} />
            ) : (
              <FaRegBookmark
                className={`text-default-500 transition-colors group-hover:text-success ${iconSizes[size]}`}
              />
            )}
          </motion.span>
        </AnimatePresence>
      }
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={optimisticIsBookmarked ? "bookmarked" : "bookmark"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`font-semibold ${countSizes[size]} ${
            optimisticIsBookmarked ? "text-success" : "text-default-600"
          }`}
        >
          {optimisticIsBookmarked ? "Saved" : "Save"}
        </motion.span>
      </AnimatePresence>
    </Button>
  );

  return (
    <>
      <Tooltip
        content={optimisticIsBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
        placement="bottom"
        delay={300}
        closeDelay={0}
        classNames={{
          base: "py-2 px-4 shadow-xl rounded-lg",
          content: "text-sm font-medium text-default-900",
        }}
      >
        {button}
      </Tooltip>
      <LoginModal isOpen={showLoginModal} onOpenChange={() => setShowLoginModal(false)} />
    </>
  );
}
