"use client";

import LoginModal from "@/app/components/login-modal";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BrandProfileProps } from "../types";
import FollowButton from "./follow-button";
import ProfileImage from "./profile-image";
import ProfileInfo from "./profile-info";

export default function BrandProfileHeader({
  brandName,
  user,
  newsletterCount,
  followersCount: initialFollowersCount,
  isFollowing = false,
  onFollowChange,
}: BrandProfileProps) {
  const { data: session } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);

  // Update followers count when logged in
  useEffect(() => {
    if (session?.user) {
      fetch(`/api/follow/count?targetId=${user?.user_id || brandName}&isUnclaimed=${!user}`)
        .then(res => res.json())
        .then(data => setFollowersCount(data.count))
        .catch(console.error);
    }
  }, [session, user, brandName]);
  
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
                  followersCount={followersCount}
                />
              </div>
              
              <div className="flex gap-2">
                <FollowButton 
                  targetId={user?.user_id || brandName}
                  isUnclaimed={!user}
                  initialIsFollowing={isFollowing}
                  onFollowStateChange={(newState) => {
                    onFollowChange?.(newState);
                  }}
                  onNeedsLogin={() => setIsLoginModalOpen(true)}
                  onCountUpdate={(count) => setFollowersCount(count)}
                />
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