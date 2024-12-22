"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button, Tooltip } from "@nextui-org/react";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";

import LoginModal from "@/app/components/login-modal";
import { useNewsletterYouRock } from "@/hooks/use-newsletter-you-rock";

interface YouRockButtonProps {
  newsletterId: number;
  initialYouRocksCount?: number;
  size?: "sm" | "md" | "lg";
}

export function YouRockButton({
  newsletterId,
  initialYouRocksCount = 0,
  size = "md",
}: YouRockButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const localClickCount = useRef<number>(0);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>();
  const { data: session } = useSession();
  const { youRocksCount, isLoading, addYouRock } = useNewsletterYouRock({
    newsletterId,
    initialYouRocksCount,
  });

  const runConfetti = useCallback(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      startVelocity: 20,
      gravity: 1,
      ticks: 200,
      colors: ["#FFD700", "#FFA500", "#FF6347", "#FF4500"],
      shapes: ["star", "circle"],
      scalar: 0.7,
    });
  }, []);

  const handleClick = useCallback(() => {
    if (!session?.user) {
      setShowLoginModal(true);
      return;
    }

    // Increment local click count
    localClickCount.current += 1;

    // Optimistically update the UI
    addYouRock(1);

    runConfetti();
    setShowTooltip(true);

    // Clear existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    // Set new timeout
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 1500);
  }, [session?.user, addYouRock, runConfetti]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset local click count when component unmounts
  useEffect(() => {
    return () => {
      if (localClickCount.current > 0) {
        addYouRock(localClickCount.current);
        localClickCount.current = 0;
      }
    };
  }, [addYouRock]);

  // Handle touch events with passive listeners
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const touchStartHandler = (e: TouchEvent) => {
      e.preventDefault();
      handleClick();
    };

    button.addEventListener("touchstart", touchStartHandler, { passive: true });
    return () => {
      button.removeEventListener("touchstart", touchStartHandler);
    };
  }, [handleClick]);

  if (!mounted) {
    return null;
  }

  const sizeClasses = {
    sm: "h-8 min-w-[90px] text-sm",
    md: "h-10 min-w-[110px] text-base",
    lg: "h-12 min-w-[130px] text-lg",
  };

  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-7 w-7",
    lg: "h-8 w-8",
  };

  const countSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const button = (
    <div className="relative">
      <Button
        ref={buttonRef}
        isIconOnly={false}
        variant="light"
        onClick={handleClick}
        isLoading={isLoading}
        className={`group flex items-center justify-start gap-3 px-4 ${sizeClasses[size]} hover:bg-warning/10`}
        startContent={
          <AnimatePresence mode="wait">
            <motion.span
              key="rock-icon"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`text-warning-500 transition-colors group-hover:text-warning-600 ${iconSizes[size]}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M11 11.5v-1a1.5 1.5 0 0 1 3 0v1.5" />
                <path d="M17 12v-6.5a1.5 1.5 0 0 1 3 0v10.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7a69.74 69.74 0 0 1 -.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" />
                <path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5" />
                <path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5" />
              </svg>
            </motion.span>
          </AnimatePresence>
        }
      >
        <span className={`font-semibold ${countSizes[size]}`}>{youRocksCount}</span>
      </Button>
      <AnimatePresence>
        {showTooltip && youRocksCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute left-1/2 top-full mt-2 -translate-x-1/2 transform rounded-md bg-gray-900 px-3 py-1 text-sm text-white shadow-lg"
          >
            You rock!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {youRocksCount === 0 ? (
        <Tooltip
          content="Be the first to rock this newsletter!"
          placement="bottom"
          showArrow
          classNames={{
            base: "py-2 px-4 shadow-xl",
            arrow: "bg-gray-900",
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
