"use client";

import { useEffect, useState } from "react";

import { Button, Tooltip } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import LoginModal from "@/app/components/login-modal";
import { useNewsletterLike } from "@/hooks/use-newsletter-like";

interface LikeButtonProps {
  newsletterId: number;
  initialLikesCount?: number;
  initialIsLiked?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LikeButton({
  newsletterId,
  initialLikesCount = 0,
  initialIsLiked = false,
  size = "md",
  className = "",
}: LikeButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { likesCount, isLiked, isLoading, toggleLike } = useNewsletterLike({
    newsletterId,
    initialLikesCount,
    initialIsLiked,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleClick = async () => {
    await toggleLike();
  };

  const sizeClasses = {
    sm: "h-8 min-w-[90px] text-sm",
    md: "h-10 min-w-[110px] text-base",
    lg: "h-12 min-w-[130px] text-lg",
  };

  const iconSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const countSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const button = (
    <Button
      isIconOnly={false}
      variant="light"
      color={isLiked ? "danger" : "default"}
      onClick={handleClick}
      isLoading={isLoading}
      className={`group flex items-center justify-start gap-3 px-4 ${sizeClasses[size]} hover:bg-danger/10 ${className}`}
      startContent={
        <AnimatePresence mode="wait">
          <motion.span
            key={isLiked ? "filled" : "outline"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center"
          >
            {isLiked ? (
              <FaHeart className={`text-[#ff0000] ${iconSizes[size]}`} />
            ) : (
              <FaRegHeart
                className={`text-default-500 transition-colors group-hover:text-[#ff0000] ${iconSizes[size]}`}
              />
            )}
          </motion.span>
        </AnimatePresence>
      }
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={likesCount}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`font-bold tracking-wide ${countSizes[size]} ${
            isLiked ? "text-[#ff0000]" : "text-default-600"
          }`}
        >
          {likesCount > 0 ? likesCount.toLocaleString() : "Like"}
        </motion.span>
      </AnimatePresence>
    </Button>
  );

  return (
    <>
      {likesCount === 0 ? (
        <Tooltip
          content="Be the first to like this newsletter! 🎉"
          placement="bottom"
          delay={300}
          closeDelay={0}
          classNames={{
            base: "py-2 px-4 shadow-xl rounded-lg",
            content: "text-sm font-medium text-default-900",
          }}
          motionProps={{
            variants: {
              exit: {
                opacity: 0,
                transition: {
                  duration: 0.1,
                  ease: "easeIn",
                },
              },
              enter: {
                opacity: 1,
                transition: {
                  duration: 0.15,
                  ease: "easeOut",
                },
              },
            },
          }}
        >
          {button}
        </Tooltip>
      ) : (
        button
      )}
      <LoginModal isOpen={showLoginModal} onOpenChange={() => setShowLoginModal(false)} />
    </>
  );
}
