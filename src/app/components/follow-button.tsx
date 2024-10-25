"use client";

import { Button } from "@nextui-org/react";
import { IconSquareCheckFilled, IconSquareRoundedPlusFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export interface FollowButtonProps {
  brandId: string;  // Changed from targetId to brandId to match existing usage
  isUnclaimedProfile: boolean;
  initialIsFollowing: boolean;
  onFollowStateChange: (isFollowing: boolean) => void;
}

export default function FollowButton({
  brandId,  // Changed from targetId to brandId
  isUnclaimedProfile,
  initialIsFollowing,
  onFollowStateChange
}: FollowButtonProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  useEffect(() => {
    if (status === 'authenticated') {
      checkFollowStatus();
    } else {
      setIsLoading(false);
    }
  }, [status, brandId]);  // Updated dependency

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(
        `/api/follow/check?targetId=${brandId}&isUnclaimedProfile=${isUnclaimedProfile}`
      );
      const data = await response.json();
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error("Error checking follow status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowClick = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/follow', {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          targetId: brandId,  // Updated to use brandId
          isUnclaimedProfile
        }),
      });

      if (response.ok) {
        const newFollowState = !isFollowing;
        setIsFollowing(newFollowState);
        onFollowStateChange(newFollowState);
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button if viewing own profile
  if (session?.user?.user_id === brandId) {
    return null;
  }

  // Don't show button if not authenticated
  if (!session?.user) {
    return null;
  }

  return (
    <Button
      isLoading={isLoading}
      color={isFollowing ? "default" : "primary"}
      variant={isFollowing ? "bordered" : "solid"}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleFollowClick}
      className="w-full md:w-auto"
      startContent={
        !isLoading && (
          isFollowing ? 
            <IconSquareCheckFilled size={20} /> : 
            <IconSquareRoundedPlusFilled size={20} />
        )
      }
    >
      {isFollowing 
        ? (isHovering ? "Unfollow" : "Following") 
        : "Follow"}
    </Button>
  );
}