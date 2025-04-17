// src/app/components/brand/profile/header/follow-button.tsx
"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";

import LoginModal from "@/app/components/login-modal";

// src/app/components/brand/profile/header/follow-button.tsx

// src/app/components/brand/profile/header/follow-button.tsx

// src/app/components/brand/profile/header/follow-button.tsx

// src/app/components/brand/profile/header/follow-button.tsx

// src/app/components/brand/profile/header/follow-button.tsx

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
  const { status } = useSession();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastClickTimeRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
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
      console.error("No brandId provided to FollowButton");
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

    // Optimistically update the UI
    setIsFollowing(newIsFollowing);
    onFollowChange?.(newIsFollowing);

    // Debounce the actual API call
    debounceTimerRef.current = setTimeout(() => {
      // Update the database
      startTransition(async () => {
        try {
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
            onFollowChange?.(!newIsFollowing);
            console.error("Failed to update follow status");
          }
        } catch (error) {
          // If there's an error, revert the optimistic update
          setIsFollowing(!newIsFollowing);
          onFollowChange?.(!newIsFollowing);
          console.error("Error updating follow status:", error);
        }
      });
    }, 300); // 300ms debounce time
  };

  return (
    <>
      <Button
        onClick={handleClick}
        isDisabled={isPending || !brandId}
        color={isFollowing ? "default" : "warning"}
        variant={isFollowing ? "bordered" : "solid"}
        startContent={
          isFollowing ? <FaUserCheck className="text-xl" /> : <FaUserPlus className="text-xl" />
        }
        className={`font-medium ${className}`}
        size="md"
        isLoading={isPending}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
      <LoginModal isOpen={isLoginModalOpen} onOpenChange={() => setIsLoginModalOpen(false)} />
    </>
  );
}
