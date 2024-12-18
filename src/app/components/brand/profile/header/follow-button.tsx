// src/app/components/brand/profile/header/follow-button.tsx
"use client";

import { useState } from "react";

import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";

import LoginModal from "@/app/components/login-modal";

// src/app/components/brand/profile/header/follow-button.tsx

// src/app/components/brand/profile/header/follow-button.tsx

interface FollowButtonProps {
  brandId: string;
  isFollowing: boolean;
}

export default function FollowButton({
  brandId,
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
      <Button
        onClick={handleFollow}
        isDisabled={isLoading}
        color={isFollowing ? "default" : "warning"}
        variant={isFollowing ? "bordered" : "solid"}
        startContent={
          isFollowing ? <FaUserCheck className="text-xl" /> : <FaUserPlus className="text-xl" />
        }
        className="h-[44px] w-full font-medium"
        size="lg"
      >
        {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
      </Button>
      <LoginModal isOpen={isLoginModalOpen} onOpenChange={() => setIsLoginModalOpen(false)} />
    </>
  );
}
