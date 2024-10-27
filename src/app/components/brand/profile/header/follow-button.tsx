"use client";

import { useFollow } from "@/hooks/useFollow";
import { Button } from "@nextui-org/react";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FollowButtonProps } from "../types";

interface ExtendedFollowButtonProps extends FollowButtonProps {
  onNeedsLogin: () => void;
  onCountUpdate: (count: number) => void;
}

export default function FollowButton({
  targetId,
  isUnclaimed = false,
  initialIsFollowing = false,
  onFollowStateChange,
  onNeedsLogin,
  onCountUpdate
}: ExtendedFollowButtonProps) {
  const { data: session } = useSession();
  const [isHovering, setIsHovering] = useState(false);
  
  const { isFollowing, isLoading, error, toggleFollow } = useFollow({
    targetId,
    isUnclaimed,
    initialIsFollowing,
    onCountUpdate
  });

  const handleClick = async () => {
    if (!session) {
      onNeedsLogin();
      return;
    }

    if (session.user.user_id === targetId) {
      return;
    }

    const success = await toggleFollow();
    if (success) {
      onFollowStateChange?.(!isFollowing);
    }
  };

  return (
    <Button
      isLoading={isLoading}
      color={isFollowing ? "default" : "primary"}
      variant={isFollowing ? "bordered" : "solid"}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
      className="w-[130px] min-w-[130px]" // Fixed width
      style={{
        backgroundColor: isFollowing ? 'rgba(0, 143, 119, 0.1)' : '#008f77', // Muted when following
        borderColor: '#008f77',
        color: isFollowing ? '#008f77' : 'white',
      }}
      startContent={
        !isLoading && (
          isFollowing ? 
            <IconCheck size={20} /> : 
            <IconPlus size={20} />
        )
      }
    >
      {isFollowing 
        ? (isHovering ? "Unfollow" : "Following") 
        : "Follow"}
    </Button>
  );
}