// src/app/components/brand/profile/header/follow-button.tsx
"use client";

import { useState } from "react";

import { useSession } from "next-auth/react";

import LoginModal from "@/app/components/login-modal";

// src/app/components/brand/profile/header/follow-button.tsx

interface FollowButtonProps {
  brandId: string;
  brandName: string;
  isFollowing: boolean;
}

export default function FollowButton({
  brandId,
  brandName,
  isFollowing: initialIsFollowing,
}: FollowButtonProps) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleFollow = async () => {
    if (!session) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandId,
          action: isFollowing ? "unfollow" : "follow",
        }),
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      } else {
        console.error("Failed to update follow status");
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleFollow}
        disabled={isLoading}
        className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm ${
          isFollowing
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
            : "bg-blue-600 text-white hover:bg-blue-700"
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
      </button>
      <LoginModal isOpen={isLoginModalOpen} onOpenChange={() => setIsLoginModalOpen(false)} />
    </>
  );
}
