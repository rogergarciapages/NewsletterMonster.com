// src/app/components/brand/profile/header/index.tsx
"use client";

import LoginModal from "@/app/components/login-modal";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { BrandProfileProps } from "../types";
import ClaimBrandButton from "./claim-button";
import FollowButton from "./follow-button";
import ProfileImage from "./profile-image";
import ProfileInfo from "./profile-info";

function getBrandDomain(brandName: string): string {
  const cleanName = brandName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${cleanName}.com`;
}

export default function BrandProfileHeader({
  brandName,
  user,
  newsletterCount,
  followersCount,
  isFollowing,
  onFollowChange,
  hideFollowButton,
  isOwnProfile,
}: BrandProfileProps) {
  const { data: session } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [localFollowersCount, setLocalFollowersCount] = useState(followersCount);

  // Check if brand is claimed
  const isClaimed = Boolean(user?.role === "BRAND");

  return (
    <div className="p-8 border-b bg-white dark:bg-zinc-800 m-1 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-4">
          <ProfileImage user={user} />
          
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex-grow">
                <ProfileInfo 
                  brandName={brandName}
                  user={user}
                  newsletterCount={newsletterCount}
                  followersCount={localFollowersCount}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                {!hideFollowButton && !isOwnProfile && (
                  <FollowButton 
                    targetId={user?.user_id || brandName}
                    isUnclaimed={!user}
                    initialIsFollowing={isFollowing}
                    onFollowStateChange={(newState) => {
                      onFollowChange?.(newState);
                    }}
                    onNeedsLogin={() => setIsLoginModalOpen(true)}
                    onCountUpdate={(count) => {
                      setLocalFollowersCount(count);
                    }}
                  />
                )}
                
                {!isClaimed && session && !isOwnProfile && (
                  <ClaimBrandButton 
                    brandName={brandName}
                    brandDomain={getBrandDomain(brandName)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onOpenChange={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}