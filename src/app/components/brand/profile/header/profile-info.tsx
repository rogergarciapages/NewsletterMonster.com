"use client";

import { Button } from "@nextui-org/react";
import { BrandUser } from "../types";
import SocialLinks from "./social-links";
import Stats from "./stats";

interface ProfileInfoProps {
  brandName: string;
  user: BrandUser | null;
  newsletterCount: number;
  followersCount: number;
  onClaimProfile?: () => void;
}

export default function ProfileInfo({
  brandName,
  user,
  newsletterCount,
  followersCount,
  onClaimProfile,
}: ProfileInfoProps) {
  return (
    <div className="flex-grow">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <h1 className="text-4xl font-bold text-[#111] tracking-tight leading-tight dark:text-white">
          {brandName}
        </h1>
        <div className="flex gap-2">
          {!user && (
            <Button
              color="warning"
              variant="solid"
              size="sm"
              onClick={onClaimProfile}
            >
              Claim Your Profile
            </Button>
          )}
        </div>
      </div>

      <Stats 
        newsletterCount={newsletterCount}
        followersCount={followersCount}
      />

      <div className="mb-4">
        <p className="text-sm text-gray-800 dark:text-white">
          {user?.bio || "No info in your profile, yet. Claim your profile today!"}
        </p>
      </div>

      <SocialLinks user={user} />
    </div>
  );
}