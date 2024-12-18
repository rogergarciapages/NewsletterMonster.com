// src/app/components/brand/profile/header/follow-button.tsx
"use client";

import { useState, useTransition } from "react";

import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";

import LoginModal from "@/app/components/login-modal";

// src/app/components/brand/profile/header/follow-button.tsx

interface FollowButtonProps {
  brandId: string;
  isFollowing: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({
  brandId,
  isFollowing: initialIsFollowing,
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleClick = async () => {
    if (status !== "authenticated") {
      setIsLoginModalOpen(true);
      return;
    }

    const newIsFollowing = !isFollowing;

    // Optimistically update the UI
    setIsFollowing(newIsFollowing);
    onFollowChange?.(newIsFollowing);

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
  };

  return (
    <>
      <Button
        onClick={handleClick}
        isDisabled={isPending}
        color={isFollowing ? "default" : "warning"}
        variant={isFollowing ? "bordered" : "solid"}
        startContent={
          isFollowing ? <FaUserCheck className="text-xl" /> : <FaUserPlus className="text-xl" />
        }
        className="h-[44px] w-full font-medium"
        size="lg"
        isLoading={isPending}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
      <LoginModal isOpen={isLoginModalOpen} onOpenChange={() => setIsLoginModalOpen(false)} />
    </>
  );
}
