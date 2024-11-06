// src/app/components/brand/profile/header/index.tsx
"use client";

import { useState } from "react";

import { useSession } from "next-auth/react";

import LoginModal from "@/app/components/login-modal";

import { BrandProfileProps } from "../types";
import ClaimBrandButton from "./claim-button";
import FollowButton from "./follow-button";
import ProfileImage from "./profile-image";
import ProfileInfo from "./profile-info";

// src/app/components/brand/profile/header/index.tsx

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
  onClaimProfile,
  hideFollowButton,
  isOwnProfile,
}: BrandProfileProps) {
  const { data: session } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [localFollowersCount, setLocalFollowersCount] = useState(followersCount);

  // Check if brand is claimed
  const isClaimed = Boolean(user?.role === "BRAND");

  return (
    <div className="m-1 rounded-lg border-b bg-white p-8 dark:bg-zinc-800">
      <div className="mx-auto max-w-6xl">
        <div className="flex gap-4">
          <ProfileImage user={user} />

          <div className="flex-grow">
            <div className="mb-4 flex flex-wrap items-center gap-4">
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
                    onFollowStateChange={newState => {
                      onFollowChange?.(newState);
                    }}
                    onNeedsLogin={() => setIsLoginModalOpen(true)}
                    onCountUpdate={count => {
                      setLocalFollowersCount(count);
                    }}
                  />
                )}

                {!isClaimed && session && !isOwnProfile && (
                  <ClaimBrandButton brandName={brandName} brandDomain={getBrandDomain(brandName)} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onOpenChange={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
