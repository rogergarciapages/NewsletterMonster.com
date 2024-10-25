"use client";

import { useEffect } from "react";
import { BrandProfileProps } from "../types";
import FollowButton from "./follow-button";
import ProfileImage from "./profile-image";
import ProfileInfo from "./profile-info";

export default function BrandProfileHeader({
  brandName,
  user,
  newsletterCount,
  followersCount,
  isFollowing,
  onFollowChange,
  onClaimProfile,
}: BrandProfileProps) {
  useEffect(() => {
    console.log("BrandProfileHeader Debug:", {
      brandName,
      user,
      isFollowing,
      followersCount
    });
  }, [brandName, user, isFollowing, followersCount]);

  return (
    <div className="p-8 border-b bg-white dark:bg-zinc-800 m-1 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <ProfileImage user={user} />
            
            <div className="w-full md:w-auto">
              <FollowButton 
                brandId={user?.user_id || brandName}
                isUnclaimed={!user}
                initialIsFollowing={isFollowing || false}
                onFollowStateChange={onFollowChange || (() => {})}
              />
            </div>
          </div>

          <ProfileInfo 
            brandName={brandName}
            user={user}
            newsletterCount={newsletterCount}
            followersCount={followersCount}
            onClaimProfile={onClaimProfile}
          />
        </div>
      </div>
    </div>
  );
}