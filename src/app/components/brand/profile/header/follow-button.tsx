"use client";

import { Button } from "@nextui-org/react";
import { IconSquareCheckFilled, IconSquareRoundedPlusFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FollowButtonProps } from "../types";

export default function FollowButton({
  brandId,
  isUnclaimed,  // Changed from isUnclaimedProfile
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
  }, [status, brandId]);

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(
        `/api/follow/check?targetId=${brandId}&isUnclaimed=${isUnclaimed}`
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
          targetId: brandId,
          isUnclaimed
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

  if (!session?.user || session.user.user_id === brandId) {
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